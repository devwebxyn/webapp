import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';

// Konfigurasi Aplikasi
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = 'https://www.googleapis.com/auth/drive';

// --- Definisi Tipe Data yang Diekspor ---
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  rawSize?: number;
  webViewLink?: string;
  shared: boolean;
  createdTime: string;
  modifiedTime: string;
}

interface StorageQuota {
  usage: number;
  limit: number;
}

interface GoogleTokenResponse {
  access_token: string;
  error?: any;
}

export interface FolderNode {
  id: string;
  name: string;
  children: FolderNode[];
}

export const useGoogleDrive = () => {
  const [isLinked, setIsLinked] = useState(false);
  const [files, setFiles] = useState<DriveFile[]>([]); // Untuk tampilan folder saat ini
  const [allFiles, setAllFiles] = useState<DriveFile[]>([]); // STATE BARU: Untuk semua item di Drive
  const [isLoading, setIsLoading] = useState(true);
  const [isApiReady, setIsApiReady] = useState(false);
  const [storageQuota, setStorageQuota] = useState<StorageQuota | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string; name: string }[]>([{ id: 'root', name: 'My Drive' }]);
  const tokenClientRef = useRef<any>(null);

  
  const unlinkAccount = useCallback(() => {
    const token = window.gapi.client.getToken();
    if (token?.access_token) {
      window.google.accounts.oauth2.revoke(token.access_token, () => {});
    }
    window.gapi.client.setToken(null);
    setIsLinked(false);
    setFiles([]);
    setAllFiles([]);
    setStorageQuota(null);
    localStorage.removeItem('googleDriveLinked');
    localStorage.removeItem('googleDriveToken');
  }, []);

  
  const getStorageQuota = useCallback(async () => {
    try {
      const response = await window.gapi.client.drive.about.get({ fields: 'storageQuota' });
      const quota = response.result.storageQuota;
      if (quota?.usageInDrive && quota.limit) {
        setStorageQuota({
          usage: parseInt(quota.usageInDrive, 10),
          limit: parseInt(quota.limit, 10),
        });
      }
    } catch (error) {
      console.error('Gagal mendapatkan kuota penyimpanan:', error);
      unlinkAccount();
    }
  }, [unlinkAccount]);

  
  const listFiles = useCallback(async (folderId: string) => {
    setIsLoading(true);
    try {
      const response = await window.gapi.client.drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'files(id, name, mimeType, size, webViewLink, shared, createdTime, modifiedTime)',
        orderBy: 'folder, name',
        pageSize: 1000,
      });

      const fetchedFiles = (response.result.files || []).map((file: any) => ({
        id: file.id!,
        name: file.name!,
        mimeType: file.mimeType!,
        size: file.mimeType.includes('folder') ? 'Folder' : file.size ? (parseInt(file.size, 10) / 1024 / 1024).toFixed(2) + ' MB' : '0 Bytes',
        rawSize: file.size ? parseInt(file.size, 10) : 0,
        webViewLink: file.webViewLink,
        shared: file.shared || false,
        createdTime: file.createdTime,
        modifiedTime: file.modifiedTime,
      }));
      
      setFiles(fetchedFiles);
    } catch (error) {
      console.error("Gagal mengambil file:", error);
      toast.error("Gagal memuat file. Sesi Anda mungkin berakhir.");
      unlinkAccount();
    } finally {
        setIsLoading(false);
    }
  }, [unlinkAccount]);

  
  const fetchAllDriveItems = useCallback(async () => {
    setIsLoading(true);
    const allFetchedFiles: DriveFile[] = [];
    let pageToken: string | undefined = undefined;
    try {
      do {
        const response: any = await window.gapi.client.drive.files.list({
          q: "trashed = false",
          fields: 'nextPageToken, files(id, name, mimeType, size, shared, createdTime, modifiedTime, webViewLink)',
          pageSize: 1000,
          pageToken: pageToken,
        });
        const pageFiles = (response.result.files || []).map((file: any) => ({
          id: file.id!, name: file.name!, mimeType: file.mimeType!,
          rawSize: file.size ? parseInt(file.size, 10) : 0,
          size: file.mimeType.includes('folder') ? 'Folder' : file.size ? (parseInt(file.size, 10) / 1024 / 1024).toFixed(2) + ' MB' : '0 Bytes',
          webViewLink: file.webViewLink, shared: file.shared || false,
          createdTime: file.createdTime, modifiedTime: file.modifiedTime,
        }));
        allFetchedFiles.push(...pageFiles);
        pageToken = response.result.nextPageToken;
      } while (pageToken);
      setAllFiles(allFetchedFiles);
    } catch (error) {
      console.error("Gagal mengambil semua file:", error);
      unlinkAccount();
    } finally {
      setIsLoading(false);
    }
  }, [unlinkAccount]);
  
  const navigateToFolder = useCallback(async (folderId: string, folderName: string) => {
    if (folderId === currentFolderId) return;
    
    const existingIndex = breadcrumbs.findIndex((b) => b.id === folderId);
    if (existingIndex !== -1) {
        setBreadcrumbs(breadcrumbs.slice(0, existingIndex + 1));
    } else {
        setBreadcrumbs((prev) => [...prev, { id: folderId, name: folderName }]);
    }

    setCurrentFolderId(folderId);
    await listFiles(folderId);
  }, [currentFolderId, breadcrumbs, listFiles]);

  
  const getFolderTree = useCallback(async (): Promise<FolderNode[]> => {
    try {
      const response = await window.gapi.client.drive.files.list({
        q: "mimeType = 'application/vnd.google-apps.folder' and trashed = false",
        fields: 'files(id, name, parents)',
        pageSize: 1000,
      });

      const folders = response.result.files || [];
      const folderMap = new Map<string, FolderNode>();
      const rootFolders: FolderNode[] = [];

      folders.forEach((folder: gapi.client.drive.File) => {
        folderMap.set(folder.id!, { id: folder.id!, name: folder.name!, children: [] });
      });

      folders.forEach((folder: gapi.client.drive.File) => {
        if (folder.parents) {
          const parentId = folder.parents[0];
          const parentNode = folderMap.get(parentId);
          if (parentNode) {
            parentNode.children.push(folderMap.get(folder.id!)!);
          } else {
            rootFolders.push(folderMap.get(folder.id!)!);
          }
        } else {
            rootFolders.push(folderMap.get(folder.id!)!);
        }
      });

      return [{ id: 'root', name: 'My Drive (Root)', children: rootFolders }];
    } catch (error) {
      console.error("Gagal mengambil struktur folder:", error);
      toast.error("Gagal memuat struktur folder.");
      return [];
    }
  }, []);

  
  useEffect(() => {
    const onAuthSuccess = async (tokenResponse: GoogleTokenResponse) => {
      window.gapi.client.setToken({ access_token: tokenResponse.access_token });
      localStorage.setItem('googleDriveToken', tokenResponse.access_token);
      setIsLinked(true);
      localStorage.setItem('googleDriveLinked', 'true');
      await listFiles('root'); 
      await fetchAllDriveItems(); 
      await getStorageQuota();
    };

    const initializeGapiClient = async () => {
      await new Promise<void>((resolve) => window.gapi.load('client', resolve));
      await window.gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
      });

      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse: GoogleTokenResponse) => {
          if (tokenResponse.error) {
            setIsLoading(false);
            setIsLinked(false);
            localStorage.removeItem('googleDriveLinked');
            localStorage.removeItem('googleDriveToken');
          } else {
            onAuthSuccess(tokenResponse);
          }
        },
      });

      setIsApiReady(true);

      const savedToken = localStorage.getItem('googleDriveToken');
      if (localStorage.getItem('googleDriveLinked') === 'true' && savedToken) {
        window.gapi.client.setToken({ access_token: savedToken });
        setIsLinked(true);
        await listFiles('root');
        await fetchAllDriveItems();
        await getStorageQuota();
      } else {
        setIsLoading(false);
      }
    };

    const checkScriptsAndInit = () => {
      if (window.gapi && window.google) {
        initializeGapiClient();
      } else {
        setTimeout(checkScriptsAndInit, 100);
      }
    };

    checkScriptsAndInit();
  }, [getStorageQuota, listFiles, unlinkAccount, fetchAllDriveItems]);

  
  const linkAccount = () => {
    if (tokenClientRef.current) {
      tokenClientRef.current.requestAccessToken({ prompt: 'consent' });
    } else {
      toast.error('Layanan Google belum siap. Coba lagi nanti.');
    }
  };

  
  const uploadFile = async (
    fileToUpload: File,
    parentId: string,
    onProgress: (progress: number) => void
  ) => {
    const token = window.gapi.client.getToken();
    if (!token?.access_token) {
      toast.error("Sesi Anda telah berakhir. Silakan tautkan ulang akun Anda.");
      unlinkAccount();
      return;
    }

    const metadata = { name: fileToUpload.name, parents: [parentId] };
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', fileToUpload);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + token.access_token);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };

    xhr.onload = async () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        toast.success(`File "${response.name}" berhasil diunggah.`);
        await listFiles(currentFolderId);
        await getStorageQuota();
        await fetchAllDriveItems();
      } else {
        console.error("Upload gagal:", xhr.responseText);
        toast.error(`Gagal mengunggah file: ${JSON.parse(xhr.responseText).error.message}`);
      }
      onProgress(100);
    };

    xhr.onerror = () => {
      toast.error("Terjadi kesalahan jaringan saat mengunggah file.");
      onProgress(100);
    };

    xhr.send(form);
  };

  
  const createFolder = async (name: string) => {
    setIsLoading(true);
    try {
      const metadata = { name, mimeType: 'application/vnd.google-apps.folder', parents: [currentFolderId] };
      await window.gapi.client.drive.files.create({ resource: metadata });
      toast.success(`Folder "${name}" berhasil dibuat.`);
      await listFiles(currentFolderId);
      await fetchAllDriveItems();
    } catch (error) {
      toast.error('Gagal membuat folder.');
    } finally {
      setIsLoading(false);
    }
  };

  
  const deleteItem = async (itemId: string, itemName: string) => {
    setIsLoading(true);
    try {
      await window.gapi.client.drive.files.update({
        fileId: itemId,
        resource: { trashed: true },
      });
      toast.success(`"${itemName}" berhasil dipindahkan ke sampah.`);
      await listFiles(currentFolderId);
      await fetchAllDriveItems();
    } catch (error) {
      toast.error('Gagal menghapus item.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const setFilePermission = async (fileId: string, isPublic: boolean, mimeType: string) => {
    if (mimeType.includes('folder')) {
      const shareUrl = `https://drive.google.com/file/d/${fileId}/edit?usp=sharing`;
      window.open(shareUrl, '_blank');
      toast.info("Silakan kelola izin folder di tab baru yang terbuka.");
      return;
    }

    setIsLoading(true);
    try {
      if (!isPublic) {
        const permList = await window.gapi.client.drive.permissions.list({ fileId, fields: 'permissions(id,type)' });
        const anyonePerm = permList.result.permissions?.find((p: any) => p.type === 'anyone');
        if (anyonePerm?.id) {
          await window.gapi.client.drive.permissions.delete({ fileId, permissionId: anyonePerm.id });
        }
      } else {
        await window.gapi.client.drive.permissions.create({ fileId, resource: { role: 'reader', type: 'anyone' } });
      }
      toast.success(`Izin file berhasil diubah.`);
      await listFiles(currentFolderId);
    } catch (err) {
      console.error('Gagal mengubah izin:', err);
      toast.error('Gagal mengubah izin file.');
    } finally {
      setIsLoading(false);
    }
  };

  
  return {
    isLinked, files, allFiles,
    isLoading, isApiReady, storageQuota,
    breadcrumbs, currentFolderId,
    linkAccount, unlinkAccount, uploadFile, navigateToFolder,
    createFolder, deleteItem, setFilePermission,
    refreshAllData: fetchAllDriveItems,
    getFolderTree,
  };
};

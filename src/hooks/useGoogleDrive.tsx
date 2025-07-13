import { ErrorBoundary } from 'react-error-boundary';
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';

declare const gapi: any;
declare const google: any;

// Konfigurasi
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SCOPES = 'https://www.googleapis.com/auth/drive';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 menit

// Tipe data
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
  shared?: boolean;
  thumbnailLink?: string;
  parents?: string[];
  isFeatured?: boolean;
  rawSize?: number;
  createdTime?: string;
  shareUrl?: string;
}

export interface Breadcrumb {
  id: string;
  name: string;
}

export interface FolderNode {
  id: string;
  name: string;
  children: FolderNode[];
}

interface CacheItem {
  files: DriveFile[];
  timestamp: number;
  nextPageToken?: string;
}

const useGoogleDrive = () => {
  // State
  const [isLinked, setIsLinked] = useState(false);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [allFiles, setAllFiles] = useState<DriveFile[]>([]);
  const [storageQuota, setStorageQuota] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([
    { id: 'root', name: 'My Drive' }
  ]);
  const [hasMore, setHasMore] = useState(true);
  const [featuredFiles, setFeaturedFiles] = useState<DriveFile[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('featuredFiles');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Toggle file favorit
  const toggleFeaturedFile = useCallback((file: DriveFile, isFeatured: boolean) => {
    setFeaturedFiles(prev => {
      let updated: DriveFile[];
      
      if (isFeatured) {
        // Tambahkan ke favorit jika belum ada
        if (!prev.some(f => f.id === file.id)) {
          updated = [...prev, { ...file, isFeatured: true }];
          // Simpan ke localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('featuredFiles', JSON.stringify(updated));
          }
        } else {
          updated = prev;
        }
      } else {
        // Hapus dari favorit
        updated = prev.filter(f => f.id !== file.id);
        if (typeof window !== 'undefined') {
          localStorage.setItem('featuredFiles', JSON.stringify(updated));
        }
      }
      
      // Update properti isFeatured pada file yang ditampilkan
      setFiles(currentFiles => 
        currentFiles.map(f => 
          f.id === file.id ? { ...f, isFeatured } : f
        )
      );
      
      return updated;
    });
  }, [];
  
  // Refs
  const nextPageTokenRef = useRef<string | undefined>(undefined);
  const loadingRef = useRef(false);
  const cacheRef = useRef<Record<string, CacheItem>>({});
  const tokenClientRef = useRef<any>(null);

  // Inisialisasi Google API dengan GIS (Google Identity Services)
  useEffect(() => {
    const initGapi = async () => {
      try {
        await new Promise((resolve) => {
          gapi.load('client', resolve);
        });
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        });

        // Restore token jika ada di localStorage
        const savedToken = localStorage.getItem('googleDriveToken');
        if (savedToken) {
          gapi.client.setToken({ access_token: savedToken });
          setIsLinked(true);

          // Cek token valid dengan request kecil
          try {
            await gapi.client.drive.about.get({ fields: 'user' });
          } catch (err: any) {
            // Jika error 401, paksa login ulang
            if (err.status === 401) {
              localStorage.removeItem('googleDriveToken');
              setIsLinked(false);
              toast.error('Sesi Google Drive Anda sudah habis. Silakan login ulang.');
            }
          }
        }

        // Initialize Google Identity Services
        if (typeof google !== 'undefined' && google.accounts) {
          tokenClientRef.current = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: async (response: any) => {
              if (response.error) {
                console.error('Token error:', response.error);
                toast.error('Gagal mendapatkan token akses');
                setIsLoading(false);
                return;
              }
              
              // Set access token for gapi client
              gapi.client.setToken({ access_token: response.access_token });
              localStorage.setItem('googleDriveToken', response.access_token); // Simpan token
              setIsLinked(true);
              
              try {
                await Promise.all([
                  listFiles('root'),
                  loadAllFiles(),
                  loadStorageQuota()
                ]);
              } catch (error) {
                console.error('Error loading initial data:', error);
              }
            },
          });

          // Check if user has existing valid token
          const token = gapi.client.getToken();
          if (token && token.access_token) {
            setIsLinked(true);
            try {
              await Promise.all([
                listFiles('root'),
                loadAllFiles(),
                loadStorageQuota()
              ]);
            } catch (error) {
              console.error('Error loading initial data:', error);
              // Token might be expired, clear it
              gapi.client.setToken(null);
              setIsLinked(false);
            }
          }
        } else {
          console.error('Google Identity Services not available');
          toast.error('Google Identity Services tidak tersedia');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing Google API:', error);
        toast.error('Gagal menginisialisasi Google API');
        setIsLoading(false);
      }
    };
    
    initGapi();
    
    return () => {
      // Cleanup
    };
  }, []);

  // Function to sign in
  const signIn = useCallback(() => {
    if (tokenClientRef.current) {
      tokenClientRef.current.requestAccessToken();
    } else {
      toast.error('Google API belum diinisialisasi');
    }
  }, []);

  // Function to sign out
  const signOut = useCallback(() => {
    const token = gapi.client.getToken();
    if (token) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken(null);
    }
    localStorage.removeItem('googleDriveToken'); // Hapus token
    setIsLinked(false);
    setFiles([]);
    setAllFiles([]);
    setStorageQuota(null);
    setCurrentFolderId('root');
    setBreadcrumbs([{ id: 'root', name: 'My Drive' }]);
  }, []);

  // Load all files for overview
  const loadAllFiles = useCallback(async () => {
    try {
      const allFilesData: DriveFile[] = [];
      let pageToken: string | undefined = undefined;
      do {
        const response: any = await gapi.client.drive.files.list({
          pageSize: 1000,
          fields: 'nextPageToken, files(id, name, mimeType, size, modifiedTime, webViewLink, shared, thumbnailLink, parents)',
          q: 'trashed = false',
          pageToken: pageToken,
        });

        const items = response.result.files || [];
        const formattedFiles = items.map((file: any) => ({
          id: file.id,
          name: file.name,
          mimeType: file.mimeType,
          size: file.size ? formatFileSize(parseInt(file.size)) : undefined,
          rawSize: file.size ? parseInt(file.size) : 0,
          modifiedTime: file.modifiedTime,
          webViewLink: file.webViewLink,
          shared: file.shared || false,
          thumbnailLink: file.thumbnailLink,
          parents: file.parents,
          isFeatured: featuredFiles.some(f => f.id === file.id)
        }));

        allFilesData.push(...formattedFiles);
        pageToken = response.result.nextPageToken;
      } while (pageToken);

      setAllFiles(allFilesData);
    } catch (error) {
      console.error('Error loading all files:', error);
    }
  }, [featuredFiles]);

  // Load storage quota
  const loadStorageQuota = useCallback(async () => {
    try {
      const response: any = await gapi.client.drive.about.get({
        fields: 'storageQuota'
      });
      setStorageQuota(response.result.storageQuota);
    } catch (error) {
      console.error('Error loading storage quota:', error);
    }
  }, [];
  
  // Format ukuran file
  const formatFileSize = (bytes: number): string => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Dapatkan daftar file
  const listFiles = useCallback(async (folderId: string = 'root', pageToken?: string) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setIsLoading(true);

    try {
      const cacheKey = `${folderId}-${pageToken || 'first'}`;
      const cached = cacheRef.current[cacheKey];
      
      if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
        setFiles(cached.files);
        nextPageTokenRef.current = cached.nextPageToken;
        setHasMore(!!cached.nextPageToken);
        return;
      }

      const response: any = await gapi.client.drive.files.list({
        pageSize: 50,
        fields: 'nextPageToken, files(id, name, mimeType, size, modifiedTime, webViewLink, shared, thumbnailLink, parents, capabilities/canShare)',
        q: `'${folderId}' in parents and trashed = false`,
        orderBy: 'folder,modifiedTime desc',
        pageToken: pageToken,
        supportsAllDrives: false,
        includeItemsFromAllDrives: false,
      });

      const items = response.result.files || [];
      const formattedFiles = items.map((file: any) => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        size: file.size ? formatFileSize(parseInt(file.size)) : undefined,
        rawSize: file.size ? parseInt(file.size) : 0,
        modifiedTime: file.modifiedTime,
        webViewLink: file.webViewLink,
        shared: file.shared || false,
        thumbnailLink: file.thumbnailLink,
        parents: file.parents,
        isFeatured: featuredFiles.some(f => f.id === file.id)
      }));

      // Update cache
      cacheRef.current[cacheKey] = {
        files: formattedFiles,
        timestamp: Date.now(),
        nextPageToken: response.result.nextPageToken
      };

      setFiles(formattedFiles);
      nextPageTokenRef.current = response.result.nextPageToken;
      setHasMore(!!response.result.nextPageToken);
      setCurrentFolderId(folderId);
      
      // Update breadcrumbs jika folder berubah
      if (folderId !== currentFolderId) {
        if (folderId === 'root') {
          setBreadcrumbs([{ id: 'root', name: 'My Drive' }]);
        } else {
          try {
            const folder = await gapi.client.drive.files.get({
              fileId: folderId,
              fields: 'id, name, parents'
            });
            
            const newBreadcrumbs: Breadcrumb[] = [];
            let current = folder.result;
            
            while (current.parents && current.parents.length > 0) {
              const parentId = current.parents[0];
              const parent = await gapi.client.drive.files.get({
                fileId: parentId,
                fields: 'id, name, parents'
              });
              newBreadcrumbs.unshift({ id: parentId, name: parent.result.name });
              current = parent.result;
            }
            
            setBreadcrumbs([
              { id: 'root', name: 'My Drive' },
              ...newBreadcrumbs,
              { id: folderId, name: folder.result.name }
            ]);
          } catch (error) {
            console.error('Error getting folder info:', error);
            setBreadcrumbs([{ id: 'root', name: 'My Drive' }]);
          }
        }
      }
    } catch (error) {
      console.error('Error listing files:', error);
      toast.error('Gagal memuat daftar file');
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [currentFolderId, featuredFiles]);

  // Load more files (pagination)
  const loadMoreFiles = useCallback(async () => {
    if (!nextPageTokenRef.current || !hasMore || loadingRef.current) return;
    await listFiles(currentFolderId, nextPageTokenRef.current);
  }, [currentFolderId, hasMore, listFiles]);

  // Clear cache
  const clearCache = useCallback(() => {
    cacheRef.current = {};
  }, []);

  // Upload file
  const uploadFile = useCallback(async (file: File, folderId: string = 'root') => {
    try {
      setIsLoading(true);
      
      const metadata = {
        name: file.name,
        mimeType: file.type,
        parents: [folderId]
      };

      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      await new Promise<void>((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            const content = e.target?.result as ArrayBuffer;
            const response: any = await gapi.client.request({
              path: 'https://www.googleapis.com/upload/drive/v3/files',
              method: 'POST',
              params: { uploadType: 'media' },
              headers: { 'Content-Type': file.type },
              body: content,
            });

            await gapi.client.drive.files.update({
              fileId: response.result.id,
              resource: metadata
            });

            // Clear cache for this folder
            Object.keys(cacheRef.current).forEach(key => {
              if (key.startsWith(folderId)) {
                delete cacheRef.current[key];
              }
            });

            // Refresh file list
            await listFiles(folderId);
            toast.success('File berhasil diunggah');
            resolve();
          } catch (error) {
            reject(error);
          }
        };

        reader.onerror = (error) => {
          reject(error);
        };
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Gagal mengunggah file');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [listFiles]);

  // Create folder
  const createFolder = useCallback(async (name: string, parentId: string = 'root') => {
    try {
      setIsLoading(true);
      
      const folderMetadata = {
        name: name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentId]
      };

      await gapi.client.drive.files.create({
        resource: folderMetadata,
        fields: 'id, name, mimeType, webViewLink, shared'
      });

      // Clear cache for parent folder
      Object.keys(cacheRef.current).forEach(key => {
        if (key.startsWith(parentId)) {
          delete cacheRef.current[key];
        }
      });

      // Refresh file list
      await listFiles(parentId);
      toast.success('Folder berhasil dibuat');
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Gagal membuat folder');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [listFiles]);

  // Delete file/folder
  const deleteFile = useCallback(async (fileId: string, fileName: string) => {
    try {
      setIsLoading(true);
      
      await gapi.client.drive.files.delete({
        fileId: fileId
      });

      // Remove from featured files if exists
      const newFeatured = featuredFiles.filter(f => f.id !== fileId);
      if (newFeatured.length !== featuredFiles.length) {
        setFeaturedFiles(newFeatured);
        localStorage.setItem('featuredFiles', JSON.stringify(newFeatured));
      }

      // Clear cache for parent folder
      const parentFolder = files.find(f => f.id === fileId)?.parents?.[0] || 'root';
      Object.keys(cacheRef.current).forEach(key => {
        if (key.startsWith(parentFolder)) {
          delete cacheRef.current[key];
        }
      });

      // Refresh file list
      await listFiles(currentFolderId);
      toast.success(`"${fileName}" berhasil dihapus`);
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Gagal menghapus file');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentFolderId, files, featuredFiles, listFiles]);

  // Set file permission
  const setFilePermission = useCallback(async (fileId: string, isPublic: boolean) => {
    try {
      if (isPublic) {
        await gapi.client.drive.permissions.create({
          fileId: fileId,
          resource: {
            type: 'anyone',
            role: 'reader'
          },
          fields: 'id'
        });
      } else {
        // Remove public permissions
        const permissions = await gapi.client.drive.permissions.list({
          fileId: fileId,
          fields: 'permissions(id,role,type)'
        });

        const publicPermissions = permissions.result.permissions?.filter(
          (p: any) => p.type === 'anyone' && p.role === 'reader'
        ) || [];

        for (const perm of publicPermissions) {
          await gapi.client.drive.permissions.delete({
            fileId: fileId,
            permissionId: perm.id
          });
        }
      }

      // Clear cache and refresh
      clearCache();
      await listFiles(currentFolderId);
      
      return true;
    } catch (error) {
      console.error('Error setting file permission:', error);
      toast.error('Gagal mengubah izin file');
      throw error;
    }
  }, [clearCache, currentFolderId, listFiles]);

  // Download file
  const downloadFile = useCallback(async (file: DriveFile) => {
    try {
      let downloadUrl;
      
      if (file.mimeType?.includes('google-apps')) {
        // For Google Docs/Sheets/Slides, use export
        const exportType = {
          'application/vnd.google-apps.document': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.google-apps.spreadsheet': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.google-apps.presentation': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/vnd.google-apps.drawing': 'image/png'
        }[file.mimeType] || 'application/pdf';
        
        downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=${exportType}`;
      } else {
        // For regular files
        downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
      }

      // Get download URL with access token
      const token = gapi.client.getToken().access_token;
      const url = `${downloadUrl}&access_token=${token}`;
      
      // Open download in new tab
      window.open(url, '_blank');
      
      return true;
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Gagal mengunduh file');
      throw error;
    }
  }, []);

  // Get folder tree (for upload destination modal)
  const getFolderTree = useCallback(async (): Promise<FolderNode[]> => {
    try {
      const response: any = await gapi.client.drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder' and trashed = false",
        fields: 'files(id, name, parents)',
        pageSize: 1000
      });

      const folders = response.result.files || [];
      
      // Build tree structure
      const folderMap = new Map<string, FolderNode>();
      const rootFolders: FolderNode[] = [];

      // Initialize all folders
      folders.forEach((folder: any) => {
        folderMap.set(folder.id, {
          id: folder.id,
          name: folder.name,
          children: []
        });
      });

      // Build hierarchy
      folders.forEach((folder: any) => {
        const node = folderMap.get(folder.id)!;
        if (folder.parents && folder.parents.length > 0) {
          const parentId = folder.parents[0];
          const parent = folderMap.get(parentId);
          if (parent) {
            parent.children.push(node);
          } else {
            // Parent not in our folder list (might be root or shared)
            rootFolders.push(node);
          }
        } else {
          rootFolders.push(node);
        }
      });

      return rootFolders;
    } catch (error) {
      console.error('Error getting folder tree:', error);
      return [];
    }
  }, []);

  // Alias functions for backward compatibility
  const linkAccount = signIn;
  const unlinkAccount = signOut;
  const isApiReady = !isLoading;

  return {
    isLinked,
    files,
    allFiles,
    storageQuota,
    isLoading,
    currentFolderId,
    breadcrumbs,
    hasMore,
    featuredFiles,
    listFiles,
    loadAllFiles,
    loadStorageQuota,
    loadMoreFiles,
    clearCache,
    uploadFile,
    createFolder,
    deleteFile,
    setFilePermission,
    downloadFile,
    getFolderTree,
    formatFileSize,
    toggleFeaturedFile,
    signIn,
    signOut,
    linkAccount,
    unlinkAccount,
    isApiReady
  };
};

function App() {
  return (
    <ErrorBoundary fallback={<div>Terjadi kesalahan. Silakan refresh halaman.</div>}>
      <div>
        {/* Your app components go here */}
      </div>
    </ErrorBoundary>
  );
}

export { useGoogleDrive };

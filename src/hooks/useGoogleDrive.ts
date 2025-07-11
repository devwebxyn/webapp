import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';

// Konfigurasi Aplikasi
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const APP_FOLDER_NAME = 'cloudnest';

interface DriveFile {
  id: string;
  name: string;
  size?: string;
  webViewLink?: string;
  shared: boolean;
}

export const useGoogleDrive = () => {
  const [isLinked, setIsLinked] = useState(false);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApiReady, setIsApiReady] = useState(false);
  const [appFolderId, setAppFolderId] = useState<string | null>(null);

  const tokenClientRef = useRef<any>(null);

  const listFiles = useCallback(async (folderId: string) => {
    setIsLoading(true);
    try {
      const response = await window.gapi.client.drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'files(id, name, size, webViewLink, shared)',
        orderBy: 'modifiedTime desc',
      });

      const driveFiles: DriveFile[] = response.result.files?.map((file: any) => ({
        id: file.id!,
        name: file.name!,
        size: file.size ? (parseInt(file.size, 10) / 1024 / 1024).toFixed(2) + ' MB' : 'Folder',
        webViewLink: file.webViewLink,
        shared: file.shared || false,
      })) || [];
      setFiles(driveFiles);
    } catch (error) {
      console.error('Gagal memuat file:', error);
      toast.error('Gagal memuat daftar file dari Google Drive.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const findOrCreateAppFolder = useCallback(async (): Promise<string> => {
    const response = await window.gapi.client.drive.files.list({
      q: `name='${APP_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id)',
    });

    if (response.result.files && response.result.files.length > 0) {
      return response.result.files[0].id!;
    } else {
      const fileMetadata = {
        name: APP_FOLDER_NAME,
        mimeType: 'application/vnd.google-apps.folder',
      };
      const createResponse = await window.gapi.client.drive.files.create({
        resource: fileMetadata,
        fields: 'id',
      });
      return createResponse.result.id!;
    }
  }, []);

  const handleAuthCallback = useCallback(async (tokenResponse: any) => {
    if (tokenResponse && tokenResponse.access_token) {
      window.gapi.client.setToken({ access_token: tokenResponse.access_token });
      setIsLinked(true);
      localStorage.setItem('googleDriveLinked', 'true');
      const folderId = await findOrCreateAppFolder();
      setAppFolderId(folderId);
      localStorage.setItem('appFolderId', folderId);
      await listFiles(folderId);
    }
  }, [findOrCreateAppFolder, listFiles]);

  useEffect(() => {
    const initializeClients = () => {
      window.gapi.load('client', async () => {
        await window.gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        });
      });

      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        prompt: '',
        callback: handleAuthCallback,
        error_callback: () => {
          toast.error(
            "Gagal menautkan akun. Pop-up mungkin diblokir. Silakan hubungi developer.",
            { autoClose: 10000 }
          );
        },
      });

      setIsApiReady(true);
      setIsLoading(false);
    };

    const checkScriptsReady = () => {
      if (window.gapi && window.google) {
        initializeClients();
      } else {
        setTimeout(checkScriptsReady, 100);
      }
    };

    checkScriptsReady();
  }, [handleAuthCallback]);

  const linkAccount = (customErrorCallback?: (error: any) => void) => {
    const errorCallback = customErrorCallback || (() => {
      toast.error("Gagal menautkan akun. Pop-up mungkin diblokir.");
    });

    if (tokenClientRef.current) {
      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        prompt: '',
        callback: handleAuthCallback,
        error_callback: errorCallback,
      });
      tokenClientRef.current.requestAccessToken({ prompt: 'consent' });
    } else {
      console.error("Google Token Client belum siap.");
    }
  };

  const unlinkAccount = () => {
    const token = window.gapi.client.getToken();
    if (token?.access_token) {
      window.google.accounts.oauth2.revoke(token.access_token, () => {});
    }
    window.gapi.client.setToken(null);
    setIsLinked(false);
    setFiles([]);
    localStorage.removeItem('googleDriveLinked');
    localStorage.removeItem('appFolderId');
  };

  const uploadFile = async (file: File) => {
    if (!appFolderId) return alert('Folder aplikasi tidak ditemukan.');
    setIsLoading(true);
    const metadata = { name: file.name, parents: [appFolderId] };
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: new Headers({
        Authorization: 'Bearer ' + window.gapi.client.getToken().access_token,
      }),
      body: form,
    });

    toast.success(`File "${file.name}" berhasil diunggah!`);
    await listFiles(appFolderId);
  };

  const setFilePermission = async (fileId: string, share: boolean) => {
    setIsLoading(true);
    try {
      if (!share) {
        const permList = await window.gapi.client.drive.permissions.list({
          fileId,
          fields: 'permissions(id,type)',
        });
        const anyonePerm = permList.result.permissions?.find((p: any) => p.type === 'anyone');
        if (anyonePerm?.id) {
          await window.gapi.client.drive.permissions.delete({
            fileId,
            permissionId: anyonePerm.id,
          });
        }
      } else {
        await window.gapi.client.drive.permissions.create({
          fileId,
          resource: { role: 'reader', type: 'anyone' },
        });
      }
    } catch (err: any) {
      console.error('Gagal mengubah izin:', err);
    } finally {
      if (appFolderId) await listFiles(appFolderId);
    }
  };

  return {
    isLinked,
    files,
    isLoading,
    isApiReady,
    linkAccount,
    unlinkAccount,
    uploadFile,
    setFilePermission,
  };
};

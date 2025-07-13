/// <reference types="vite/client" />

import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';

declare const gapi: any;
declare const google: any;

// Configuration
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SCOPES = 'https://www.googleapis.com/auth/drive';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

// Exported Data Types
export interface DriveFile {
  [x: string]: any;
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

// Main Hook
export const useGoogleDrive = () => {
  // State
  const [isLinked, setIsLinked] = useState(false);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [allFiles, setAllFiles] = useState<DriveFile[]>([]);
  const [trashedFiles, setTrashedFiles] = useState<DriveFile[]>([]);
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

  // Refs
  const nextPageTokenRef = useRef<string | undefined>(undefined);
  const loadingRef = useRef(false);
  const cacheRef = useRef<Record<string, CacheItem>>({});
  const tokenClientRef = useRef<any>(null);
  const signInPromiseRef = useRef<{ resolve: () => void; reject: (error: any) => void; } | null>(null);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Toggle file favorit
  const toggleFeaturedFile = useCallback(async (file: DriveFile, isFeatured: boolean) => {
    setFeaturedFiles(prev => {
      let updated: DriveFile[];
      if (isFeatured) {
        if (!prev.some(f => f.id === file.id)) {
          updated = [...prev, { ...file, isFeatured: true }];
        } else {
          updated = prev;
        }
      } else {
        updated = prev.filter(f => f.id !== file.id);
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('featuredFiles', JSON.stringify(updated));
      }
      
      return updated;
    });
    
    // Update file list in real-time
    setFiles(currentFiles =>
      currentFiles.map(f =>
        f.id === file.id ? { ...f, isFeatured } : f
      )
    );
    
    return true;
  }, []);

  // Load all files for overview
  const loadAllFiles = useCallback(async () => {
    try {
      const allFilesData: DriveFile[] = [];
      let pageToken: string | undefined = undefined;
      
      do {
        const response: any = await gapi.client.drive.files.list({
          pageSize: 1000,
          fields: 'nextPageToken, files(id, name, mimeType, size, modifiedTime, webViewLink, shared, thumbnailLink, parents, createdTime)',
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
          createdTime: file.createdTime,
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
  }, [featuredFiles, formatFileSize]);

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
  }, []);

  // Fungsi untuk mengambil daftar file di sampah
  const listTrash = useCallback(async () => {
    if (!isLinked) return;
    setIsLoading(true);
    try {
      const response = await gapi.client.drive.files.list({
        q: 'trashed = true',
        fields: 'files(id, name, mimeType, size, modifiedTime)',
        pageSize: 100,
      });
      const items = response.result.files || [];
      setTrashedFiles(items.map((file: any) => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        size: file.size ? formatFileSize(parseInt(file.size)) : undefined,
        modifiedTime: file.modifiedTime,
      })));
    } catch (error) {
      console.error('Error listing trash:', error);
      toast.error("Gagal memuat item di sampah.");
    } finally {
      setIsLoading(false);
    }
  }, [isLinked, formatFileSize]);

  // Fungsi untuk mengembalikan item dari sampah
  const restoreItem = useCallback(async (fileId: string, fileName: string) => {
    setIsLoading(true);
    try {
      await gapi.client.drive.files.update({
        fileId: fileId,
        resource: { trashed: false },
      });
      toast.success(`"${fileName}" berhasil dipulihkan.`);
      await listTrash(); // Refresh daftar sampah
    } catch (error) {
      console.error('Error restoring item:', error);
      toast.error("Gagal memulihkan item.");
    } finally {
      setIsLoading(false);
    }
  }, [listTrash]);

  // Fungsi untuk menghapus item secara permanen
  const deleteItemPermanently = useCallback(async (fileId: string, fileName: string) => {
    setIsLoading(true);
    try {
      await gapi.client.drive.files.delete({ fileId });
      toast.success(`"${fileName}" berhasil dihapus permanen.`);
      await listTrash(); // Refresh daftar sampah
    } catch (error) {
      console.error('Error deleting item permanently:', error);
      toast.error("Gagal menghapus item secara permanen.");
    } finally {
      setIsLoading(false);
    }
  }, [listTrash]);

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
       fields: 'nextPageToken, files(id, name, mimeType, size, modifiedTime, webViewLink, webContentLink, shared, thumbnailLink, parents, capabilities/canShare, createdTime)',
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
        createdTime: file.createdTime,
        webViewLink: file.webViewLink,
        shared: file.shared || false,
        thumbnailLink: file.thumbnailLink,
        parents: file.parents,
        isFeatured: featuredFiles.some(f => f.id === file.id),
        webContentLink: file.webContentLink,
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
  }, [currentFolderId, featuredFiles, formatFileSize]);

  // Load more files (pagination)
  const loadMoreFiles = useCallback(async () => {
    if (!nextPageTokenRef.current || !hasMore || loadingRef.current) return;
    await listFiles(currentFolderId, nextPageTokenRef.current);
  }, [currentFolderId, hasMore, listFiles]);

  // Clear cache
  const clearCache = useCallback(() => {
    cacheRef.current = {};
  }, []);

  // Upload file dengan progress
  const uploadFile = useCallback(async (file: File, folderId: string = 'root', onProgress?: (progress: number) => void) => {
    try {
      setIsLoading(true);
      
      const metadata = {
        name: file.name,
        mimeType: file.type,
        parents: [folderId]
      };

      return new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // Handle progress
        if (onProgress) {
          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              const percentComplete = (e.loaded / e.total) * 100;
              onProgress(percentComplete);
            }
          });
        }

        xhr.onload = async () => {
          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText);
              
              // Update metadata
              await gapi.client.drive.files.update({
                fileId: response.id,
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
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error('Upload failed'));

        const token = gapi.client.getToken().access_token;
        xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=media');
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
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

  // Delete file/folder (move to trash)
  const deleteFile = useCallback(async (fileId: string, fileName: string) => {
    try {
      setIsLoading(true);
      
      // Move to trash instead of permanent delete
      await gapi.client.drive.files.update({
        fileId: fileId,
        resource: { trashed: true }
      });

      // Remove from featured files if exists
      const newFeatured = featuredFiles.filter(f => f.id !== fileId);
      if (newFeatured.length !== featuredFiles.length) {
        setFeaturedFiles(newFeatured);
        localStorage.setItem('featuredFiles', JSON.stringify(newFeatured));
      }

      // Clear cache for current folder
      Object.keys(cacheRef.current).forEach(key => {
        if (key.startsWith(currentFolderId)) {
          delete cacheRef.current[key];
        }
      });

      // Refresh file list
      await listFiles(currentFolderId);
      toast.success(`"${fileName}" berhasil dipindahkan ke sampah`);
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Gagal menghapus file');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentFolderId, featuredFiles, listFiles]);

  // Set file permission
  const setFilePermission = useCallback(async (fileId: string, isPublic: boolean): Promise<string> => {
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
      
      return `https://drive.google.com/file/d/${fileId}/view`;
    } catch (error) {
      console.error('Error setting file permission:', error);
      toast.error('Gagal mengubah izin file');
      throw error;
    }
  }, [clearCache, currentFolderId, listFiles]);

  // Download file
  const downloadFile = useCallback(async (fileId: string) => {
    try {
      const file = files.find(f => f.id === fileId) || allFiles.find(f => f.id === fileId);
      if (!file) throw new Error('File not found');

      let downloadUrl;
      
      if (file.mimeType?.includes('google-apps')) {
        // For Google Docs/Sheets/Slides, use export
        const exportType = {
          'application/vnd.google-apps.document': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.google-apps.spreadsheet': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.google-apps.presentation': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/vnd.google-apps.drawing': 'image/png'
        }[file.mimeType] || 'application/pdf';
        
        downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=${exportType}`;
      } else {
        // For regular files
        downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
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
  }, [files, allFiles]);

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

  // Inisialisasi Google API dengan GIS (Google Identity Services)
  useEffect(() => {
    const initGapi = async () => {
      try {
        await new Promise<void>((resolve) => {
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

          try {
            await gapi.client.drive.about.get({ fields: 'user' });
          } catch (err: any) {
            if (err.status === 401) {
              localStorage.removeItem('googleDriveToken');
              setIsLinked(false);
              toast.error('Sesi Google Drive Anda sudah habis. Silakan login ulang.');
            }
          }
        }

        if (typeof google !== 'undefined' && google.accounts) {
          tokenClientRef.current = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: async (response: any) => {
              if (response.error) {
                console.error('Token error:', response.error);
                toast.error('Gagal mendapatkan token akses');
                setIsLoading(false);
                if (signInPromiseRef.current) {
                  signInPromiseRef.current.reject(response);
                }
                return;

                return;
              }
              
              gapi.client.setToken({ access_token: response.access_token });
              localStorage.setItem('googleDriveToken', response.access_token);
              setIsLinked(true);

              if (signInPromiseRef.current) {
                  signInPromiseRef.current.resolve();
              }
              
              try {
                await Promise.all([
                  listFiles('root'),
                  loadAllFiles(),
                  loadStorageQuota()
                ]);
              } catch (error) {
                console.error('Error loading initial data after sign-in:', error);
              }
            },
          });

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
  }, [listFiles, loadAllFiles, loadStorageQuota]);

  const signIn = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
        signInPromiseRef.current = { resolve, reject };

        if (tokenClientRef.current) {
            tokenClientRef.current.requestAccessToken();
        } else {
            reject(new Error('Google API client belum diinisialisasi.'));
        }
    });
}, []);

  const signOut = useCallback(() => {
    const token = gapi.client.getToken();
    if (token) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken(null);
    }
    localStorage.removeItem('googleDriveToken');
    setIsLinked(false);
    setFiles([]);
    setAllFiles([]);
    setTrashedFiles([]);
    setStorageQuota(null);
    setCurrentFolderId('root');
    setBreadcrumbs([{ id: 'root', name: 'My Drive' }]);
  }, []);

  // Alias functions for backward compatibility
  const linkAccount = signIn;
  const unlinkAccount = signOut;
  const isApiReady = !isLoading;

  return {
    isLinked,
    files,
    allFiles,
    trashedFiles,
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
    isApiReady,
    listTrash,
    restoreItem,
    deleteItemPermanently,
  };
};

// Error Boundary Component
// Removed unused ErrorFallback function.

// App Component with Error Boundary
/*
  The App component with JSX is removed because JSX is not allowed in this file.
  If you need to use the hook in a React component, create a separate .tsx file for your UI.
*/

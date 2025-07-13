import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  VscFile, VscFolder, VscLock, VscLoading, 
  VscArrowLeft, VscEye, VscCloudDownload, VscStarFull
} from 'react-icons/vsc';
import { useGoogleDrive } from '../hooks/useGoogleDrive';
import type { DriveFile } from '../hooks/useGoogleDrive';

interface FileCardProps {
  file: {
    id: string;
    name: string;
    mimeType: string;
    size?: string;
    webViewLink?: string;
    shared: boolean;
    isFeatured?: boolean;
  };
}

const FileCard: React.FC<FileCardProps> = ({ file }) => (
  <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center">
        {file.mimeType.includes('folder') ? (
          <VscFolder className="text-blue-400 text-2xl mr-2" />
        ) : (
          <VscFile className="text-blue-400 text-2xl mr-2" />
        )}
        <h3 className="font-medium text-white truncate">{file.name}</h3>
      </div>
      <span className={`px-2 py-0.5 rounded-full text-xs ${
        file.shared ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
      }`}>
        {file.shared ? 'Dibagikan' : 'Privat'}
      </span>
    </div>
    
    <div className="text-sm text-gray-400 space-y-1 mb-4">
      <div className="flex justify-between">
        <span>Ukuran:</span>
        <span className="text-white">{file.size || '-'}</span>
      </div>
    </div>
    
    <div className="flex space-x-2">
      <Link
        to={`/dashboard/share/${file.id}`}
        className="flex-1 flex items-center justify-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
      >
        <VscEye className="mr-1.5" /> Lihat
      </Link>
      {!file.mimeType.includes('folder') && file.webViewLink && (
        <a
          href={`${file.webViewLink}&export=download`}
          className="flex items-center justify-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
        >
          <VscCloudDownload className="mr-1.5" /> Unduh
        </a>
      )}
    </div>
  </div>
);

// Ambil API Key langsung dari environment variables
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

// Tipe data lokal khusus untuk halaman ini, agar tidak bergantung pada hook
interface SharedItem {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  webViewLink?: string;
  shared: boolean;
  createdTime?: string;
  modifiedTime?: string;
}

// Helper untuk format byte, diletakkan di sini agar mandiri
const formatBytes = (bytes: number, decimals = 2): string => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const SharePage: React.FC = () => {
    const { fileId } = useParams<{ fileId: string }>();
    const [item, setItem] = useState<SharedItem | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { featuredFiles = [] } = useGoogleDrive();
  
    // Filter out any null or undefined files and ensure they have the required properties
    const validFeaturedFiles = React.useMemo(() => {
      return featuredFiles
        .filter((file: DriveFile) => file && file.id && file.name && file.mimeType)
        .map((file: DriveFile) => ({
          ...file,
          size: file.size || '0',
          shared: file.shared || false,
          webViewLink: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
          createdTime: file.createdTime || new Date().toISOString(),
          modifiedTime: file.modifiedTime || new Date().toISOString()
        }));
    }, [featuredFiles]);

    useEffect(() => {
        const initializeAndFetch = async (fileIdParam: string | undefined) => {
            if (!fileIdParam) {
                setError(null);
                setIsLoading(false);
                return;
            }

            try {
                // Pastikan GAPI sudah dimuat
                if (!window.gapi) {
                    await new Promise<void>((resolve) => {
                        const script = document.createElement('script');
                        script.src = 'https://apis.google.com/js/api.js';
                        script.async = true;
                        script.defer = true;
                        script.onload = () => resolve();
                        document.body.appendChild(script);
                    });
                }

                // Inisialisasi client
                if (window.gapi && !window.gapi.client) {
                    await window.gapi.client.init({
                        apiKey: API_KEY,
                        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
                    });
                }
                
                // If we have a fileId, fetch that specific file's details
                if (fileIdParam) {
                    // First check if the file is in our featured files
                    const featuredFile = validFeaturedFiles.find((file: DriveFile) => file.id === fileIdParam);
                    
                    if (featuredFile) {
                        // If found in featured files, use that data
                        const formattedData: SharedItem = {
                            id: featuredFile.id,
                            name: featuredFile.name,
                            mimeType: featuredFile.mimeType,
                            size: formatBytes(parseInt(featuredFile.size || '0')),
                            webViewLink: featuredFile.webViewLink || `https://drive.google.com/file/d/${featuredFile.id}/view`,
                            shared: featuredFile.shared || false,
                            createdTime: featuredFile.createdTime || new Date().toISOString(),
                            modifiedTime: featuredFile.modifiedTime || new Date().toISOString()
                        };
                        setItem(formattedData);
                        setIsLoading(false);
                        return;
                    }
                    
                    // If not in featured files, try to fetch from API
                    if (window.gapi?.client) {
                        try {
                            const response = await window.gapi.client.drive.files.get({
                                fileId: fileIdParam,
                                fields: 'id,name,mimeType,size,webViewLink,shared,createdTime,modifiedTime',
                            });
                            
                            if (response.status !== 200 || !response.result) {
                                throw new Error('Gagal memuat detail file');
                            }
                            
                            const fileData = response.result;
                            const formattedData: SharedItem = {
                                id: fileData.id!,
                                name: fileData.name!,
                                mimeType: fileData.mimeType!,
                                size: formatBytes(parseInt(fileData.size || '0')),
                                webViewLink: fileData.webViewLink || `https://drive.google.com/file/d/${fileData.id}/view`,
                                shared: fileData.shared || false,
                                createdTime: fileData.createdTime || new Date().toISOString(),
                                modifiedTime: fileData.modifiedTime || new Date().toISOString()
                            };
                            
                            setItem(formattedData);
                        } catch (err) {
                            console.error('Error fetching file details:', err);
                            setError('File tidak ditemukan atau Anda tidak memiliki akses.');
                        }
                    }
                }
                
                setError(null);
            } catch (err) {
                console.error('Error:', err);
                setError('Gagal memuat data. Silakan coba lagi.');
            } finally {
                setIsLoading(false);
            }
        };
        
        initializeAndFetch(fileId);
    }, [fileId, validFeaturedFiles]);

    if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <VscLoading className="animate-spin text-4xl text-blue-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 max-w-md w-full text-center">
          <div className="text-red-400 text-5xl mb-4">
            <VscLock />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Akses Dibatasi</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <Link 
            to="/dashboard" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <VscArrowLeft className="mr-2" /> Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // If we have a fileId but no item data yet, show loading
  if (fileId && !item) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <VscLoading className="animate-spin text-4xl text-blue-400" />
      </div>
    );
  }

  // Tampilan detail file
  if (fileId && item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
              <div className="flex-1">
                <div className="flex items-center">
                  {item.mimeType.includes('folder') ? (
                    <VscFolder className="text-blue-400 text-4xl mr-3" />
                  ) : (
                    <VscFile className="text-blue-400 text-4xl mr-3" />
                  )}
                  <h1 className="text-2xl font-bold text-white">{item.name}</h1>
                </div>
                
                <div className="mt-6 space-y-4 text-gray-300">
                  {item.size && (
                    <div className="flex">
                      <span className="w-32 text-gray-400">Ukuran</span>
                      <span className="text-white">{item.size}</span>
                    </div>
                  )}
                  {item.createdTime && (
                    <div className="flex">
                      <span className="w-32 text-gray-400">Dibuat</span>
                      <span className="text-white">{new Date(item.createdTime).toLocaleString()}</span>
                    </div>
                  )}
                  {item.modifiedTime && (
                    <div className="flex">
                      <span className="w-32 text-gray-400">Diubah</span>
                      <span className="text-white">{new Date(item.modifiedTime).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex">
                    <span className="w-32 text-gray-400">Status</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      item.shared ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {item.shared ? 'Dibagikan' : 'Privat'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 w-full md:w-auto">
                {item.webViewLink && (
                  <a
                    href={item.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <VscEye className="mr-2" /> Lihat File
                  </a>
                )}
                {!item.mimeType.includes('folder') && item.webViewLink && (
                  <a
                    href={`${item.webViewLink}&export=download`}
                    className="flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    <VscCloudDownload className="mr-2" /> Unduh
                  </a>
                )}
                <Link 
                  to="/dashboard/share" 
                  className="flex items-center justify-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <VscArrowLeft className="mr-2" /> Kembali
                </Link>
              </div>
            </div>
            
            {/* Related files section */}
            {!item.mimeType.includes('folder') && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <h2 className="text-lg font-semibold text-white mb-4">File Lainnya</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredFiles
                    .filter((f: any) => f.id !== item.id)
                    .slice(0, 3)
                    .map((f: any) => (
                      <FileCard key={f.id} file={f} />
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Tampilan daftar file yang di-feature
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
            <VscStarFull className="text-blue-400 text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">File yang Dibagikan</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Berikut adalah daftar file dan folder yang telah dibagikan untuk dilihat bersama.
          </p>
        </div>
        
        {validFeaturedFiles && validFeaturedFiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {validFeaturedFiles.map((f) => (
              <FileCard key={f.id} file={f} />
            ))}
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 text-center">
            <div className="text-gray-500 mb-4">
              <VscStarFull className="text-5xl mx-auto opacity-30" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Belum Ada File yang Dibagikan</h3>
            <p className="text-gray-400 mb-6">
              Gunakan tombol "Tampilkan di Halaman Share" pada file atau folder untuk menambahkannya ke halaman ini.
            </p>
            <Link 
              to="/dashboard" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <VscArrowLeft className="mr-2" /> Kembali ke Dashboard
            </Link>
          </div>
        )}
        
        <div className="mt-12 bg-white/5 backdrop-blur-md rounded-xl p-6 max-w-3xl mx-auto">
          <h3 className="text-lg font-medium text-white mb-3">Cara Berbagi File</h3>
          <ol className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium mr-3">1</span>
              <span>Pilih file atau folder yang ingin Anda bagikan</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium mr-3">2</span>
              <span>Klik tombol tiga titik di samping file/folder</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium mr-3">3</span>
              <span>Pilih "Tampilkan di Halaman Share"</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium mr-3">4</span>
              <span>File akan muncul di halaman ini dan bisa diakses oleh siapapun yang memiliki link</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
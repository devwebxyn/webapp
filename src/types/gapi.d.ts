declare namespace gapi {
  namespace client {
    const init: (config: {
      apiKey: string;
      discoveryDocs?: string[];
    }) => Promise<void>;
    
    const load: (api: string, callback: () => void) => void;
    
    const setToken: (token: { access_token: string } | null) => void;
    const getToken: () => { access_token: string } | null;
    
    const request: (params: {
      path: string;
      method: string;
      params?: any;
      headers?: any;
      body?: any;
    }) => Promise<any>;
    
    namespace drive {
      interface FilesResource {
        list: (params: {
          pageSize?: number;
          fields?: string;
          q?: string;
          orderBy?: string;
          pageToken?: string;
          supportsAllDrives?: boolean;
          includeItemsFromAllDrives?: boolean;
        }) => Promise<{
          result: {
            files: Array<{
              id: string;
              name: string;
              mimeType: string;
              size?: string;
              modifiedTime?: string;
              webViewLink?: string;
              shared?: boolean;
              thumbnailLink?: string;
              parents?: string[];
              capabilities?: {
                canShare?: boolean;
              };
            }>;
            nextPageToken?: string;
          };
        }>;
        
        get: (params: {
          fileId: string;
          fields?: string;
        }) => Promise<{
          result: {
            id: string;
            name: string;
            parents?: string[];
          };
        }>;
        
        delete: (params: {
          fileId: string;
        }) => Promise<any>;
        
        create: (params: {
          resource: any;
          fields?: string;
        }) => Promise<{
          result: {
            id: string;
            name: string;
            mimeType: string;
            webViewLink?: string;
            shared?: boolean;
          };
        }>;
        
        update: (params: {
          fileId: string;
          resource: any;
        }) => Promise<any>;
      }
      
      interface PermissionsResource {
        create: (params: {
          fileId: string;
          resource: any;
          fields?: string;
        }) => Promise<any>;
        
        list: (params: {
          fileId: string;
          fields?: string;
        }) => Promise<{
          result: {
            permissions: Array<{
              id: string;
              type: string;
              role: string;
            }>;
          };
        }>;
        
        delete: (params: {
          fileId: string;
          permissionId: string;
        }) => Promise<any>;
      }
      
      interface AboutResource {
        get: (params: {
          fields?: string;
        }) => Promise<{
          result: {
            storageQuota?: {
              usage: number;
              limit: number;
            };
          };
        }>;
      }
      
      const files: FilesResource;
      const permissions: PermissionsResource;
      const about: AboutResource;
    }
  }
  
  const load: (api: string, callback: () => void) => void;
  
  namespace auth2 {
    const init: (params: any) => any;
    const getAuthInstance: () => any;
  }
}

declare namespace google {
  namespace accounts {
    namespace oauth2 {
      const initTokenClient: (config: {
        client_id: string;
        scope: string;
        callback: (response: any) => void;
      }) => {
        requestAccessToken: () => void;
      };
      
      const revoke: (token: string) => void;
    }
  }
}
// File ini memberitahu TypeScript bahwa 'gapi' dan 'google' ada di objek window global.

export declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}
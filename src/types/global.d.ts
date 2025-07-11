// File ini memberitahu TypeScript bahwa 'gapi' dan 'google' ada 
// di objek window global, yang dimuat dari script di index.html.
export declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}
// global.d.ts
export {};

declare global {
  interface Window {
    google?: typeof import('google.accounts');
  }
}

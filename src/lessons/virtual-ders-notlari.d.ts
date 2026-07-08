/** Vite eklentisi "ders-notlari-manifest" tarafından sağlanır (bkz. vite.config.ts). */
declare module 'virtual:ders-notlari' {
  /** itu_dersNotlari/ altındaki klasör adları, alfabetik sırada. */
  const folders: string[];
  export default folders;
}

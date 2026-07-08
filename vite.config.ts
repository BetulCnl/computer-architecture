import { defineConfig } from 'vitest/config';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { readdirSync } from 'node:fs';

/**
 * itu_dersNotlari/ klasörünü tarayıp klasör adlarını sanal bir modül olarak
 * sunar. Yeni bir ders klasörü eklendiğinde kenar çubuğu, kod değişikliği
 * gerekmeden otomatik olarak yeni dersi listeler (bkz. lessons/registry.ts).
 */
function dersNotlariManifest(): Plugin {
  const virtualId = 'virtual:ders-notlari';
  const resolvedId = '\0' + virtualId;
  const notesDir = fileURLToPath(new URL('./itu_dersNotlari', import.meta.url));

  const scan = (): string[] => {
    try {
      return readdirSync(notesDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort();
    } catch {
      return [];
    }
  };

  return {
    name: 'ders-notlari-manifest',
    resolveId(id) {
      return id === virtualId ? resolvedId : undefined;
    },
    load(id) {
      if (id !== resolvedId) return undefined;
      // Dev'de izleme configureServer'daki watcher ile yapılır; buradan
      // addWatchFile çağırmak import-analysis'in klasörü modül sanmasına yol açar.
      return `export default ${JSON.stringify(scan())};`;
    },
    configureServer(server) {
      server.watcher.add(notesDir);
      const refresh = (path: string) => {
        if (path.startsWith(notesDir)) {
          const mod = server.moduleGraph.getModuleById(resolvedId);
          if (mod) server.moduleGraph.invalidateModule(mod);
          server.ws.send({ type: 'full-reload' });
        }
      };
      server.watcher.on('addDir', refresh);
      server.watcher.on('unlinkDir', refresh);
    },
  };
}

export default defineConfig({
  // GitHub Pages, siteyi https://<kullanıcı>.github.io/computer-architecture/
  // altından sunar; üretim derlemesinde tüm asset yolları bu köke göre çözülür.
  base: process.env.GITHUB_ACTIONS ? '/computer-architecture/' : '/',
  plugins: [react(), dersNotlariManifest()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});

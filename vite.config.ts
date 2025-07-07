
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
    open: true,
    headers: {
      'Content-Security-Policy': [
        "default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval' 'unsafe-inline';",
        "connect-src 'self' https://ukgvvjardofvelpztguj.supabase.co https://*.supabase.co wss://ukgvvjardofvelpztguj.supabase.co wss://*.supabase.co;",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net;",
        "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net data:;",
        "img-src 'self' data: content: https:;",
        "media-src *;",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval';",
        "frame-src 'self' https://www.google.com https://www.youtube.com;",
        "worker-src 'self' blob:;",
        "child-src 'self' blob:;"
      ].join(' ')
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
  },
}));

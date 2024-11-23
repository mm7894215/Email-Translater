import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    base: '/',
    define: {
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      'process.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify(env.VITE_CLERK_PUBLISHABLE_KEY),
    },
    optimizeDeps: {
      include: ['@radix-ui/react-tabs']
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: process.env.NODE_ENV === 'development',
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    },
    server: {
      port: 3000,
      host: true
    },
    preview: {
      port: 4173,
      host: true
    }
  };
});

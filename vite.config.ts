import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = Number(env.VITE_PORT || 3000);

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port,
      strictPort: true,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return undefined;
            }

            if (
              id.includes('/react/') ||
              id.includes('/react-dom/') ||
              id.includes('/react-router-dom/') ||
              id.includes('/scheduler/')
            ) {
              return 'vendor-react';
            }

            if (id.includes('/firebase/') || id.includes('/@firebase/')) {
              return 'vendor-firebase';
            }

            if (id.includes('/chart.js/') || id.includes('/react-chartjs-2/')) {
              return 'vendor-charts';
            }

            if (id.includes('/@capacitor/') || id.includes('/@revenuecat/')) {
              return 'vendor-native';
            }

            if (id.includes('/motion/') || id.includes('/framer-motion/')) {
              return 'vendor-motion';
            }

            if (id.includes('/lucide-react/')) {
              return 'vendor-icons';
            }

            return undefined;
          },
        },
      },
    },
  };
});

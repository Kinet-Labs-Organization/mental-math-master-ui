import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mentalmathmaster.app',
  appName: 'Mental Math Master',
  webDir: 'dist',
  server: {
    iosScheme: 'https',
  },
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: true,
      providers: ['google.com'],
    },
  },
};

export default config;

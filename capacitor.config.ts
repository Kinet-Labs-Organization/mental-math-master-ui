import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mentalmathmaster.app',
  appName: 'Mental Math Master',
  webDir: 'dist',
  server: {
    url: 'http://192.168.29.174:3000',
    cleartext: true,
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

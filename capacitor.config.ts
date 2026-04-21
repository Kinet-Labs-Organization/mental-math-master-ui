import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mentalmathmaster.app',
  appName: 'Mental Math Master',
  webDir: 'dist',
  // For App Store/release builds, keep server.url disabled so the app
  // loads bundled web assets from `dist` instead of a remote dev server.
  // server: {
  //   url: 'http://192.168.29.174:3000',
  //   cleartext: true,
  //   iosScheme: 'https',
  // },
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: true,
      providers: ['google.com'],
    },
  },
};

export default config;

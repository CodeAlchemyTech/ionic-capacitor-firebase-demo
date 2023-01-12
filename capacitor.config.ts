import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.firebase.utilities',
  appName: 'Firebase Basic',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com', 'facebook.com'],
    },
  },
};

export default config;

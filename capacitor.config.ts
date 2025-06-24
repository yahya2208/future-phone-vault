
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.app',
  appName: 'Gaza saver',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: [
      'https://ukgvvjardofvelpztguj.supabase.co',
      'https://cdn.gpteng.co',
      'https://static.cloudflareinsights.com'
    ],
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: true,
    buildOptions: {
      keystorePath: '',
      keystoreAlias: ''
    }
  },
  plugins: {
    Keyboard: {
      resize: 'none',
      style: 'dark',
      resizeOnFullScreen: false
    }
  }
};

export default config;

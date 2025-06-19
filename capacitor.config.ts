
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.lovable.app',
  appName: 'Gaza Saver',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'https://94dee515-c3a3-4ac9-b373-5bd09d19d8a1.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: {
        camera: 'تطلب الكاميرا للتقاط صور هوية المشتري.',
        photos: 'تطلب الوصول للصور لحفظ الصور المُلتقطة.'
      }
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1a1a2e",
      showSpinner: false
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true
  }
};

export default config;

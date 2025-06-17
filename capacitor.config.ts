
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.94dee515c3a34ac9b3735bd09d19d8a1',
  appName: 'future-phone-vault',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'https://94dee515-c3a3-4ac9-b373-5bd09d19d8a1.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: {
        camera: 'Camera access is required to take photos of buyer IDs.'
      }
    }
  }
};

export default config;

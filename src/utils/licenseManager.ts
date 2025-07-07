import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const generateDeviceFingerprint = async (): Promise<string> => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    const fingerprintData = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: (navigator as any).deviceMemory,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      colorDepth: window.screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timezone,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: (navigator as any).doNotTrack,
      webglVendor: gl ? gl.getParameter((gl as WebGLRenderingContext).VENDOR) : null,
      webglRenderer: gl ? gl.getParameter((gl as WebGLRenderingContext).RENDERER) : null,
    };

    // Generate a stable hash from the fingerprint data
    const fingerprintString = JSON.stringify(fingerprintData);
    const encoder = new TextEncoder();
    const data = encoder.encode(fingerprintString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Store the fingerprint in localStorage for future use
    localStorage.setItem('deviceFingerprint', hashHex);
    
    return hashHex;
  } catch (error) {
    console.error('Error generating device fingerprint:', error);
    // Fallback to a simpler fingerprint if Web Crypto API is not available
    const fallbackFingerprint = `fallback-${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('deviceFingerprint', fallbackFingerprint);
    return fallbackFingerprint;
  }
};

export const getStoredFingerprint = (): string | null => {
  return localStorage.getItem('deviceFingerprint');
};

export const activateLicense = async (licenseKey: string, deviceName?: string): Promise<{
  success: boolean;
  message: string;
  license?: {
    key: string;
    maxDevices: number;
    expiresAt: string | null;
  };
}> => {
  try {
    const supabase = createClientComponentClient();
    const fingerprint = await generateDeviceFingerprint();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User not authenticated');
    }

    const response = await fetch('/api/license/activate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        licenseKey,
        deviceFingerprint: fingerprint,
        deviceName: deviceName || 'My Device'
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to activate license');
    }

    // Store activation status
    localStorage.setItem('licenseActivated', 'true');
    localStorage.setItem('licenseKey', licenseKey);
    
    return {
      success: true,
      message: result.message,
      license: result.license
    };
  } catch (error) {
    console.error('License activation error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to activate license'
    };
  }
};

export const checkLicenseStatus = async (): Promise<{
  isActive: boolean;
  licenseKey?: string;
  deviceLimit?: number;
  devicesUsed?: number;
  expiresAt?: string | null;
}> => {
  try {
    const licenseKey = localStorage.getItem('licenseKey');
    if (!licenseKey) {
      return { isActive: false };
    }

    const supabase = createClientComponentClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { isActive: false };
    }

    const response = await fetch(`/api/license/status?key=${encodeURIComponent(licenseKey)}`, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to check license status');
    }

    const result = await response.json();
    return {
      isActive: result.isActive,
      licenseKey: result.licenseKey,
      deviceLimit: result.deviceLimit,
      devicesUsed: result.devicesUsed,
      expiresAt: result.expiresAt
    };
  } catch (error) {
    console.error('License check error:', error);
    return { isActive: false };
  }
};

export const deactivateDevice = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const licenseKey = localStorage.getItem('licenseKey');
    const fingerprint = getStoredFingerprint();
    
    if (!licenseKey || !fingerprint) {
      return { success: false, message: 'No active license found on this device' };
    }

    const supabase = createClientComponentClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { success: false, message: 'User not authenticated' };
    }

    const response = await fetch('/api/license/deactivate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        licenseKey,
        deviceFingerprint: fingerprint
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to deactivate device');
    }

    // Clear local storage
    localStorage.removeItem('licenseActivated');
    localStorage.removeItem('licenseKey');
    
    return {
      success: true,
      message: 'Device deactivated successfully'
    };
  } catch (error) {
    console.error('Device deactivation error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to deactivate device'
    };
  }
};

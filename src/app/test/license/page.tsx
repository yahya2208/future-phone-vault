'use client';

import { useState, useEffect } from 'react';
import { useLicense } from '@/contexts/LicenseContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, XCircle, Loader2, Copy, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function LicenseTestPage() {
  const { 
    licenseStatus, 
    isLoading, 
    error, 
    activate, 
    deactivate, 
    checkStatus,
    deviceFingerprint 
  } = useLicense();
  
  const { toast } = useToast();
  const [licenseKey, setLicenseKey] = useState('');
  const [deviceName, setDeviceName] = useState('Test Device');
  const [isActivating, setIsActivating] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Set default device name from browser/device info
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent;
      const platform = window.navigator.platform;
      
      // Try to get a more friendly device name
      let name = 'Test Device - ';
      
      // Check for mobile devices
      if (/Android/.test(userAgent)) {
        name += 'Android';
      } else if (/iPhone|iPad|iPod/.test(userAgent)) {
        name += 'iOS';
      } else if (/Windows/.test(platform)) {
        name += 'Windows';
      } else if (/Mac/.test(platform)) {
        name += 'Mac';
      } else if (/Linux/.test(platform)) {
        name += 'Linux';
      } else {
        name += 'Device';
      }
      
      setDeviceName(name);
    }
  }, []);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a license key',
        variant: 'destructive',
      });
      return;
    }

    setIsActivating(true);
    try {
      const success = await activate(licenseKey, deviceName);
      if (success) {
        toast({
          title: 'Success',
          description: 'License activated successfully!',
        });
      } else {
        toast({
          title: 'Activation Failed',
          description: error || 'Invalid license key or activation limit reached',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Activation error:', err);
      toast({
        title: 'Error',
        description: 'An error occurred during activation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsActivating(false);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm('Are you sure you want to deactivate this device?')) {
      return;
    }
    
    setIsDeactivating(true);
    try {
      const success = await deactivate();
      if (success) {
        toast({
          title: 'Device Deactivated',
          description: 'This device has been deactivated.',
        });
        setLicenseKey('');
      } else {
        toast({
          title: 'Error',
          description: 'Failed to deactivate device. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Deactivation error:', err);
      toast({
        title: 'Error',
        description: 'An error occurred while deactivating the device.',
        variant: 'destructive',
      });
    } finally {
      setIsDeactivating(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!licenseKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a license key',
        variant: 'destructive',
      });
      return;
    }

    setIsChecking(true);
    try {
      const status = await checkStatus(licenseKey);
      if (status) {
        toast({
          title: 'License Status',
          description: `License is ${status.isActive ? 'active' : 'inactive'} and allows ${status.devicesUsed}/${status.deviceLimit} devices.`,
        });
      } else {
        toast({
          title: 'Error',
          description: error || 'Failed to check license status',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Status check error:', err);
      toast({
        title: 'Error',
        description: 'An error occurred while checking the license status.',
        variant: 'destructive',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Text has been copied to clipboard.',
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">License Activation Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Activate License</CardTitle>
            <CardDescription>
              Enter a license key to activate this device.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleActivate}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="license-key">License Key</Label>
                <Input
                  id="license-key"
                  placeholder="Enter your license key"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  disabled={isActivating || isDeactivating}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="device-name">Device Name</Label>
                <Input
                  id="device-name"
                  placeholder="My Device"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  disabled={isActivating || isDeactivating}
                />
              </div>

              {deviceFingerprint && (
                <div className="space-y-2">
                  <Label>Device ID</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={deviceFingerprint}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(deviceFingerprint)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isActivating || isDeactivating || !licenseKey.trim()}
              >
                {isActivating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Activating...
                  </>
                ) : (
                  'Activate License'
                )}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleCheckStatus}
                disabled={isChecking || isActivating || isDeactivating || !licenseKey.trim()}
              >
                {isChecking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  'Check License Status'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Status Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current License Status</CardTitle>
              <CardDescription>
                View the current activation status of your device.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : licenseStatus ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium">
                        {licenseStatus.isExpired ? (
                          <span className="text-amber-500 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Expired
                          </span>
                        ) : licenseStatus.isActive ? (
                          <span className="text-green-500 flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="text-destructive flex items-center">
                            <XCircle className="h-4 w-4 mr-1" />
                            Inactive
                          </span>
                        )}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">License Key</span>
                      <div className="flex items-center">
                        <span className="font-mono text-sm">
                          {licenseStatus.licenseKey.substring(0, 8)}...
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-1"
                          onClick={() => copyToClipboard(licenseStatus.licenseKey)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Devices</span>
                      <span className="font-medium">
                        {licenseStatus.devicesUsed} / {licenseStatus.deviceLimit}
                      </span>
                    </div>
                    
                    {licenseStatus.expiresAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {licenseStatus.isExpired ? 'Expired On' : 'Expires On'}
                        </span>
                        <span className="font-medium">
                          {new Date(licenseStatus.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Device Information</AlertTitle>
                    <AlertDescription className="mt-2">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Device ID:</span>
                          <span className="font-mono text-xs">
                            {deviceFingerprint?.substring(0, 8)}...
                            {deviceFingerprint?.substring(deviceFingerprint.length - 4)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Device Name:</span>
                          <span>{deviceName}</span>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    variant="destructive" 
                    className="w-full mt-4"
                    onClick={handleDeactivate}
                    disabled={isDeactivating || isActivating}
                  >
                    {isDeactivating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deactivating...
                      </>
                    ) : (
                      'Deactivate This Device'
                    )}
                  </Button>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No active license found on this device.
                </div>
              )}
            </CardContent>
          </Card>
          
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Testing Instructions</AlertTitle>
            <AlertDescription className="mt-2 text-blue-700">
              <ol className="list-decimal list-inside space-y-1">
                <li>Enter a license key and click "Activate License"</li>
                <li>Verify the status updates correctly</li>
                <li>Try checking the status with "Check License Status"</li>
                <li>Test deactivation with "Deactivate This Device"</li>
                <li>Verify the license is properly deactivated</li>
              </ol>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}

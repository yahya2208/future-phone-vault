# License Management System

This document provides an overview of the license management system implemented in the application. The system handles license activation, device management, and access control based on license status.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Frontend Components](#frontend-components)
- [Usage](#usage)
  - [Checking License Status](#checking-license-status)
  - [Activating a License](#activating-a-license)
  - [Deactivating a Device](#deactivating-a-device)
  - [Protecting Routes](#protecting-routes)
- [Admin Features](#admin-features)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Security Considerations](#security-considerations)

## Overview

The license management system provides a way to control access to premium features based on license status. Key features include:

- License key activation and validation
- Device management (limit number of devices per license)
- License expiration handling
- Admin interface for managing licenses
- Route protection based on license status

## Architecture

The system consists of several components:

1. **Database**: Stores license and device information
2. **API**: Handles license activation, validation, and management
3. **Middleware**: Protects routes based on license status
4. **Frontend Components**: UI for managing licenses and displaying status
5. **Hooks & Utilities**: Helper functions for license validation

## Database Schema

### `license_keys`

Stores information about license keys.

```sql
create table license_keys (
  id uuid primary key default uuid_generate_v4(),
  license_key text not null unique,
  user_id uuid references auth.users(id) on delete cascade,
  is_active boolean default true,
  max_devices integer not null default 1,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  notes text
);
```

### `activated_devices`

Tracks devices that have been activated with a license.

```sql
create table activated_devices (
  id uuid primary key default uuid_generate_v4(),
  license_key_id uuid references license_keys(id) on delete cascade,
  device_id text not null,
  device_name text,
  is_active boolean default true,
  last_seen timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(license_key_id, device_id)
);
```

## API Endpoints

### License Activation

- `POST /api/license/activate` - Activate a license on the current device
- `POST /api/license/deactivate` - Deactivate the current device
- `GET /api/license/status` - Check the status of a license

### Admin Endpoints

- `GET /api/admin/licenses` - List all licenses (admin only)
- `POST /api/admin/licenses` - Create a new license (admin only)
- `PATCH /api/admin/licenses/[id]/status` - Update license status (admin only)
- `GET /api/admin/licenses/[id]/devices` - List devices for a license (admin only)
- `POST /api/admin/devices/[id]/deactivate` - Deactivate a device (admin only)

## Frontend Components

### `LicenseStatusBadge`

Displays the current license status with a popover for more details.

```tsx
import { LicenseStatusBadge } from '@/components/LicenseStatusBadge';

function AppHeader() {
  return (
    <header>
      {/* Other header content */}
      <LicenseStatusBadge />
    </header>
  );
}
```

### `LicenseSettings`

A page component for managing license settings.

```tsx
import { LicenseSettings } from '@/components/LicenseSettings';

function SettingsPage() {
  return (
    <div>
      <h1>License Settings</h1>
      <LicenseSettings />
    </div>
  );
}
```

### `LicenseGuard`

A component that wraps protected content and shows a license activation form if needed.

```tsx
import { LicenseGuard } from '@/components/LicenseGuard';

function PremiumFeature() {
  return (
    <LicenseGuard>
      <div>Premium content here</div>
    </LicenseGuard>
  );
}
```

## Usage

### Checking License Status

```tsx
import { useLicenseValidation } from '@/hooks/useLicenseValidation';

function MyComponent() {
  const { 
    isValid, 
    isActive, 
    isExpired, 
    isLoading, 
    checkStatus 
  } = useLicenseValidation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isValid ? (
        <div>License is active!</div>
      ) : (
        <div>License is not active or has expired</div>
      )}
    </div>
  );
}
```

### Activating a License

```tsx
import { useState } from 'react';
import { useLicenseValidation } from '@/hooks/useLicenseValidation';

function ActivateLicense() {
  const [licenseKey, setLicenseKey] = useState('');
  const { activate, isLoading, error } = useLicenseValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await activate(licenseKey, 'My Device');
    if (success) {
      // License activated successfully
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={licenseKey}
        onChange={(e) => setLicenseKey(e.target.value)}
        placeholder="Enter license key"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Activating...' : 'Activate License'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

### Deactivating a Device

```tsx
import { useLicenseValidation } from '@/hooks/useLicenseValidation';

function DeactivateButton() {
  const { deactivate, isLoading } = useLicenseValidation();

  const handleDeactivate = async () => {
    if (confirm('Are you sure you want to deactivate this device?')) {
      const success = await deactivate();
      if (success) {
        // Device deactivated successfully
      }
    }
  };

  return (
    <button onClick={handleDeactivate} disabled={isLoading}>
      {isLoading ? 'Deactivating...' : 'Deactivate This Device'}
    </button>
  );
}
```

### Protecting Routes

Use the `LicenseGuard` component to protect routes that require a valid license:

```tsx
import { LicenseGuard } from '@/components/LicenseGuard';

function PremiumPage() {
  return (
    <LicenseGuard>
      <div className="premium-content">
        <h1>Premium Content</h1>
        <p>This content is only available with a valid license.</p>
      </div>
    </LicenseGuard>
  );
}
```

Or use the middleware to protect entire route groups:

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of paths that require a valid license
const licensedPaths = [
  '/app',
  '/app/dashboard',
  '/app/transactions',
  '/app/reports',
  '/app/settings',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path requires a license
  const requiresLicense = licensedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  if (requiresLicense) {
    // Check license status
    const response = await fetch(`${request.nextUrl.origin}/api/license/status`);
    const { isValid } = await response.json();
    
    if (!isValid) {
      // Redirect to license activation page
      const url = request.nextUrl.clone();
      url.pathname = '/settings/license';
      url.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

## Admin Features

Admins can manage licenses through the admin dashboard:

1. View all licenses and their status
2. Create new licenses
3. Update license details (expiration, max devices, etc.)
4. View and manage activated devices
5. Deactivate devices remotely

## Testing

You can test the license system using the test page at `/test/license`. This page provides a UI for:

- Activating a license
- Checking license status
- Viewing device information
- Deactivating the current device

## Troubleshooting

### Common Issues

1. **License activation fails**
   - Verify the license key is correct
   - Check if the device limit has been reached
   - Ensure the license hasn't expired

2. **Device not recognized**
   - Clear browser cookies and local storage
   - Make sure the device fingerprint is being generated correctly

3. **License status not updating**
   - Try refreshing the page
   - Check the browser console for errors
   - Verify the API endpoints are returning the expected data

## Security Considerations

1. **Device Fingerprinting**
   - The system uses a combination of browser and device characteristics to generate a unique device ID
   - This is stored in localStorage to persist across sessions

2. **Rate Limiting**
   - Implement rate limiting on the API endpoints to prevent brute force attacks

3. **Secure Storage**
   - License keys are never stored in plain text in the database
   - Sensitive operations require authentication

4. **Session Management**
   - Sessions are managed securely using HTTP-only cookies
   - JWT tokens are used for API authentication

5. **Input Validation**
   - All user input is validated on both client and server
   - SQL injection is prevented using parameterized queries

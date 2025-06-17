
# Gaza Cyber - Phone Management System Documentation

## Project Overview
Gaza Cyber is a comprehensive phone transaction management system built with React, TypeScript, and Supabase. The application supports both Arabic and English languages and includes features for managing phone sales, capturing buyer ID photos, collecting digital signatures, and maintaining transaction records.

## Technology Stack
- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (Authentication, Database, Storage)
- **Mobile**: Capacitor (iOS/Android)
- **State Management**: React Context API, TanStack Query
- **Authentication**: Supabase Auth with email/password

## File Structure and Components

### Core Application Files

#### `src/App.tsx`
- Main application component
- Sets up routing with React Router
- Provides global context providers (Language, Auth, Query Client)
- Routes: `/` (Dashboard), `/auth` (Login/Register), `*` (404)

#### `src/main.tsx`
- Application entry point
- Renders the App component

### Authentication System

#### `src/hooks/useAuth.tsx`
- Custom hook and context for authentication
- Functions: `signUp`, `signIn`, `signOut`
- Integrates with Supabase authentication
- Handles user session management
- Includes username uniqueness validation

#### `src/pages/Auth.tsx`
- Login and registration page
- Bilingual form (Arabic/English)
- Email, password, and username fields for registration
- Form validation and error handling
- Redirects to dashboard after successful authentication

### Language Support

#### `src/contexts/LanguageContext.tsx`
- Provides bilingual support (Arabic/English)
- Stores translations for all UI text
- Manages language state in localStorage
- Provides `t()` function for translations

#### `src/components/LanguageSwitcher.tsx`
- Toggle button for switching between Arabic and English
- Integrated into the header component

### Dashboard Components

#### `src/pages/Index.tsx`
- Main dashboard page
- Displays transaction statistics
- Contains transaction form and history
- Requires authentication to access

#### `src/components/FuturisticHeader.tsx`
- Application header with cyberpunk styling
- Displays app title, current time, system status
- Language switcher and logout button
- Responsive design with neural scan animation

#### `src/components/DashboardStats.tsx`
- Statistical cards showing:
  - Total transactions count
  - Most popular phone brand
  - Today's transaction count
- Supports bilingual display

### Transaction Management

#### `src/components/TransactionForm.tsx`
- Form for creating new phone transactions
- Fields: Seller name, buyer name, phone brand/model, IMEI, purchase date
- IMEI validation (15 digits)
- Integration with camera and signature components
- Supports bilingual interface

#### `src/components/TransactionHistory.tsx` (Read-only)
- Displays list of previous transactions
- Sortable and filterable table
- Shows transaction details and timestamps

### Media Capture Components

#### `src/components/CameraCapture.tsx`
- Camera interface for capturing buyer ID photos
- Uses browser's MediaDevices API
- Supports both front and rear cameras
- Photo preview and retake functionality
- Returns base64 encoded images

#### `src/components/SignaturePad.tsx`
- Digital signature pad using HTML5 Canvas
- Touch and mouse support for drawing
- Clear signature functionality
- Returns signature as base64 PNG image

### Footer and Legal

#### `src/components/FooterLinks.tsx`
- Footer with legal and contact links
- Links for: Complaints, Privacy Policy, How to Use guide
- Contact phone number: +213551148943
- Bilingual support

### UI Components

#### `src/components/ui/`
- Collection of reusable UI components from shadcn/ui
- Includes: Button, Card, Input, Label, Select, Toast, etc.
- Styled with Tailwind CSS
- Consistent design system throughout the app

### Mobile App Configuration

#### `capacitor.config.ts`
- Capacitor configuration for mobile app builds
- App ID: `app.lovable.94dee515c3a34ac9b3735bd09d19d8a1`
- App Name: `future-phone-vault`
- Camera permissions configuration
- Hot-reload URL for development

## Database Schema (Supabase)

### Tables

#### `profiles`
- `id` (UUID, Primary Key) - Links to auth.users
- `username` (TEXT, Unique) - User's display name
- `email` (TEXT) - User's email address
- `created_at` (TIMESTAMP) - Account creation date

#### `transactions`
- `id` (UUID, Primary Key) - Unique transaction ID
- `user_id` (UUID, Foreign Key) - Links to profiles
- `seller_name` (TEXT) - Name of phone seller
- `buyer_name` (TEXT) - Name of phone buyer
- `phone_model` (TEXT) - Phone model/name
- `brand` (TEXT) - Phone manufacturer
- `imei` (TEXT) - 15-digit IMEI number
- `purchase_date` (DATE) - Date of transaction
- `buyer_id_photo` (TEXT, Optional) - Base64 encoded photo
- `signature` (TEXT, Optional) - Base64 encoded signature
- `created_at` (TIMESTAMP) - Record creation time

### Database Functions

#### `handle_new_user()`
- Trigger function that creates a profile record when a new user signs up
- Extracts username from auth metadata
- Ensures data consistency between auth.users and public.profiles

## Features

### 1. Authentication
- Email/password registration and login
- Username uniqueness validation
- Session management with automatic redirects
- Logout functionality

### 2. Bilingual Support
- Complete Arabic and English translations
- RTL (Right-to-Left) layout for Arabic
- Language preference persistence
- Dynamic text direction switching

### 3. Transaction Management
- Create new phone sale transactions
- View transaction history
- Search and filter transactions
- Statistical dashboard with key metrics

### 4. Media Capture
- Camera integration for buyer ID photos
- Digital signature capture
- Photo preview and retake options
- Signature clearing functionality

### 5. Mobile App Support
- Capacitor configuration for iOS/Android builds
- Camera permissions handling
- Responsive design for mobile devices
- Hot-reload development support

### 6. Legal and Compliance
- Privacy policy link
- Complaints system link
- User guide link
- Contact information display

## Styling and Design

### Theme
- Cyberpunk/futuristic design with neon accents
- Dark theme with glowing effects
- Neural network-inspired animations
- Holographic card designs

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interface elements
- Optimized for both desktop and mobile

### Custom CSS Classes
- `.holo-card` - Holographic card styling
- `.neural-btn` - Futuristic button design
- `.quantum-input` - Styled form inputs
- `.glow-text` - Text with glow effects
- `.pulse-glow` - Pulsing animation

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git for version control
- Modern web browser with camera support

### Installation
```bash
npm install
npm run dev
```

### Mobile Development
```bash
# After git pulling the project
npm install
npx cap add ios     # For iOS
npx cap add android # For Android
npm run build
npx cap sync
npx cap run ios     # Or android
```

### Environment Variables
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Security Considerations

### Authentication
- Secure password requirements (minimum 6 characters)
- Email verification for new accounts
- Session timeout handling
- Protected routes requiring authentication

### Data Privacy
- User data isolated by user_id
- No sensitive data in localStorage
- HTTPS-only communication
- Proper CORS configuration

### Input Validation
- IMEI format validation (15 digits)
- Username length requirements (minimum 3 characters)
- Email format validation
- XSS protection through React's built-in escaping

## Deployment

### Web Deployment
The application can be deployed to any static hosting service:
- Vercel, Netlify, or similar platforms
- Build command: `npm run build`
- Output directory: `dist/`

### Mobile App Deployment

#### iOS
1. Build the project: `npm run build`
2. Sync with Capacitor: `npx cap sync ios`
3. Open in Xcode: `npx cap open ios`
4. Build and archive for App Store submission

#### Android
1. Build the project: `npm run build`
2. Sync with Capacitor: `npx cap sync android`
3. Open in Android Studio: `npx cap open android`
4. Build APK or AAB for Google Play Store

## Contact and Support

For technical support or questions:
- Phone: +213551148943
- Development team should refer to this documentation
- All features are implemented and functional

## Future Enhancements

Potential improvements for future versions:
- Offline mode support
- Data export functionality
- Advanced reporting and analytics
- Barcode/QR code scanning for IMEI
- Cloud storage for photos and signatures
- Multi-tenant support for businesses
- Advanced search and filtering options

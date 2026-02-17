# Firebase Setup Guide for Yummyfi App

This guide provides step-by-step instructions for setting up Firebase across all components of the Yummyfi food delivery app.

## Table of Contents

1. [Firebase Console Setup](#firebase-console-setup)
2. [Web App (Root .env)](#web-app-root-env)
3. [Admin Dashboard (admin/.env)](#admin-dashboard-adminenv)
4. [React Native Mobile App (mobile/.env)](#react-native-mobile-app-mobileenv)
5. [Cloud Functions (functions/.env)](#cloud-functions-functionsen)
6. [Firebase Services Configuration](#firebase-services-configuration)
7. [Testing Firebase Integration](#testing-firebase-integration)

---

## Firebase Console Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `yummyfi-app` (or your preferred name)
4. Choose whether to enable Google Analytics (recommended: Yes)
5. Select Google Analytics account or create new one
6. Choose default Analytics location
7. Click "Create project"
8. Wait for project creation to complete

### Step 2: Enable Required Services

1. In Firebase Console, go to your project
2. Enable the following services:

#### Authentication

1. Go to **Authentication** → **Get started**
2. Go to **Sign-in method** tab
3. Enable **Email/Password** provider
4. Enable **Google** provider (optional but recommended)
5. Enable **Phone** provider (for OTP login)
6. Configure authorized domains (add your domain)

#### Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in test mode** (for development)
3. Select location: `asia-south1` (Mumbai) or your preferred region
4. Click **Done**

#### Storage

1. Go to **Storage** → **Get started**
2. Choose **Start in test mode**
3. Click **Done**

#### Functions (Optional)

1. Go to **Functions** → **Get started**
2. Follow setup wizard to enable Cloud Functions

### Step 3: Create Multiple Apps

Firebase requires separate app configurations for different platforms:

#### Web App (for main website)

1. Click the **Web** icon (`</>`) in project overview
2. App nickname: `Yummyfi Web`
3. Check "Also set up Firebase Hosting" (optional)
4. Click **Register app**
5. Copy the config object (we'll use this later)

#### Android App (for React Native)

1. Click the **Android** icon in project overview
2. Android package name: `com.yummyfi.app` (or your package name)
3. App nickname: `Yummyfi Mobile`
4. Debug signing certificate SHA-1: (leave empty for now)
5. Click **Register app**
6. Download `google-services.json`
7. Place it in `mobile/google-services.json`
8. Click **Next** → **Next** → **Continue to console**

---

## Web App (Root .env)

The main website uses Vite and requires VITE\_ prefixed environment variables.

### Current Configuration

```dotenv
# Root .env - Web App Configuration
VITE_FIREBASE_API_KEY=AIzaSyCOtVFEKK7fr6acQ6wnGSPbJZVwWm2xyyM
VITE_FIREBASE_AUTH_DOMAIN=ankit-yummy-fi.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ankit-yummy-fi
VITE_FIREBASE_STORAGE_BUCKET=ankit-yummy-fi.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=915590299815
VITE_FIREBASE_APP_ID=1:915590299815:web:bbc4c94bac15f3d5901b82
```

### Setup Steps for Web App

1. **Get Firebase Config from Console**
   - Go to Firebase Console → Project Settings → General tab
   - Scroll to "Your apps" section
   - Find your Web app (Yummyfi Web)
   - Click the config icon to see the JavaScript object

2. **Update Root .env File**
   - Open `.env` in project root
   - Replace the VITE*FIREBASE*\* values with your config:

   ```dotenv
 
   ```

3. **Firebase Configuration in Code**
   - The config is used in `src/firebase.ts`:

   ```typescript
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: import.meta.env.VITE_FIREBASE_APP_ID,
   };
   ```

4. **Test Web App**

   ```bash
   cd yummyfi-app
   npm install
   npm run dev
   ```

   - Open browser to `http://localhost:5173`
   - Check browser console for Firebase initialization errors

---

## Admin Dashboard (admin/.env)

The admin dashboard is a separate Vite app for restaurant management.

### Current Configuration

 
```

### Setup Steps for Admin Dashboard

1. **Use Same Firebase Project**
   - Admin dashboard uses the same Firebase project as the main web app
   - Copy the VITE*FIREBASE*\* variables from root `.env`

2. **Update Admin .env File**
   - Open `admin/.env`
   - Ensure VITE*FIREBASE*\* variables match root `.env`
   - The EXPO*PUBLIC*\* variables are for reference only (mobile app config)

3. **Firebase Configuration in Admin Code**
   - Check `admin/src/firebase.ts` for config usage
   - Should use same pattern as main web app

4. **Test Admin Dashboard**

   ```bash
   cd admin
   npm install
   npm run dev
   ```

   - Open browser to `http://localhost:5174`
   - Login with admin email from VITE*ADMIN_EMAIL*\* variables

---

## React Native Mobile App (mobile/.env)

The mobile app uses Expo and requires EXPO*PUBLIC* prefixed environment variables.

### Current Configuration

```dotenv
 
```

### React Native Firebase Setup Steps

#### Step 1: Install Firebase SDK

```bash
cd mobile
npm install firebase
# OR
npx expo install firebase
```

#### Step 2: Configure Firebase in React Native

1. **Get Android App Config from Firebase Console**
   - Go to Firebase Console → Project Settings → General tab
   - Find your Android app (Yummyfi Mobile)
   - Copy the config values

2. **Update mobile/.env**
   - Replace EXPO*PUBLIC_FIREBASE*\* values with your Android app config
   - Note: React Native uses different app registration than web

3. **Firebase Configuration in Code**
   - Check `mobile/src/config/firebase.ts`:
   ```typescript
   const firebaseConfig = {
  
   ```

#### Step 3: Android Specific Setup

1. **Download google-services.json**
   - From Firebase Console → Android app → Download google-services.json
   - Place in `mobile/google-services.json`

#### Step 2: Configure Expo for Firebase

For Expo managed projects, configure the `google-services.json` in your `app.json`:

```json
{
  "expo": {
    "android": {
      "googleServicesFile": "./google-services.json",
      "package": "com.yummyfi.app"
    }
  }
}
```

#### Step 3: EAS Build Configuration (Optional)

If using EAS Build, create an `eas.json` file in your mobile project root:

```json
{
  "cli": {
    "version": ">= 10.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

The Google Services Gradle plugin will be automatically configured by Expo when you build with EAS.

#### Step 4: iOS Setup (if needed)

1. **Add iOS App in Firebase Console**
   - Click iOS icon in project overview
   - Bundle ID: `com.yummyfi.app`
   - Download GoogleService-Info.plist
   - Place in `mobile/ios/Yummyfi/GoogleService-Info.plist`

2. **Update app.json for iOS**
   ```json
   {
     "expo": {
       "ios": {
         "googleServicesFile": "./GoogleService-Info.plist",
         "bundleIdentifier": "com.yummyfi.app"
       }
     }
   }
   ```

#### Step 5: Install Additional Packages

```bash
# For authentication
npx expo install @react-native-async-storage/async-storage

# For push notifications (optional)
npx expo install expo-notifications

# For location services
npx expo install expo-location
```

#### Step 6: Test React Native App

```bash
cd mobile
npx expo start
```

- Press `a` for Android emulator
- Press `i` for iOS simulator
- Check device logs for Firebase initialization

---

## Cloud Functions (functions/.env)

Firebase Cloud Functions run server-side code.

### Current Configuration

```dotenv
# Functions .env - Server-side Configuration
# Add Firebase service account key for server-side operations
FIREBASE_SERVICE_ACCOUNT_KEY=your_service_account_json_here
```

### Setup Steps for Cloud Functions

1. **Create Service Account Key**
   - Go to Firebase Console → Project Settings → Service accounts
   - Click "Generate new private key"
   - Download the JSON file
   - Copy the entire JSON content

2. **Update functions/.env**

   ```dotenv
   FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project",...}
   ```

3. **Functions Configuration**
   - Check `functions/index.js` for how the service account is used
   - Used for server-side Firestore operations, authentication, etc.

4. **Deploy Functions**
   ```bash
   cd functions
   firebase deploy --only functions
   ```

---

## Firebase Services Configuration

### Firestore Security Rules

1. Go to Firebase Console → Firestore Database → Rules
2. Update rules for your app's security requirements
3. Example basic rules:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

### Storage Security Rules

1. Go to Firebase Console → Storage → Rules
2. Configure file upload permissions
3. Example rules:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

### Authentication Configuration

1. Go to Authentication → Sign-in method
2. Configure providers:
   - Email/Password: Enable
   - Google: Enable (add OAuth client ID)
   - Phone: Enable (requires reCAPTCHA setup)

---

## Testing Firebase Integration

### Web App Testing

```bash
cd yummyfi-app
npm run dev
# Check browser console for Firebase errors
```

### Admin Dashboard Testing

```bash
cd admin
npm run dev
# Test admin login functionality
```

### Mobile App Testing

```bash
cd mobile
npx expo start
# Test on device/emulator
# Check authentication, Firestore reads/writes
```

### Common Issues & Solutions

1. **"Firebase: No Firebase App '[DEFAULT]' has been created"**
   - Check that environment variables are loaded correctly
   - Verify config object structure
   - Restart your dev server after changing .env files

2. **"Firebase: Auth domain not authorized"**
   - Add your domain to authorized domains in Firebase Console
   - Go to Authentication → Settings → Authorized domains
   - Add localhost for development

3. **"Firebase: Project not found"**
   - Verify project ID in environment variables
   - Check that Firebase project exists in console

4. **React Native: "Firebase App named '[DEFAULT]' already exists"**
   - Ensure Firebase is initialized only once
   - Check for duplicate initialization calls

5. **"Missing or insufficient permissions" (Critical Fix Applied)**
   - **Solution**: Updated firestore.rules to allow email-based admin access
   - The rules now check if your email matches the authorized admin emails
 
   - **Auto-create admin**: Just login to admin dashboard, it will create your admin document automatically

6. **Admin can't create products/orders**
   - Ensure Firestore security rules are deployed: `firebase deploy --only firestore:rules`
   - Login with one of the authorized admin emails
   - Check browser console for specific error messages

7. **React Router Future Flag Warnings (Non-Critical)**
   - These are just warnings about React Router v7 migration
   - They don't affect functionality
   - Can be ignored for now or add future flags to router config

### Quick Fix for Permission Errors

If you're getting "Missing or insufficient permissions" errors:

```bash
# 1. Navigate to project root
cd yummyfi-app

# 2. Deploy updated security rules
firebase deploy --only firestore:rules

# 3. Restart your dev server
cd admin
npm run dev

# 4. Login with an authorized admin email
# The system will automatically create your admin document on first login
```

### Initial Setup Script

Run the initialization script for guided setup:

```bash
node init-firebase.js
```

This script will:

- Deploy Firestore security rules
- Guide you through creating admin accounts
- Deploy indexes for better performance
- Provide instructions for sample data

---

## Environment Variables Summary

| File             | Purpose          | Prefix         | Used By             |
| ---------------- | ---------------- | -------------- | ------------------- |
| `.env`           | Main web app     | `VITE_`        | Vite (main website) |
| `admin/.env`     | Admin dashboard  | `VITE_`        | Vite (admin panel)  |
| `mobile/.env`    | React Native app | `EXPO_PUBLIC_` | Expo/React Native   |
| `functions/.env` | Cloud Functions  | None           | Node.js server      |

## Next Steps

1. Test all applications with Firebase integration
2. Set up proper Firestore security rules for production
3. Configure Firebase Hosting for web apps
4. Set up CI/CD pipelines for automatic deployment
5. Monitor Firebase usage and costs

For more information, refer to the [Firebase Documentation](https://firebase.google.com/docs).</content>
<parameter name="filePath">d:\Downloads\Yummyfi-app\Yummyfi-app\Yummyfi-app\FIREBASE_SETUP.md

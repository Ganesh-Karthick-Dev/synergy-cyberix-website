# Firebase Cloud Messaging (FCM) Setup

This document describes how to set up Firebase Cloud Messaging for push notifications in the website.

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id (optional)
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key
```

## How to Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Click on the web app icon (`</>`) or add a web app if you haven't
6. Copy the configuration values:
   - `apiKey`: Found in the config object
   - `authDomain`: Found in the config object
   - `projectId`: Found in the config object
   - `storageBucket`: Found in the config object
   - `messagingSenderId`: Found in the config object
   - `appId`: Found in the config object
   - `measurementId`: Found in the config object (optional, for Analytics)

## How to Get VAPID Key

1. In Firebase Console, go to Project Settings
2. Click on the "Cloud Messaging" tab
3. Scroll down to "Web configuration"
4. Under "Web Push certificates", you'll see "Key pair"
5. If no key pair exists, click "Generate key pair"
6. Copy the key and use it as `NEXT_PUBLIC_FIREBASE_VAPID_KEY`

## Features

### Automatic FCM Token Management

- **On Login**: FCM token is automatically requested and stored on the backend
- **On Logout**: FCM token is automatically removed from the backend
- **Multiple Devices**: Each browser/device gets its own FCM token (stored in `user_fcm_token` table)

### Service Worker

- Service worker is automatically registered on page load
- Handles background push notifications
- Handles notification clicks and opens the app

### How It Works

1. **Service Worker Registration**: `FCMProvider` component registers the service worker on app load
2. **FCM Initialization**: `FCMInitializer` component initializes FCM when user is authenticated
3. **Token Storage**: FCM token is stored in:
   - Backend database (`user_fcm_token` table)
   - Browser localStorage (for quick access)
4. **Token Cleanup**: On logout, FCM token is removed from both backend and localStorage

## Testing

1. Make sure all environment variables are set
2. Login to the website
3. Check browser console for FCM initialization logs
4. Check backend database to verify token is stored
5. Send a test notification from admin panel
6. You should receive the notification even if the browser tab is closed

## Troubleshooting

### Service Worker Not Registering

- Check browser console for errors
- Ensure HTTPS (or localhost) is being used
- Check that `/firebase-messaging-sw.js` is accessible

### FCM Token Not Obtaining

- Check that notification permission is granted
- Verify VAPID key is correct
- Check browser console for errors
- Ensure Firebase config is correct

### Notifications Not Receiving

- Verify FCM token is stored in backend
- Check that notification permission is granted
- Verify service worker is active
- Check browser console for errors


# FCM Notification Debugging Guide

## Quick Checklist

1. ✅ **Service Worker Registered**
   - Open DevTools → Application → Service Workers
   - Check if `firebase-messaging-sw.js` is registered and active
   - Status should be "activated and is running"

2. ✅ **Firebase Config Sent to Service Worker**
   - Open DevTools → Application → Service Workers → Click on your service worker
   - Check Console tab for: `[Service Worker] ✅ Received Firebase config from main app`
   - Check for: `[Service Worker] ✅ Firebase initialized successfully`

3. ✅ **FCM Token Valid**
   - Check browser console for: `[FCM] ✅ Token obtained successfully`
   - Token should be stored in `localStorage` as `fcmToken`
   - Token format: `[random-string]:APA91b[long-base64-string]`

4. ✅ **Notification Permission**
   - Check `Notification.permission` in console (should be `"granted"`)
   - If not granted, user needs to enable notifications

5. ✅ **Backend Sending Notifications**
   - Check server logs for successful send responses
   - Verify FCM token exists in `user_fcm_token` table with `isActive = true`

## Debugging Steps

### Step 1: Check Service Worker Console

1. Open Chrome DevTools (F12)
2. Go to **Application** tab → **Service Workers**
3. Find `firebase-messaging-sw.js`
4. Click on the service worker link to open its console
5. Look for these logs:
   - `[Service Worker] 📦 Service worker installed`
   - `[Service Worker] 🔄 Service worker activated`
   - `[Service Worker] ✅ Received Firebase config from main app`
   - `[Service Worker] ✅ Firebase initialized successfully`

### Step 2: Check Main Browser Console

Look for these logs:
- `[Service Worker] Registered successfully`
- `[Service Worker] Firebase config sent to service worker`
- `[FCM] ✅ Token obtained successfully`
- `[FCM] Token stored on backend successfully`

### Step 3: Verify FCM Token in Database

```sql
SELECT * FROM user_fcm_token 
WHERE is_active = true 
ORDER BY last_used_at DESC;
```

Verify:
- Token exists
- `is_active = true`
- Token format is correct (starts with device ID, contains `:APA91b`)

### Step 4: Test Notification from Backend

1. Send a notification from admin panel
2. Check server logs for:
   - `🟢 [FCM] Sending notification to [X] tokens`
   - `✅ Successfully sent [X] notifications`
3. Check for any error messages

### Step 5: Check Service Worker for Incoming Messages

1. Open Service Worker console (Application → Service Workers → Click service worker)
2. Send a test notification
3. Look for:
   - `[Service Worker] ✅ Received background message:`
   - `[Service Worker] Showing notification:`
   - `[Service Worker] ✅ Notification displayed successfully`

## Common Issues

### Issue 1: Service Worker Not Initialized

**Symptoms:**
- No logs in service worker console
- Firebase not initialized

**Solution:**
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Unregister service worker and reload
- Check if `firebase-messaging-sw.js` is accessible at `/firebase-messaging-sw.js`

### Issue 2: Firebase Config Not Received

**Symptoms:**
- Service worker active but no Firebase initialization logs

**Solution:**
- Check environment variables are set correctly
- Check browser console for config sending logs
- Verify service worker is receiving messages

### Issue 3: Notifications Not Showing

**Symptoms:**
- Service worker receives messages but no notification appears

**Possible Causes:**
1. **Notification permission denied**
   - Check `Notification.permission` in console
   - User needs to enable notifications in browser settings

2. **Browser blocking notifications**
   - Some browsers (especially on Linux) require system-level notification permissions
   - Check system notification settings

3. **Service worker not handling messages**
   - Check service worker console for errors
   - Verify `onBackgroundMessage` is registered

### Issue 4: Linux-Specific Issues (Kali Linux)

**Symptoms:**
- Notifications work on other OS but not on Linux

**Solutions:**
1. **Check system notification daemon:**
   ```bash
   # Check if notification daemon is running
   ps aux | grep notification
   
   # For GNOME
   gsettings get org.gnome.desktop.notifications enabled
   
   # Enable if disabled
   gsettings set org.gnome.desktop.notifications enabled true
   ```

2. **Check browser notification settings:**
   - Chrome: Settings → Privacy and security → Site settings → Notifications
   - Ensure site is allowed

3. **Test with a simple notification:**
   ```javascript
   // In browser console
   new Notification('Test', { body: 'This is a test' })
   ```

### Issue 5: FCM Token Invalid

**Symptoms:**
- Backend reports token errors
- `messaging/invalid-registration-token` errors

**Solution:**
- Token might be expired or invalid
- User needs to re-login to get a new token
- Check if token format is correct

## Testing Notifications

### Test 1: Manual Browser Notification

```javascript
// In browser console
if ('Notification' in window && Notification.permission === 'granted') {
  new Notification('Test Notification', {
    body: 'If you see this, browser notifications work!',
    icon: '/favicon.ico'
  })
}
```

### Test 2: Check Service Worker Status

```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service Workers:', registrations)
  registrations.forEach(reg => {
    console.log('Scope:', reg.scope)
    console.log('Active:', reg.active)
    console.log('Installing:', reg.installing)
    console.log('Waiting:', reg.waiting)
  })
})
```

### Test 3: Check FCM Token

```javascript
// In browser console
const token = localStorage.getItem('fcmToken')
console.log('FCM Token:', token ? `${token.substring(0, 30)}...` : 'NOT FOUND')
```

### Test 4: Send Test Notification from Firebase Console

1. Go to Firebase Console → Cloud Messaging
2. Click "Send test message"
3. Enter your FCM token
4. Send notification
5. Check service worker console for received message

## Logs to Monitor

### Service Worker Console (Application → Service Workers → Click service worker)

- `[Service Worker] 📦 Service worker installed`
- `[Service Worker] 🔄 Service worker activated`
- `[Service Worker] ✅ Received Firebase config from main app`
- `[Service Worker] ✅ Firebase initialized successfully`
- `[Service Worker] ✅ Received background message:`
- `[Service Worker] ✅ Notification displayed successfully`

### Main Browser Console

- `[Service Worker] Registered successfully`
- `[FCM] ✅ Token obtained successfully`
- `[FCM] Token stored on backend successfully`
- `[FCM Message Handler] Received foreground message:` (when tab is open)

### Server Logs

- `🟢 [FCM] Sending notification to [X] tokens`
- `✅ Successfully sent [X] notifications`
- Any error messages with token details

## Still Not Working?

1. **Clear everything and start fresh:**
   - Unregister all service workers
   - Clear browser cache
   - Hard refresh
   - Re-login to get new FCM token

2. **Check browser compatibility:**
   - Chrome/Edge: Full support
   - Firefox: Full support
   - Safari: Limited support (macOS/iOS only)

3. **Verify environment variables:**
   - All `NEXT_PUBLIC_FIREBASE_*` variables are set
   - `NEXT_PUBLIC_FIREBASE_VAPID_KEY` is correct
   - Backend Firebase credentials are correct

4. **Check network:**
   - No firewall blocking Firebase endpoints
   - No proxy interfering with WebSocket connections



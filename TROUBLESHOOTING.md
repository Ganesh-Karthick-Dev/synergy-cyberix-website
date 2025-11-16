# FCM Troubleshooting Guide

## Linux-Specific Notification Issues

### 1. System Notification Settings
On Linux (including Kali Linux), you need to ensure:
- **Desktop Environment Notifications**: Make sure notifications are enabled in your desktop environment settings
- **Do Not Disturb**: Check if DND mode is enabled
- **Browser Notification Settings**: Ensure your browser has permission to show notifications

### 2. Browser-Specific Settings

#### Chrome/Chromium on Linux:
1. Go to `chrome://settings/content/notifications`
2. Ensure your site (`localhost:4006`) is allowed
3. Check "Ask before sending" is enabled

#### Firefox on Linux:
1. Go to `about:preferences#privacy`
2. Scroll to "Permissions" → "Notifications"
3. Ensure your site is allowed

### 3. Service Worker Issues

If you see duplicate service workers:
1. Open DevTools → Application → Service Workers
2. Unregister any service worker with scope `firebase-cloud-messaging-push-scope`
3. Keep only the one with scope `/`
4. Refresh the page

### 4. Testing Notifications

**Test with tab open:**
- Notifications should appear via `FCMMessageHandler` component
- Check browser console for `[FCM Message Handler] Received foreground message`

**Test with tab closed:**
- Notifications should appear via service worker
- Check service worker console (DevTools → Application → Service Workers → Inspect)

### 5. Common Issues

**No notifications appearing:**
- Check `Notification.permission` in console (should be "granted")
- Verify service worker is active and running
- Check service worker console for errors
- Ensure FCM token is valid in database

**Service worker stopped:**
- Click "Start" button in DevTools
- Or refresh the page to restart it

**Duplicate service workers:**
- The code now auto-unregisters Firebase-created workers
- Manually unregister if needed

### 6. Debugging Steps

1. **Check Browser Console:**
   ```javascript
   Notification.permission // Should be "granted"
   ```

2. **Check Service Worker:**
   - DevTools → Application → Service Workers
   - Should see one worker with scope `/`
   - Status should be "activated and is running"

3. **Check Service Worker Console:**
   - Click "Inspect" on the service worker
   - Look for `[Service Worker] Firebase initialized successfully`
   - Look for `[Service Worker] ✅ Received background message`

4. **Test Notification:**
   ```javascript
   // In browser console
   new Notification('Test', { body: 'This is a test' })
   ```

### 7. Linux Desktop Environment Settings

**GNOME:**
- Settings → Notifications → Ensure enabled

**KDE:**
- System Settings → Notifications → Ensure enabled

**XFCE:**
- Settings → Notifications → Ensure enabled

**i3/Other:**
- Install a notification daemon (e.g., `dunst`)
- Ensure it's running: `systemctl --user status dunst`



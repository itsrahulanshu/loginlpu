# 🎓 LPU Auto Login - Chrome Extension

## ✨ Fully Automatic Cookie Import!

**Ab manual cookie import ki zarurat nahi!** This Chrome extension automatically:
- ✅ Calls the login API
- ✅ Gets session cookies
- ✅ Automatically sets cookies in browser
- ✅ Opens UMS dashboard

**Just 2 clicks - that's it!**

---

## 🚀 Installation Steps

### Step 1: Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle on top-right)
3. Click **"Load unpacked"**
4. Select the folder: `/Users/rahulanshu/all project/lpu-one-click-login/chrome-extension`
5. Extension is now installed! 🎉

### Step 2: Make Sure Server is Running

```bash
cd "/Users/rahulanshu/all project/lpu-one-click-login"
npm start
```

Server should be running on `http://localhost:3000`

---

## 🎯 How to Use (Super Simple!)

### Method 1: Using Extension Popup

1. **Click extension icon** in Chrome toolbar (🎓)
2. **Click "Login to UMS"** button
3. Wait 10-15 seconds (AI solves captcha automatically)
4. **Click "Open UMS Dashboard"** button
5. **Done!** You're logged into UMS! 🎉

### Method 2: Direct Command

Extension works in background, no manual cookie import needed!

---

## 🔧 Technical Details

### What Extension Does:

```
User clicks "Login to UMS"
  ↓
Extension calls: POST http://localhost:3000/api/login
  ↓
Server performs automated login (AI solves captcha)
  ↓
Extension calls: GET http://localhost:3000/api/cookies
  ↓
Extension gets cookie JSON from server
  ↓
Extension uses Chrome Cookies API to set cookies
  ↓
chrome.cookies.set() for each cookie
  ↓
Cookies automatically imported in browser!
  ↓
User clicks "Open UMS Dashboard"
  ↓
Opens: https://ums.lpu.in/lpuums/StudentDashboard.aspx
  ↓
Already logged in! ✅
```

### Permissions Required:

- **cookies**: To set/get cookies for ums.lpu.in
- **storage**: To remember login state
- **tabs**: To open UMS dashboard in new tab
- **host_permissions**: 
  - `http://localhost:3000/*` - Backend API
  - `https://ums.lpu.in/*` - UMS website
  - `*://*.lpu.in/*` - All LPU domains

---

## 📂 Extension Files

```
chrome-extension/
├── manifest.json       # Extension configuration
├── popup.html          # Extension popup UI
├── popup.js            # Popup logic
├── background.js       # Background service worker
├── icon16.png          # 16x16 icon
├── icon48.png          # 48x48 icon
├── icon128.png         # 128x128 icon
└── README.md           # This file
```

---

## 🎨 Features

### ✅ Fully Automatic
- No manual cookie copying
- No browser extension like "Cookie Editor" needed
- Everything happens automatically

### ✅ One-Click Operation
1. Click extension icon
2. Click "Login to UMS"
3. Wait for auto-login
4. Click "Open UMS Dashboard"
5. Done!

### ✅ Status Indicators
- 🟢 Green dot = Server online
- 🔴 Red dot = Server offline
- Real-time server status check

### ✅ Error Handling
- Shows clear error messages
- Handles server connection issues
- Validates all API responses

---

## 🔒 Security

### What Extension Does:
- ✅ Only communicates with localhost:3000 (your own server)
- ✅ Only sets cookies for ums.lpu.in domain
- ✅ No external API calls
- ✅ No data collection
- ✅ Open source code

### What Extension DOESN'T Do:
- ❌ Doesn't send data to external servers
- ❌ Doesn't track your activity
- ❌ Doesn't access other websites
- ❌ Doesn't store passwords

---

## 🐛 Troubleshooting

### Extension shows "Server Offline"
**Solution:** Make sure the Node.js server is running:
```bash
cd "/Users/rahulanshu/all project/lpu-one-click-login"
npm start
```

### Login button doesn't work
**Solution:** 
1. Check if Anti-Captcha API key is valid
2. Check if you have balance in Anti-Captcha account
3. Check browser console for errors (F12)

### Cookies not setting
**Solution:**
1. Check Chrome permissions for the extension
2. Make sure you're not in Incognito mode
3. Try reloading the extension

### "Open UMS Dashboard" button not appearing
**Solution:**
- Wait for "Cookies imported" success message
- If error appears, try clicking "Login to UMS" again

---

## 🎯 Comparison: Extension vs Manual

### Without Extension (Old Way):
1. Login via app
2. Click "Show Cookies"
3. Copy JSON
4. Install Cookie Editor extension
5. Open ums.lpu.in
6. Click extension → Import
7. Paste JSON
8. Import
9. Refresh page
10. Go to dashboard

**Total: 10 steps**

### With Extension (New Way):
1. Click extension icon
2. Click "Login to UMS"
3. Click "Open UMS Dashboard"

**Total: 3 clicks! 🎉**

---

## 📝 Notes

### Icon Files
Current icons are placeholders. For production:
1. Create proper 16x16, 48x48, 128x128 PNG icons
2. Replace the existing `icon*.png` files
3. Icons should have transparent background
4. Use graduation cap (🎓) or LPU logo

### Manifest Version
Uses Manifest V3 (latest Chrome extension standard)
- Modern service worker instead of background page
- Better security
- Future-proof

---

## 🚀 Future Enhancements

- [ ] Add keyboard shortcut (Ctrl+Shift+L)
- [ ] Remember last login time
- [ ] Auto-refresh cookies before expiry
- [ ] Support for Firefox
- [ ] Context menu integration
- [ ] Badge with login status
- [ ] Options page for settings

---

## 💡 Tips

1. **Pin the extension** to toolbar for easy access:
   - Right-click extension icon
   - Select "Pin"

2. **Keep server running** in background:
   - Run in separate terminal
   - Or use `pm2` or `nodemon`

3. **Check server logs** if issues:
   - Terminal shows all login attempts
   - Helps debug problems

---

## 📞 Support

If you face any issues:
1. Check console logs (F12 → Console)
2. Check server terminal output
3. Verify Anti-Captcha balance
4. Ensure UMS website is accessible

---

**Made with ❤️ for LPU Students**

**Ab sirf 3 clicks mein UMS login! 🚀**

# 🎯 Chrome Extension Installation Guide

## Step-by-Step Installation (With Screenshots)

### Step 1: Open Chrome Extensions Page

1. Open Google Chrome
2. Type in address bar: `chrome://extensions/`
3. Press Enter

**OR**

1. Click the three dots (⋮) in top-right corner
2. Go to **More tools** → **Extensions**

---

### Step 2: Enable Developer Mode

1. Look for **"Developer mode"** toggle in top-right corner
2. Click to **turn it ON** (should turn blue)

![Developer Mode](https://i.imgur.com/example.png)

---

### Step 3: Load the Extension

1. Click **"Load unpacked"** button (appears after enabling Developer mode)
2. A file browser will open
3. Navigate to: `/Users/rahulanshu/all project/lpu-one-click-login/chrome-extension`
4. Click **"Select"** or **"Open"**

---

### Step 4: Verify Installation

You should see:
- ✅ Extension card with name "LPU Auto Login"
- ✅ Version 1.0.0
- ✅ No errors
- ✅ Extension icon in Chrome toolbar

---

### Step 5: Pin Extension (Optional but Recommended)

1. Click the **puzzle piece icon** (🧩) in Chrome toolbar
2. Find "LPU Auto Login" in the list
3. Click the **pin icon** next to it
4. Extension icon will now always be visible in toolbar

---

## 🚀 First Time Usage

### 1. Start the Backend Server

Open Terminal and run:

```bash
cd "/Users/rahulanshu/all project/lpu-one-click-login"
npm start
```

You should see:
```
🚀 LPU One-Click Login Server
📍 Server running on http://localhost:3000
✅ Ready to accept requests
```

**Keep this terminal window open!**

---

### 2. Use the Extension

1. **Click the extension icon** (🎓) in Chrome toolbar
2. You'll see a popup with:
   - Status: "Server Online" (green dot)
   - Button: "🚀 Login to UMS"

3. **Click "Login to UMS"** button
   - Status will change to "Logging in..."
   - Message: "AI solving captcha... Please wait..."

4. **Wait 10-15 seconds**
   - Extension calls backend API
   - Backend solves captcha automatically
   - Cookies are fetched from server
   - Extension sets cookies in browser

5. **Click "Open UMS Dashboard"** button
   - Opens: https://ums.lpu.in/lpuums/StudentDashboard.aspx
   - **You're logged in!** 🎉

---

## 🔍 Troubleshooting

### Extension not showing in toolbar?
**Solution:** Look for puzzle piece icon (🧩) and pin the extension

### "Server Offline" error?
**Solution:** 
```bash
cd "/Users/rahulanshu/all project/lpu-one-click-login"
npm start
```

### "Login failed" error?
**Solution:**
1. Check your `.env` file has correct credentials
2. Check Anti-Captcha balance at https://anti-captcha.com
3. Make sure UMS website is accessible

### Cookies not setting?
**Solution:**
1. Make sure you're not in Incognito/Private mode
2. Check extension permissions in `chrome://extensions/`
3. Try reloading the extension (click reload icon)

### Extension not loading?
**Solution:**
1. Make sure you selected the `chrome-extension` folder, not a file
2. Check for errors in `chrome://extensions/` page
3. Try removing and re-adding the extension

---

## 📱 Quick Reference

### File Structure
```
chrome-extension/
├── manifest.json       ← Extension config
├── popup.html          ← UI you see when clicking icon
├── popup.js            ← Logic for the popup
├── background.js       ← Background service worker
├── icon16.png          ← Small icon
├── icon48.png          ← Medium icon
└── icon128.png         ← Large icon
```

### Important URLs
- **Extensions Page:** `chrome://extensions/`
- **Backend Server:** `http://localhost:3000`
- **UMS Dashboard:** `https://ums.lpu.in/lpuums/StudentDashboard.aspx`

### Keyboard Shortcuts
- **Open Extensions:** Chrome Menu → More tools → Extensions
- **Reload Extension:** Click reload icon on extension card
- **Remove Extension:** Click "Remove" on extension card

---

## 🎯 Complete Workflow

```
┌─────────────────────────────────────┐
│  You: Click Extension Icon          │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Extension: Check Server Status     │
│  GET localhost:3000/api/health      │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  You: Click "Login to UMS"          │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Extension: POST /api/login         │
│  Shows: "AI solving captcha..."     │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Backend: Auto login (10-15 secs)   │
│  - Scrape page                      │
│  - Download captcha                 │
│  - Solve with AI                    │
│  - Submit login                     │
│  - Return cookies                   │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Extension: GET /api/cookies        │
│  Gets cookie JSON                   │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Extension: Set cookies via         │
│  chrome.cookies.set() API           │
│  Shows: "Cookies imported!"         │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  You: Click "Open UMS Dashboard"    │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Opens: ums.lpu.in/StudentDashboard │
│  ✅ Already logged in!              │
└─────────────────────────────────────┘
```

---

## 💡 Pro Tips

1. **Keep server running in background**
   ```bash
   # Run in separate terminal window
   npm start
   ```

2. **Check server logs** for debugging
   - Terminal shows all login attempts
   - Helps identify issues

3. **Pin the extension** for quick access
   - Click puzzle icon → Pin

4. **Use daily** - Session stays valid for ~24 hours
   - Login once in morning
   - Use UMS throughout the day

---

## 🔐 Privacy & Security

### What the extension can access:
- ✅ Cookies for `ums.lpu.in` domain only
- ✅ Connection to `localhost:3000` only
- ✅ Your local backend server

### What the extension CANNOT access:
- ❌ Your browsing history
- ❌ Data from other websites
- ❌ Personal information
- ❌ Passwords (except via your own backend)

### Data flow:
```
Your Computer (Extension) 
    ↓ 
Your Computer (Backend on localhost:3000)
    ↓
UMS Website (ums.lpu.in)
```

**Everything stays on your machine!** No external servers involved.

---

**Made with ❤️ for LPU Students**

**Ab login ho gaya sirf 3 clicks mein! 🚀**

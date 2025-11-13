# 🎓 LPU One-Click Login - Session Management Guide

## ✅ What's Implemented

Your LPU One-Click Login system is now fully functional with multiple ways to access UMS after automatic captcha solving:

### **Login Flow:**
1. Click "🚀 Login to UMS" button
2. System automatically:
   - Scrapes login page
   - Downloads captcha image
   - Solves captcha with Anti-Captcha API
   - Converts captcha text
   - Submits login form
3. Session cookies are saved
4. Redirects to success page with 3 access methods

---

## 🌟 Three Ways to Access UMS

### **Method 1: View Dashboard (Recommended) 📊**
- Click "Open Dashboard Here" button
- Dashboard loads in an iframe within the app
- Session maintained automatically
- **Pros:** Works immediately, no manual steps
- **Cons:** Limited to iframe view

### **Method 2: Open in New Window 🌐**
- Click "Open in New Tab" button
- Opens `https://ums.lpu.in/lpuums/StudentDashboard.aspx` directly
- **Note:** May require re-login due to cross-domain cookie restrictions
- **Use Case:** If you need full browser navigation

### **Method 3: Export Session Cookies 🍪**
- Click "Show Cookies" to view session cookies in JSON format
- Copy the cookies
- Use a browser extension like "Cookie Editor" to import them
- Visit ums.lpu.in - you'll be logged in!

---

## 🍪 Cookie Format

Your session cookies are exported in this format:
```json
[
    {
        "name": "_gat",
        "value": "1",
        "domain": ".lpu.in",
        "hostOnly": false,
        "path": "/",
        "secure": false,
        "httpOnly": false,
        "sameSite": null,
        "session": true
    },
    {
        "name": "_ga_B0Z6G6GCD8",
        "value": "...",
        "domain": "ums.lpu.in",
        "hostOnly": true,
        "path": "/",
        "secure": false,
        "httpOnly": true,
        "sameSite": "strict",
        "session": true
    }
    // ... more cookies
]
```

---

## 📋 How to Use Exported Cookies

### **Step 1: Install Cookie Manager Extension**
Choose one:
- **Cookie Editor** (Chrome/Firefox): https://cookie-editor.com/
- **EditThisCookie** (Chrome): https://www.editthiscookie.com/
- **Cookie-Editor** (Firefox): https://addons.mozilla.org/en-US/firefox/addon/cookie-editor/

### **Step 2: Export Cookies**
1. After successful login, you'll see the success page
2. Click "Method 3: Export Session Cookies"
3. Click "Show Cookies"
4. Click "📋 Copy Cookies" button

### **Step 3: Import to Browser**
1. Open new tab and go to `https://ums.lpu.in`
2. Click the cookie extension icon in your browser toolbar
3. Select "Import" or "Import Cookies"
4. Paste the copied JSON
5. Click "Import" in the extension
6. Refresh the page

### **Step 4: You're Logged In! 🎉**
- Navigate to `https://ums.lpu.in/lpuums/StudentDashboard.aspx`
- You should be logged in automatically

---

## ⚙️ Technical Details

### **Why Can't We Auto-Set Cookies for ums.lpu.in?**
Browser security (Same-Origin Policy) prevents JavaScript from setting cookies for different domains. Our app runs on `localhost:3000` and cannot set cookies for `ums.lpu.in`.

### **Session Storage**
```javascript
sessionData = {
    loggedIn: true,
    cookies: "cookie_string",
    timestamp: "2025-11-13T...",
    redirectUrl: "https://ums.lpu.in/lpuums/StudentDashboard.aspx",
    loginBot: LPULoginAutomation // Bot instance with active session
}
```

### **Cookie Parsing**
Cookies are parsed from the format:
```
_ga_B0Z6G6GCD8=value; _gat=1; _ga=GA1.2...
```

To JSON array format compatible with browser extensions.

---

## 🚀 Quick Start

```bash
cd "/Users/rahulanshu/all project/lpu-one-click-login"
npm start
```

Open `http://localhost:3000`

---

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/login` | POST | Perform one-click login |
| `/api/dashboard` | GET | View UMS dashboard (proxied) |
| `/api/cookies` | GET | Get session cookies in JSON format |
| `/api/status` | GET | Check if logged in |
| `/api/ums-redirect` | GET | Redirect to UMS (attempts cookie transfer) |
| `/api/logout` | POST | Clear session |

---

## 📝 Files Structure

```
lpu-one-click-login/
├── public/
│   ├── index.html       # Login page
│   ├── success.html     # Success page with 3 methods
│   └── dashboard.html   # Redirect helper page
├── server/
│   ├── index.js         # Express server
│   └── login-automation.js  # Login automation
└── .env                 # Your credentials
```

---

## ⚠️ Important Notes

1. **Session Duration**: Session cookies are maintained in memory. They'll be lost when you stop the server.

2. **Security**: Never share your exported cookies - they give full access to your UMS account.

3. **Browser Extension Required**: For Method 3, you need a cookie manager extension.

4. **Recommended Method**: Use Method 1 (iframe) for quick access without any manual steps.

5. **Cross-Domain Limitation**: Due to browser security, we can't automatically log you into the actual UMS site. The cookie export method is the workaround.

---

## 🎯 Best Workflow

**For Quick Viewing:**
- Use Method 1 (iframe dashboard)

**For Full UMS Access:**
- Use Method 3 (export cookies)
- Import once
- Keep the browser tab open
- Session stays active

**For Testing:**
- Use Method 2 (new window)
- Check if you need to re-login

---

## 💡 Tips

- **Stay Logged In**: Once you import cookies (Method 3), keep that browser window open
- **Multiple Logins**: You can login multiple times - each creates a new session
- **Refresh Session**: If logged out, just click "Login to UMS" again
- **View Cookies**: You can always view your session cookies at `http://localhost:3000/success.html` after logging in

---

Made with ❤️ for LPU Students

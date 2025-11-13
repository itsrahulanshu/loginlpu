# 🎓 LPU One-Click Login - Feature Summary

## ✅ What You Get

### **1. Automatic Captcha Solving**
- No more manual captcha entry
- AI-powered solving via Anti-Captcha API
- Success rate: ~99%
- Takes 5-10 seconds on average

### **2. Session Management**
```
Login Flow:
User clicks button 
  → Scrapes UMS login page
  → Downloads captcha
  → Solves with AI
  → Submits credentials
  → Saves session cookies
  → Shows success page
```

### **3. Three Access Methods**

#### 🚀 Method 1: In-App Dashboard (Easiest)
```
✓ One click access
✓ No manual steps
✓ Works immediately
✗ Limited to iframe view
```

#### 🍪 Method 2: Cookie Export (Most Powerful)
```
✓ Full browser access
✓ Native UMS experience
✓ All features work
✗ Requires cookie extension
✗ One-time setup needed
```

#### 🌐 Method 3: Direct Link (Fallback)
```
✓ Opens real UMS site
✗ May need re-login
✗ Cross-domain restrictions
```

---

## 🍪 Cookie Export Feature

### **What Gets Exported:**
```json
[
  {
    "name": "_ga",
    "value": "GA1.2.334308519.1762992289",
    "domain": ".lpu.in",
    "path": "/",
    "session": true
  },
  {
    "name": "_ga_B0Z6G6GCD8",
    "value": "z3nys2p2z4xfikqhbhgmuzty",
    "domain": "ums.lpu.in",
    "httpOnly": true,
    "sameSite": "strict"
  }
  // ... all session cookies
]
```

### **How to Use:**
1. Login using the app ✓
2. Click "Show Cookies" on success page
3. Copy the JSON
4. Install Cookie Editor extension
5. Visit ums.lpu.in
6. Import cookies via extension
7. Refresh page → Logged in! 🎉

---

## 🔧 Technical Stack

```
Frontend:
- HTML5 + CSS3 (Vanilla)
- Modern JavaScript (ES6+)
- Responsive Design
- No frameworks needed

Backend:
- Node.js + Express
- Axios (HTTP client)
- Cheerio (HTML parsing)
- Anti-Captcha API
- Crypto (captcha conversion)

Security:
- HTTPS agent
- Session isolation
- Local credential storage
- No data logging
```

---

## 📊 API Reference

### POST `/api/login`
**Purpose:** Perform automated login
**Response:**
```json
{
  "success": true,
  "message": "Login successful!",
  "redirectUrl": "https://ums.lpu.in/lpuums/StudentDashboard.aspx",
  "timestamp": "2025-11-13T..."
}
```

### GET `/api/cookies`
**Purpose:** Get session cookies
**Response:**
```json
{
  "success": true,
  "cookies": "cookie_string",
  "cookieJson": [...],
  "timestamp": "..."
}
```

### GET `/api/dashboard`
**Purpose:** View UMS dashboard (proxied)
**Response:** HTML content of StudentDashboard.aspx

### GET `/api/status`
**Purpose:** Check login status
**Response:**
```json
{
  "loggedIn": true,
  "timestamp": "...",
  "hasRedirectUrl": true
}
```

---

## 🎯 Use Cases

### **Quick View**
```
Student needs to check today's classes
→ Open app
→ Click "Login to UMS"
→ Click "Open Dashboard Here"
→ View schedule in iframe
```

### **Full Access**
```
Student needs to fill attendance/submit assignment
→ Login via app
→ Export cookies
→ Import to browser
→ Full UMS access
```

### **Daily Usage**
```
Morning: Login once, export cookies
Daytime: Use native UMS in browser
Evening: Cookies still valid
Next day: Repeat if session expired
```

---

## 🔐 Security Notes

### **What We Store:**
- Session cookies (in memory)
- Login timestamp
- Redirect URL
- Bot instance with session

### **What We DON'T Store:**
- Login history
- Access logs
- Dashboard data
- Personal information

### **Session Lifetime:**
- Memory-based: Lost on server restart
- UMS cookies: ~24 hours typically
- Anti-Captcha balance: Check periodically

---

## 💰 Cost Analysis

### **Anti-Captcha Pricing:**
- ~$0.001 per captcha solve
- 100 logins = ~$0.10
- 1000 logins = ~$1.00

### **Recommended Budget:**
- $5 balance = ~5000 logins
- Typical usage: 2-3 logins/day
- $5 lasts ~4-5 months

---

## 🚀 Future Enhancements (Ideas)

- [ ] Browser extension for direct cookie injection
- [ ] Remember session across server restarts
- [ ] Multiple user support
- [ ] Auto-refresh before session expires
- [ ] Mobile app version
- [ ] Desktop application (Electron)
- [ ] Chrome extension popup
- [ ] Timetable integration

---

## 📱 Browser Extension Recommendations

### **Cookie Editors:**
1. **Cookie Editor** (Best)
   - Chrome: https://chrome.google.com/webstore
   - Firefox: https://addons.mozilla.org
   - ✓ JSON import/export
   - ✓ Easy UI
   - ✓ Free

2. **EditThisCookie**
   - Chrome only
   - ✓ Visual editor
   - ✓ One-click import

3. **Cookie-Editor**
   - Firefox
   - ✓ Open source
   - ✓ Privacy focused

---

Made with ❤️ for LPU Students

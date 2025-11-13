# 🎓 LPU One-Click Login

**Instantly login to LPU UMS with automatic captcha solving!**

This application automates the LPU UMS login process by automatically solving captchas using the Anti-Captcha API, allowing you to log in with just one click.

## ⚡ NEW: Chrome Extension - Fully Automatic Cookie Import!

**Ab manual cookie import ki zarurat nahi!** We now have a Chrome extension that automatically sets cookies in your browser.

### 🚀 Quick Start with Extension:
1. **Load extension:** `chrome://extensions/` → "Load unpacked" → Select `chrome-extension` folder
2. **Start server:** `npm start`  
3. **Click extension icon** → "Login to UMS" → Wait 10 secs → "Open UMS Dashboard"
4. **Done!** Logged in automatically! 🎉

**Only 3 clicks total!** [See detailed extension guide →](chrome-extension/README.md)

---

## ✨ Features

- 🚀 **One-Click Login** - No manual captcha entry required
- 🤖 **AI-Powered** - Uses Anti-Captcha API for automatic captcha solving
- ⚡ **Fast** - Login in seconds, not minutes
- 🎯 **Multiple Access Methods**:
  - View dashboard directly in the app (iframe)
  - Export session cookies for browser import
  - Open UMS in new window
- 🍪 **Session Management** - Cookies saved and available for export
- 🔒 **Secure** - Your credentials are stored locally in `.env` file
- 💻 **Simple UI** - Clean and intuitive web interface
- 📋 **Cookie Export** - Export cookies in JSON format for browser extensions

## 🛠️ Installation

### Prerequisites
- Node.js 18 or higher
- An Anti-Captcha API key ([Get one here](https://anti-captcha.com))

### Steps

1. **Clone or download this project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```env
   UMS_USERNAME=your_registration_number
   UMS_PASSWORD=your_ums_password
   ANTICAPTCHA_API_KEY=your_anticaptcha_api_key
   PORT=3000
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open in browser**
   
   Navigate to: `http://localhost:3000`

## 🎯 Usage

1. Open the application in your browser
2. Click the **"🚀 Login to UMS"** button
3. Wait while the system:
   - Scrapes the login page
   - Downloads the captcha
   - Solves it using AI
   - Submits your login credentials
4. You'll be redirected to a **success page** with 3 access methods:

### **Access Methods:**

#### **Method 1: View Dashboard (Recommended) 📊**
- Click "Open Dashboard Here"
- Dashboard loads in iframe
- Works immediately without any manual steps

#### **Method 2: Export Cookies 🍪**
- Click "Show Cookies" to view session cookies
- Copy the JSON format cookies
- Install a browser extension like [Cookie Editor](https://cookie-editor.com/)
- Visit [ums.lpu.in](https://ums.lpu.in)
- Import the cookies using the extension
- Refresh - you're logged in!

#### **Method 3: Open in New Window 🌐**
- Opens UMS directly in new browser tab
- May require re-login due to cross-domain restrictions

### Additional Features:
- **Session Persistence**: Your login session is maintained in memory
- **View Anytime**: Access success page at `http://localhost:3000/success.html` after logging in
- **Cookie Format**: Cookies exported in JSON format compatible with browser extensions

For detailed instructions on cookie import, see [SESSION_GUIDE.md](SESSION_GUIDE.md)

## 📁 Project Structure

```
lpu-one-click-login/
├── server/
│   ├── index.js              # Express server
│   └── login-automation.js   # Login automation logic
├── public/
│   └── index.html            # Frontend UI
├── temp/                     # Temporary files (auto-generated)
├── .env                      # Your credentials (DO NOT COMMIT)
├── .env.example              # Environment template
├── package.json              # Dependencies
└── README.md                 # This file
```

## 🔧 API Endpoints

### POST `/api/login`
Performs one-click login to UMS
- **Response**: `{ success: true, redirectUrl: "...", timestamp: "..." }`

### GET `/api/dashboard`
View the authenticated UMS dashboard page
- **Requires**: Active login session
- **Response**: Full HTML of StudentDashboard.aspx
- **Error**: `{ success: false, error: "...", needLogin: true }` if not logged in

### GET `/api/status`
Check current login status
- **Response**: `{ loggedIn: true/false, timestamp: "...", hasRedirectUrl: true/false }`

### GET `/api/health`
Server health check
- **Response**: `{ status: "ok", message: "...", timestamp: "..." }`

### GET `/api/cookies`
Get current session cookies (for debugging)
- **Requires**: Active login session
- **Response**: `{ success: true, cookies: "...", timestamp: "..." }`

### POST `/api/logout`
Clear session data
- **Response**: `{ success: true, message: "Logged out successfully" }`

## 🔐 Security Notes

- **Never commit your `.env` file** - It contains sensitive credentials
- Your credentials are only used locally and not sent anywhere except LPU UMS
- The Anti-Captcha API key is required for captcha solving service
- Session cookies are stored temporarily in memory

## 💡 How It Works

The login automation follows these steps:

1. **Scrape Login Page** - Fetches the UMS login page and extracts form data
2. **Get Captcha Parameters** - Retrieves captcha configuration from server
3. **Download Captcha Image** - Gets the captcha image as base64
4. **Solve Captcha** - Sends image to Anti-Captcha API for solving
5. **Convert Text** - Applies case conversion based on captcha parameters
6. **Submit Form** - Posts login credentials with solved captcha
7. **Extract Cookies** - Saves session cookies for authenticated access
8. **Fetch Dashboard** - Uses the authenticated session to access StudentDashboard.aspx
9. **Display** - Renders the dashboard in your browser

### Dashboard Implementation

After successful login, the application:
- Stores your authenticated session cookies
- Maintains the login bot instance with active session
- Allows you to access the UMS dashboard at `/api/dashboard`
- Proxies the dashboard page through the local server
- Preserves your session for subsequent requests

## 🐛 Troubleshooting

### "Missing credentials" error
- Make sure your `.env` file exists and has all required values

### "Insufficient balance" error
- Check your Anti-Captcha account balance at [anti-captcha.com](https://anti-captcha.com)
- Top up your account (minimum ~$0.001 per captcha)

### Login fails repeatedly
- Verify your UMS credentials are correct
- Check if UMS website is accessible
- Ensure your Anti-Captcha API key is valid

### Server won't start
- Make sure port 3000 is not in use
- Check that Node.js 18+ is installed: `node --version`

## 📋 Requirements

- **Node.js**: 18.0.0 or higher
- **NPM**: Latest version
- **Anti-Captcha Account**: With sufficient balance
- **Internet Connection**: Required for API calls

## 🤝 Credits

Built with code adapted from the [LPU Timetable 3.0](https://github.com/itsrahulanshu/timelpu) project.

Uses the following technologies:
- Express.js - Web server
- Axios - HTTP client
- Cheerio - HTML parsing
- Anti-Captcha - Captcha solving service

## 📄 License

MIT License - Feel free to use and modify

## ⚠️ Disclaimer

This tool is for educational purposes. Use responsibly and in accordance with LPU's terms of service.

---

Made with ❤️ for LPU Students

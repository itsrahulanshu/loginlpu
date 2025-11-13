# 🚀 Quick Deployment Steps

## आपका server अब Vercel पर deploy करने के लिए तैयार है! ✅

### Step 1️⃣: Vercel CLI Install करें
```bash
npm install -g vercel
```

### Step 2️⃣: Vercel में Login करें
```bash
vercel login
```
- Browser में email verification link खुलेगा
- Verify कर लें

### Step 3️⃣: Project Deploy करें
```bash
cd "/Users/rahulanshu/all project/lpu-one-click-login"
vercel
```

**Prompts का जवाब:**
- Set up and deploy? → **Y** (Yes)
- Which scope? → आपका account select करें
- Link to existing project? → **N** (No)
- Project name? → **lpu-one-click-login** (या कोई दूसरा नाम)
- Directory? → **./** (Enter press करें)
- Override settings? → **N** (No)

### Step 4️⃣: Environment Variables Add करें

1. Deployment complete होने के बाद Vercel Dashboard खोलें:
   ```
   https://vercel.com/dashboard
   ```

2. आपका project खोलें → **Settings** → **Environment Variables**

3. ये variables add करें:
   - **Name**: `UMS_USERNAME`, **Value**: `12524002`
   - **Name**: `UMS_PASSWORD`, **Value**: `Ishan@112`
   - **Name**: `ANTICAPTCHA_API_KEY`, **Value**: `df52cae546d09fb39921800bff6fdd92`

4. सभी environments select करें: **Production**, **Preview**, **Development**

### Step 5️⃣: Production में Deploy करें
```bash
vercel --prod
```

### Step 6️⃣: Chrome Extension Update करें

Deployment के बाद आपको एक URL मिलेगा (जैसे: `https://lpu-one-click-login.vercel.app`)

1. `chrome-extension/popup.js` खोलें
2. Line 2 पर `API_BASE_URL` को update करें:
   ```javascript
   const API_BASE_URL = 'https://your-app-url.vercel.app';
   ```
3. Chrome में extension reload करें

---

## 🎯 Deployment Complete होने के बाद

आपकी app इन URLs पर available होगी:

- **Frontend**: `https://your-app.vercel.app`
- **API Health**: `https://your-app.vercel.app/api/health`
- **Login API**: `https://your-app.vercel.app/api/login`

## ⚠️ Important Notes

1. **Session Storage**: Vercel पर in-memory session काम नहीं करेगा (serverless है)
   - हर request के लिए fresh login होगा
   - Future में database add करना होगा

2. **Function Timeout**: Free plan पर 10 seconds का timeout है
   - Login process 10-15 seconds लेता है
   - Pro plan upgrade करना पड़ सकता है

3. **Cold Starts**: पहली request slow हो सकती है

## 🔧 Alternative: Session Storage Fix

अगर session persistent चाहिए तो:
- Vercel KV Redis use करें
- या MongoDB Atlas connect करें

**Need help?** Full guide `DEPLOYMENT.md` में है!

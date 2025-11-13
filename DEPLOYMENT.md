# 🚀 Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally
   ```bash
   npm install -g vercel
   ```

## Deployment Steps

### 1. Login to Vercel
```bash
vercel login
```

### 2. Deploy from Project Directory
```bash
cd "/Users/rahulanshu/all project/lpu-one-click-login"
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → lpu-one-click-login (or custom name)
- **Directory?** → ./
- **Override settings?** → No

### 3. Configure Environment Variables

After deployment, add environment variables in Vercel Dashboard:

1. Go to: https://vercel.com/[your-username]/lpu-one-click-login/settings/environment-variables

2. Add these variables:
   - **UMS_USERNAME**: `12524002`
   - **UMS_PASSWORD**: `Ishan@112`
   - **ANTICAPTCHA_API_KEY**: `df52cae546d09fb39921800bff6fdd92`

3. Redeploy after adding variables:
   ```bash
   vercel --prod
   ```

### 4. Update Chrome Extension

After deployment, update the Chrome extension to use your Vercel URL:

1. Open `chrome-extension/popup.js`
2. Replace `http://localhost:3000` with your Vercel URL (e.g., `https://lpu-one-click-login.vercel.app`)
3. Reload extension in Chrome

## Deployment URLs

After successful deployment, you'll get:

- **Preview URL**: `https://lpu-one-click-login-xxx.vercel.app` (for testing)
- **Production URL**: `https://lpu-one-click-login.vercel.app` (main URL)

## API Endpoints

Once deployed, your API will be available at:

- `https://your-app.vercel.app/api/health` - Health check
- `https://your-app.vercel.app/api/login` - Login endpoint
- `https://your-app.vercel.app/api/status` - Session status
- `https://your-app.vercel.app/api/cookies` - Get cookies
- `https://your-app.vercel.app/api/dashboard` - View dashboard

## Important Notes

### ⚠️ Limitations on Vercel

1. **Serverless Functions**: Each function has a 10-second timeout on free plan
2. **Session Storage**: In-memory session won't persist (consider using database)
3. **Cold Starts**: First request may take longer

### 🔧 Recommended Improvements for Production

1. **Database**: Use Vercel KV or MongoDB for session storage
2. **Authentication**: Add JWT tokens for secure sessions
3. **Rate Limiting**: Prevent API abuse
4. **Error Logging**: Use Vercel Analytics or Sentry

## Quick Deploy Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List all deployments
vercel ls
```

## Testing Deployment

1. **Test Health Endpoint**:
   ```bash
   curl https://your-app.vercel.app/api/health
   ```

2. **Test Login** (using Postman or curl):
   ```bash
   curl -X POST https://your-app.vercel.app/api/login
   ```

3. **Open Frontend**:
   ```
   https://your-app.vercel.app
   ```

## Troubleshooting

### Build Fails
- Check `vercel.json` configuration
- Verify all dependencies in `package.json`
- Check Node version compatibility

### Environment Variables Not Working
- Redeploy after adding variables: `vercel --prod`
- Check variable names match exactly
- Ensure no trailing spaces in values

### 404 Errors
- Verify `vercel.json` routes configuration
- Check file paths are correct
- Ensure public files are in `/public` directory

### Function Timeout
- Login process may take 10-15 seconds
- Consider upgrading Vercel plan for longer timeout
- Or split into multiple API calls

## Custom Domain (Optional)

1. Go to: Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update Chrome extension URL

## Continuous Deployment

Link to GitHub for automatic deployments:

1. Push code to GitHub
2. Import project in Vercel from GitHub
3. Auto-deploy on every push to `main` branch

---

**Need Help?** Check [Vercel Documentation](https://vercel.com/docs)

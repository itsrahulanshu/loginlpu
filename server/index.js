const express = require('express');
const path = require('path');
const LPULoginAutomation = require('./login-automation');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Store session data (in-memory for demo, use database in production)
let sessionData = {
    loggedIn: false,
    cookies: null,
    timestamp: null,
    redirectUrl: null,
    loginBot: null // Store the bot instance with session
};

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'LPU One-Click Login API is running',
        timestamp: new Date().toISOString()
    });
});

/**
 * Get current session status
 */
app.get('/api/status', (req, res) => {
    res.json({
        loggedIn: sessionData.loggedIn,
        timestamp: sessionData.timestamp,
        hasRedirectUrl: !!sessionData.redirectUrl
    });
});

/**
 * One-click login endpoint
 */
app.post('/api/login', async (req, res) => {
    try {
        console.log('\n🚀 Starting one-click login...');
        
        // Validate environment variables
        const username = process.env.UMS_USERNAME;
        const password = process.env.UMS_PASSWORD;
        const antiCaptchaKey = process.env.ANTICAPTCHA_API_KEY;
        
        if (!username || !password || !antiCaptchaKey) {
            return res.status(500).json({
                success: false,
                error: 'Missing credentials. Please configure .env file',
                details: {
                    hasUsername: !!username,
                    hasPassword: !!password,
                    hasApiKey: !!antiCaptchaKey
                }
            });
        }
        
        // Initialize login automation
        const loginBot = new LPULoginAutomation(username, password, antiCaptchaKey);
        
        // Perform login
        const result = await loginBot.login();
        
        // Store session data
        sessionData = {
            loggedIn: true,
            cookies: result.cookies,
            timestamp: new Date().toISOString(),
            redirectUrl: result.redirectUrl || 'https://ums.lpu.in/lpuums/StudentDashboard.aspx',
            loginBot: loginBot // Store bot instance with session
        };
        
        console.log('✅ Login successful, session stored');
        
        res.json({
            success: true,
            message: 'Login successful! Redirecting to UMS Dashboard...',
            redirectUrl: sessionData.redirectUrl,
            timestamp: sessionData.timestamp
        });
        
    } catch (error) {
        console.error('❌ Login failed:', error.message);
        
        res.status(500).json({
            success: false,
            error: error.message,
            details: 'Please check your credentials and Anti-Captcha balance'
        });
    }
});

/**
 * Get session cookies (for testing)
 */
app.get('/api/cookies', (req, res) => {
    if (!sessionData.loggedIn) {
        return res.status(404).json({
            success: false,
            error: 'Not logged in. Please login first.'
        });
    }
    
    // Parse cookies into JSON format for cookie editor extensions
    const cookieArray = sessionData.cookies.split('; ');
    const cookieJson = cookieArray.map(cookie => {
        const [name, value] = cookie.split('=');
        
        // Determine domain based on cookie name
        let domain = '.lpu.in';
        let hostOnly = false;
        let httpOnly = false;
        let sameSite = null;
        
        if (name === '_ga_B0Z6G6GCD8') {
            domain = 'ums.lpu.in';
            hostOnly = true;
            httpOnly = true;
            sameSite = 'strict';
        }
        
        return {
            name: name,
            value: value,
            domain: domain,
            hostOnly: hostOnly,
            path: '/',
            secure: false,
            httpOnly: httpOnly,
            sameSite: sameSite,
            session: true,
            firstPartyDomain: '',
            partitionKey: null,
            storeId: null
        };
    });
    
    res.json({
        success: true,
        cookies: sessionData.cookies,
        cookieJson: cookieJson,
        timestamp: sessionData.timestamp
    });
});

/**
 * Get dashboard page (authenticated)
 */
app.get('/api/dashboard', async (req, res) => {
    try {
        if (!sessionData.loggedIn || !sessionData.loginBot) {
            return res.status(401).json({
                success: false,
                error: 'Not logged in. Please login first.',
                needLogin: true
            });
        }

        console.log('\n📊 Fetching dashboard...');
        
        // Fetch dashboard using the authenticated session
        const dashboardResult = await sessionData.loginBot.getDashboard();
        
        if (dashboardResult.success) {
            // Send the HTML directly
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.send(dashboardResult.html);
        } else {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch dashboard'
            });
        }
        
    } catch (error) {
        console.error('❌ Dashboard fetch failed:', error.message);
        
        res.status(500).json({
            success: false,
            error: error.message,
            needLogin: true
        });
    }
});

/**
 * Redirect to UMS with session cookies
 */
app.get('/api/ums-redirect', async (req, res) => {
    try {
        if (!sessionData.loggedIn || !sessionData.cookies) {
            return res.redirect('/?error=not_logged_in');
        }

        console.log('\n🔄 Redirecting to UMS with session...');
        
        // Parse cookies and set them in response
        const cookieArray = sessionData.cookies.split('; ');
        
        // Set each cookie in the response
        cookieArray.forEach(cookie => {
            const [name, value] = cookie.split('=');
            if (name && value) {
                // Set cookie with appropriate domain
                res.cookie(name, value, {
                    domain: '.lpu.in',
                    path: '/',
                    httpOnly: false,
                    secure: false,
                    sameSite: 'lax'
                });
            }
        });
        
        // Redirect to UMS Dashboard
        res.redirect('https://ums.lpu.in/lpuums/StudentDashboard.aspx');
        
    } catch (error) {
        console.error('❌ Redirect failed:', error.message);
        res.status(500).send('Redirect failed. Please try logging in again.');
    }
});

/**
 * Logout endpoint
 */
app.post('/api/logout', (req, res) => {
    sessionData = {
        loggedIn: false,
        cookies: null,
        timestamp: null,
        redirectUrl: null,
        loginBot: null
    };
    
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 LPU One-Click Login Server`);
    console.log(`📍 Server running on http://localhost:${PORT}`);
    console.log(`📝 API Endpoints:`);
    console.log(`   • POST /api/login      - One-click login`);
    console.log(`   • GET  /api/dashboard  - View UMS dashboard`);
    console.log(`   • GET  /api/status     - Check login status`);
    console.log(`   • GET  /api/cookies    - Get session cookies`);
    console.log(`   • POST /api/logout     - Logout`);
    console.log(`\n✅ Ready to accept requests\n`);
});

module.exports = app;

const API_BASE = 'http://localhost:3000';

// Elements
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const loginBtn = document.getElementById('loginBtn');
const openUmsBtn = document.getElementById('openUmsBtn');
const messageDiv = document.getElementById('message');

// Show message
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
}

// Update status
function updateStatus(text, isOnline) {
    statusText.textContent = text;
    statusDot.className = `status-dot ${isOnline ? 'online' : 'offline'}`;
}

// Check server status
async function checkServer() {
    try {
        const response = await fetch(`${API_BASE}/api/health`);
        const data = await response.json();
        
        if (data.status === 'ok') {
            updateStatus('Server Online', true);
            
            // Check if already logged in
            const statusResponse = await fetch(`${API_BASE}/api/status`);
            const statusData = await statusResponse.json();
            
            if (statusData.loggedIn) {
                showMessage('✅ Already logged in! Click "Open UMS Dashboard"', 'success');
                openUmsBtn.style.display = 'block';
            }
            
            return true;
        }
    } catch (error) {
        updateStatus('Server Offline', false);
        showMessage('⚠️ Server not running. Please start the server.', 'error');
        loginBtn.disabled = true;
        return false;
    }
}

// Set cookies in browser
async function setCookies(cookieJson) {
    try {
        // Remove all existing ums.lpu.in cookies first
        const existingCookies = await chrome.cookies.getAll({ domain: '.lpu.in' });
        for (const cookie of existingCookies) {
            await chrome.cookies.remove({
                url: `https://${cookie.domain.replace(/^\./, '')}${cookie.path}`,
                name: cookie.name
            });
        }
        
        // Set new cookies
        for (const cookie of cookieJson) {
            const cookieDetails = {
                url: `https://${cookie.domain.replace(/^\./, '')}${cookie.path}`,
                name: cookie.name,
                value: cookie.value,
                domain: cookie.domain,
                path: cookie.path,
                secure: cookie.secure || false,
                httpOnly: cookie.httpOnly || false,
                sameSite: cookie.sameSite || 'no_restriction'
            };
            
            // Add expiration if not a session cookie
            if (!cookie.session && cookie.expirationDate) {
                cookieDetails.expirationDate = cookie.expirationDate;
            }
            
            try {
                await chrome.cookies.set(cookieDetails);
            } catch (err) {
                console.error('Error setting cookie:', cookie.name, err);
            }
        }
        
        return true;
    } catch (error) {
        console.error('Error setting cookies:', error);
        return false;
    }
}

// Perform login
async function performLogin() {
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<span class="spinner"></span> Logging in...';
    showMessage('🤖 AI solving captcha... Please wait...', 'info');
    
    try {
        const response = await fetch(`${API_BASE}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('✅ Login successful! Getting cookies...', 'success');
            
            // Get cookies from backend
            const cookiesResponse = await fetch(`${API_BASE}/api/cookies`);
            const cookiesData = await cookiesResponse.json();
            
            if (cookiesData.success && cookiesData.cookieJson) {
                showMessage('🍪 Setting cookies in browser...', 'info');
                
                // Set cookies in browser
                const cookiesSet = await setCookies(cookiesData.cookieJson);
                
                if (cookiesSet) {
                    showMessage('✅ Cookies imported! Click "Open UMS Dashboard"', 'success');
                    openUmsBtn.style.display = 'block';
                    loginBtn.innerHTML = '✓ Logged In';
                    
                    // Store login state
                    chrome.storage.local.set({ loggedIn: true });
                } else {
                    showMessage('⚠️ Error setting cookies. Try manual import.', 'error');
                    loginBtn.disabled = false;
                    loginBtn.innerHTML = '🚀 Login to UMS';
                }
            } else {
                showMessage('❌ Error getting cookies from server', 'error');
                loginBtn.disabled = false;
                loginBtn.innerHTML = '🚀 Login to UMS';
            }
        } else {
            showMessage(`❌ ${data.error || 'Login failed'}`, 'error');
            loginBtn.disabled = false;
            loginBtn.innerHTML = '🚀 Login to UMS';
        }
    } catch (error) {
        showMessage(`❌ Error: ${error.message}`, 'error');
        loginBtn.disabled = false;
        loginBtn.innerHTML = '🚀 Login to UMS';
    }
}

// Open UMS Dashboard
function openUMS() {
    chrome.tabs.create({ url: 'https://ums.lpu.in/lpuums/StudentDashboard.aspx' });
    window.close();
}

// Event listeners
loginBtn.addEventListener('click', performLogin);
openUmsBtn.addEventListener('click', openUMS);

// Check server on load
checkServer();

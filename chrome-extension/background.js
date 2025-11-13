// Background service worker for LPU Auto Login extension

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('LPU Auto Login extension installed');
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkServer') {
        fetch('http://localhost:3000/api/health')
            .then(response => response.json())
            .then(data => sendResponse({ success: true, data }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Will respond asynchronously
    }
    
    if (request.action === 'setCookies') {
        setCookiesFromData(request.cookies)
            .then(result => sendResponse({ success: true }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
});

// Function to set cookies
async function setCookiesFromData(cookieJson) {
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
        
        if (!cookie.session && cookie.expirationDate) {
            cookieDetails.expirationDate = cookie.expirationDate;
        }
        
        try {
            await chrome.cookies.set(cookieDetails);
        } catch (err) {
            console.error('Error setting cookie:', cookie.name, err);
        }
    }
}

// Keep service worker alive
chrome.alarms.create('keepAlive', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'keepAlive') {
        // Just to keep service worker alive
    }
});

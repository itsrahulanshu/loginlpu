const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const crypto = require('crypto');
const ac = require('@antiadmin/anticaptchaofficial');

/**
 * LPU UMS One-Click Login Automation
 * Automatically solves captcha and logs into UMS
 */
class LPULoginAutomation {
    constructor(username, password, antiCaptchaKey) {
        this.username = username;
        this.password = password;
        this.antiCaptchaKey = antiCaptchaKey;
        
        this.httpsAgent = new https.Agent({
            rejectUnauthorized: false
        });
        
        this.cookies = '';
        this.sessionCookies = '';
        this.scrapedData = null;
        
        // Initialize Anti-Captcha
        ac.setAPIKey(this.antiCaptchaKey);
        
        // URLs
        this.urls = {
            loginPage: 'https://ums.lpu.in/lpuums/LoginNew.aspx',
            captchaParams: 'https://ums.lpu.in/LpuUms/BotDetectCaptcha.ashx?get=p&c=c_loginnew_examplecaptcha',
            captchaImage: 'https://ums.lpu.in/LpuUms/BotDetectCaptcha.ashx?get=image&c=c_loginnew_examplecaptcha',
            dashboard: 'https://ums.lpu.in/lpuums/StudentDashboard.aspx'
        };
    }

    // Step 1: Scrape login page data
    async scrapeLoginPageData() {
        console.log('📥 Scraping login page...');
        
        const response = await axios.get(this.urls.loginPage, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
            httpsAgent: this.httpsAgent,
            timeout: 15000
        });

        // Extract cookies
        const setCookieHeader = response.headers['set-cookie'];
        if (setCookieHeader) {
            const cookieString = Array.isArray(setCookieHeader) ? setCookieHeader.join('; ') : setCookieHeader;
            const gaMatch = cookieString.match(/_ga_B0Z6G6GCD8=([^;]+)/);
            if (gaMatch) {
                this.cookies = `_ga_B0Z6G6GCD8=${gaMatch[1]}`;
            }
        }

        // Parse HTML and extract form values
        const $ = cheerio.load(response.data);
        
        this.scrapedData = {
            BDC_VCID_c_loginnew_examplecaptcha: $('#BDC_VCID_c_loginnew_examplecaptcha').val(),
            BDC_BackWorkaround_c_loginnew_examplecaptcha: $('#BDC_BackWorkaround_c_loginnew_examplecaptcha').val(),
            BDC_Hs_c_loginnew_examplecaptcha: $('#BDC_Hs_c_loginnew_examplecaptcha').val(),
            BDC_SP_c_loginnew_examplecaptcha: $('#BDC_SP_c_loginnew_examplecaptcha').val(),
            __VIEWSTATEGENERATOR: $('#__VIEWSTATEGENERATOR').val(),
            __SCROLLPOSITIONX: $('#__SCROLLPOSITIONX').val() || '0',
            __SCROLLPOSITIONY: $('#__SCROLLPOSITIONY').val() || '0',
            __EVENTVALIDATION: $('#__EVENTVALIDATION').val(),
            __VIEWSTATE: $('#__VIEWSTATE').val()
        };

        console.log('✅ Page data scraped');
    }

    // Step 2: Get captcha parameters
    async getCaptchaParameters() {
        console.log('🎯 Getting captcha parameters...');
        
        const currentTime = Date.now();
        const vcid = this.scrapedData.BDC_VCID_c_loginnew_examplecaptcha;
        
        const response = await axios.get(`${this.urls.captchaParams}&t=${vcid}&d=${currentTime}`, {
            headers: {
                'Cookie': this.cookies,
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            },
            httpsAgent: this.httpsAgent,
            timeout: 15000
        });

        const captchaParams = response.data;
        console.log('✅ Parameters received');
        
        return {
            sp: captchaParams.sp,
            hs: captchaParams.hs,
            vcid: vcid,
            timestamp: currentTime
        };
    }

    // Step 3: Get captcha image
    async getCaptchaImage(captchaParams) {
        console.log('🖼️ Downloading captcha...');
        
        const response = await axios.get(`${this.urls.captchaImage}&t=${captchaParams.vcid}&d=${captchaParams.timestamp}`, {
            headers: {
                'Cookie': this.cookies,
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            },
            httpsAgent: this.httpsAgent,
            responseType: 'arraybuffer',
            timeout: 15000
        });

        const base64Image = Buffer.from(response.data).toString('base64');
        console.log('✅ Captcha downloaded');
        return base64Image;
    }

    // Step 4: Solve captcha using Anti-Captcha
    async solveCaptcha(base64Image) {
        console.log('🤖 Solving captcha with Anti-Captcha...');
        
        const balance = await ac.getBalance();
        
        if (balance < 0.001) {
            throw new Error(`Insufficient balance: $${balance}. Minimum required: $0.001`);
        }

        const captchaResult = await ac.solveImage(base64Image, true);
        console.log(`✅ Captcha solved: ${captchaResult}`);
        
        return captchaResult;
    }

    // Step 5: Convert captcha text
    convertCaptchaText(text, sp, hs, vcid) {
        console.log('🔄 Converting captcha...');
        
        let currentPos = parseInt(sp);
        const targetHash = hs;
        
        while (true) {
            const testString = currentPos.toString() + vcid;
            const hash = crypto.createHash('sha1').update(testString).digest('hex');
            
            if (hash === targetHash) {
                break;
            }
            currentPos++;
        }
        
        const caseModifier = currentPos % 65533 + 1;
        const binaryPattern = (caseModifier >>> 0).toString(2);
        
        const binaryArray = binaryPattern.split("");
        const binaryLength = binaryArray.length;
        const textArray = text.split("");
        let result = "";
        
        for (let i = text.length - 1; i >= 0; i--) {
            const binaryIndex = binaryLength - (text.length - i);
            const binaryDigit = binaryArray[binaryIndex];
            
            if (binaryDigit !== undefined && binaryDigit === "1") {
                result = textArray[i].toUpperCase() + result;
            } else {
                result = textArray[i].toLowerCase() + result;
            }
        }
        
        console.log(`✅ Converted: ${text} → ${result}`);
        return result;
    }

    // Step 6: Submit login form
    async submitLoginForm(convertedCaptcha) {
        console.log('📤 Submitting login...');
        
        const formData = new URLSearchParams();
        formData.append('__LASTFOCUS', '');
        formData.append('__EVENTTARGET', '');
        formData.append('__EVENTARGUMENT', '');
        formData.append('__VIEWSTATE', this.scrapedData.__VIEWSTATE);
        formData.append('__VIEWSTATEGENERATOR', this.scrapedData.__VIEWSTATEGENERATOR);
        formData.append('__SCROLLPOSITIONX', this.scrapedData.__SCROLLPOSITIONX);
        formData.append('__SCROLLPOSITIONY', this.scrapedData.__SCROLLPOSITIONY);
        formData.append('__EVENTVALIDATION', this.scrapedData.__EVENTVALIDATION);
        formData.append('DropDownList1', '1');
        formData.append('txtU', this.username);
        formData.append('TxtpwdAutoId_8767', this.password);
        formData.append('CaptchaCodeTextBox', convertedCaptcha);
        formData.append('BDC_VCID_c_loginnew_examplecaptcha', this.scrapedData.BDC_VCID_c_loginnew_examplecaptcha);
        formData.append('BDC_BackWorkaround_c_loginnew_examplecaptcha', this.scrapedData.BDC_BackWorkaround_c_loginnew_examplecaptcha || '1');
        formData.append('BDC_Hs_c_loginnew_examplecaptcha', this.scrapedData.BDC_Hs_c_loginnew_examplecaptcha);
        formData.append('BDC_SP_c_loginnew_examplecaptcha', this.scrapedData.BDC_SP_c_loginnew_examplecaptcha);
        formData.append('iBtnLogins150203125', 'Login');

        try {
            const response = await axios.post(this.urls.loginPage, formData.toString(), {
                headers: {
                    'Cookie': this.cookies,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                    'Origin': 'https://ums.lpu.in',
                    'Referer': 'https://ums.lpu.in/lpuums/LoginNew.aspx',
                },
                httpsAgent: this.httpsAgent,
                timeout: 15000,
                maxRedirects: 0,
                validateStatus: function (status) {
                    return status < 400;
                }
            });

            // Extract session cookies
            this.extractSessionCookies(response);

            if (response.status === 302 || response.headers.location) {
                console.log('🎉 Login successful!');
                return {
                    success: true,
                    redirectUrl: response.headers.location,
                    cookies: this.sessionCookies
                };
            } else {
                console.log('✅ Login successful');
                return {
                    success: true,
                    cookies: this.sessionCookies
                };
            }
        } catch (error) {
            if (error.response && error.response.status === 302) {
                this.extractSessionCookies(error.response);
                console.log('🎉 Login successful!');
                return {
                    success: true,
                    redirectUrl: error.response.headers.location,
                    cookies: this.sessionCookies
                };
            } else {
                throw error;
            }
        }
    }

    // Fetch dashboard page with authenticated session
    async getDashboard() {
        console.log('📊 Fetching dashboard...');
        
        try {
            const response = await axios.get(this.urls.dashboard, {
                headers: {
                    'Cookie': this.sessionCookies,
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Referer': 'https://ums.lpu.in/lpuums/',
                },
                httpsAgent: this.httpsAgent,
                timeout: 15000
            });

            console.log('✅ Dashboard fetched successfully');
            return {
                success: true,
                html: response.data,
                cookies: this.sessionCookies
            };
        } catch (error) {
            console.error('❌ Error fetching dashboard:', error.message);
            throw error;
        }
    }

    // Extract session cookies
    extractSessionCookies(response) {
        const setCookieHeader = response.headers['set-cookie'];
        let allCookies = [];
        
        if (setCookieHeader && Array.isArray(setCookieHeader)) {
            setCookieHeader.forEach(cookieString => {
                const cookiePart = cookieString.split(';')[0];
                if (cookiePart && cookiePart.includes('=')) {
                    allCookies.push(cookiePart);
                }
            });
        }
        
        const existingCookies = this.cookies.split('; ').filter(c => c.length > 0);
        const combinedCookies = [...existingCookies];
        
        allCookies.forEach(newCookie => {
            const cookieName = newCookie.split('=')[0];
            const filteredCookies = combinedCookies.filter(c => !c.startsWith(cookieName + '='));
            combinedCookies.splice(0, combinedCookies.length, ...filteredCookies, newCookie);
        });
        
        this.sessionCookies = combinedCookies.join('; ');
    }

    // Main automation method
    async login() {
        console.log('🚀 Starting LPU One-Click Login\n');
        
        try {
            await this.scrapeLoginPageData();
            const captchaParams = await this.getCaptchaParameters();
            const base64Image = await this.getCaptchaImage(captchaParams);
            const solvedCaptcha = await this.solveCaptcha(base64Image);
            const convertedCaptcha = this.convertCaptchaText(
                solvedCaptcha, 
                captchaParams.sp, 
                captchaParams.hs, 
                captchaParams.vcid
            );
            const result = await this.submitLoginForm(convertedCaptcha);
            
            console.log('\n✅ LOGIN SUCCESSFUL');
            return result;
            
        } catch (error) {
            console.error('\n💥 LOGIN FAILED:', error.message);
            throw error;
        }
    }
}

module.exports = LPULoginAutomation;

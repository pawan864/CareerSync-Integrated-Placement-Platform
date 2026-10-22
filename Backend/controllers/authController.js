/**
 * CareerSync Capstone Project
 * 
 * @module Backend/AuthController
 * @description Handles user authentication, registration, login, and password management.
 */
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const axios = require('axios');

// Helper to verify Cloudflare Turnstile with development resilience
const verifyTurnstile = async (turnstileToken) => {
    if (!turnstileToken) return false;
    const isTestToken = turnstileToken.startsWith('1x') || process.env.NODE_ENV === 'development';
    const secret = process.env.TURNSTILE_SECRET_KEY || 
        (isTestToken ? '1x0000000000000000000000000000000AA' : '0x4AAAAAAFRwCTSCRIo9uqjIKmFn8DGR7LU');

    try {
        const formData = new URLSearchParams();
        formData.append('secret', secret);
        formData.append('response', turnstileToken);

        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: formData
        });
        const outcome = await response.json();
        if (outcome.success) return true;

        if (process.env.NODE_ENV === 'development') {
            return true;
        }
        return false;
    } catch (err) {
        return process.env.NODE_ENV === 'development';
    }
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        
        const { 
            name, email, password, role,
            studentId, college, course, branch, semester, phone,
            facultyId, department, designation, expertise,
            companyName, corporateEmail, website, industryType, companySize, location, registrationInfo,
            tpoId, institutionCode,
            turnstileToken
        } = req.body;

        // Turnstile Verification
        if (!turnstileToken && process.env.NODE_ENV !== 'development') {
            return res.status(400).json({ success: false, error: 'Turnstile token missing. Please complete the security check.' });
        }

        if (turnstileToken) {
            const isTurnstileValid = await verifyTurnstile(turnstileToken);
            if (!isTurnstileValid) {
                return res.status(400).json({ success: false, error: 'Security check failed. Please try again.' });
            }
        }

        // Check for existing email or phone
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ success: false, error: 'Email is already registered' });
        }

        if (phone && phone.trim() !== '') {
            const existingPhone = await User.findOne({ phone });
            if (existingPhone) {
                return res.status(400).json({ success: false, error: 'Phone number is already registered' });
            }
        }

        // Create user
        const user = await User.create({
            name, email, password, role,
            studentId, college, course, branch, semester, phone,
            facultyId, department, designation, expertise,
            companyName, corporateEmail, website, industryType, companySize, location, registrationInfo,
            tpoId, institutionCode
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        let { email, password, institutionCode, portal, turnstileToken } = req.body;
        if (email) email = email.trim().toLowerCase();
        if (institutionCode) institutionCode = institutionCode.trim();

        // Turnstile Verification
        if (!turnstileToken && portal !== 'Admin' && process.env.NODE_ENV !== 'development') {
            return res.status(400).json({ success: false, error: 'Turnstile token missing. Please complete the security check.' });
        }

        if (turnstileToken) {
            const isTurnstileValid = await verifyTurnstile(turnstileToken);
            if (!isTurnstileValid) {
                return res.status(400).json({ success: false, error: 'Security check failed. Please try again.' });
            }
        }


        // ---------------------------------------------------

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide an email and password' });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        
        // Validate strict role access per portal
        const roleMap = {
            'Student': 'student',
            'Faculty': 'faculty',
            'TPO': 'tpo',
            'Recruiter': 'recruiter',
            'Admin': 'admin'
        };
        
        if (portal && roleMap[portal]) {
            if (user.role !== roleMap[portal]) {
                return res.status(401).json({ success: false, error: `Access Denied: You are registered as a ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}. Please switch to the ${user.role.charAt(0).toUpperCase() + user.role.slice(1)} tab to login.` });
            }
        }
        if (portal === 'TPO' && institutionCode && user.institutionCode !== institutionCode) {
            return res.status(401).json({ success: false, error: 'Invalid Institution Code' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Hash it and save to user
        const crypto = require('crypto');
        user.loginOtp = crypto.createHash('sha256').update(otp).digest('hex');
        user.loginOtpExpire = Date.now() + 1 * 60 * 1000; // 1 minute
        
        await user.save({ validateBeforeSave: false });

        console.log(`

========================================`);
        console.log(`🚀 [MOCK EMAIL] OTP for ${user.email} is: ${otp}`);
        console.log(`========================================

`);

        res.status(200).json({ 
            success: true, 
            message: 'Please check your mail. OTP sent.', 
            userId: user._id,
            otp: otp // DEV ONLY: send OTP in response for popup
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Verify OTP and login
// @route   POST /api/v1/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res, next) => {
    try {
        const { userId, otp } = req.body;
        
        if (!userId || !otp) {
            return res.status(400).json({ success: false, error: 'Please provide user ID and OTP' });
        }

        const crypto = require('crypto');
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        const user = await User.findOne({
            _id: userId,
            loginOtp: hashedOtp,
            loginOtpExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }

        // Clear OTP and record login
        user.loginOtp = undefined;
        user.loginOtpExpire = undefined;
        user.lastLogin = Date.now();
        await user.save({ validateBeforeSave: false });

        // Record Audit Log
        await AuditLog.create({
            user: user._id,
            email: user.email,
            role: user.role,
            action: 'LOGIN',
            localTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        });

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
    try {
        if (req.user) {
            await AuditLog.create({
                user: req.user.id,
                email: req.user.email,
                role: req.user.role,
                action: 'LOGOUT',
                localTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
            });
        }

        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
        });

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        next(err);
    }
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
};

const crypto = require('crypto');

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            // Send success anyway to prevent email enumeration
            return res.status(200).json({ success: true, message: 'Password reset link sent to your email.' });
        }

        // Generate token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and set to resetPasswordToken field
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set expire
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        // Normally we would send email here using nodemailer
        // For now, we simulate the email and return success
        console.log(`Reset token generated for ${user.email}: ${resetToken}`);
        console.log(`Reset URL: http://localhost:5173/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: 'Password reset link sent to your email.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
};

/**
 * @desc    Google Authentication
 * @route   POST /api/auth/google
 * @access  Public
 */
exports.googleAuth = async (req, res, next) => {
    try {
        const { credential, role, isRegister } = req.body;
        if (!credential) {
            return res.status(400).json({ success: false, error: 'No Google credential provided' });
        }

        // Fetch user details from Google
        const googleRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${credential}` }
        });
        
        const payload = googleRes.data;
        const email = payload.email;
        const name = payload.name;
        const googleId = payload.sub;

                let user = await User.findOne({ email });

        if (user) {
            // Check if the requested portal role matches the user's actual registered role
            if (role && user.role !== role) {
                if (isRegister) {
                    return res.status(403).json({ 
                        success: false, 
                        error: `Account Exists: This email is already registered as a ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}. To create a ${role.charAt(0).toUpperCase() + role.slice(1)} account, please register with a different Google account.` 
                    });
                } else {
                    return res.status(403).json({ 
                        success: false, 
                        error: `Access Denied: You are registered as a ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}. Please switch to the ${user.role.charAt(0).toUpperCase() + user.role.slice(1)} tab to login.` 
                    });
                }
            }
        } else {
            if (isRegister) {
                const crypto = require('crypto');
                user = await User.create({
                    name,
                    email,
                    password: crypto.randomBytes(20).toString('hex'),
                    role: role || 'student',
                    isEmailVerified: true
                });
            } else {
                return res.status(404).json({
                    success: false,
                    error: `Account Not Found: You are not registered with this Google account. Please go to the Registration page to create a new account first.`
                });
            }
        }

        
        // Record Audit Log
        await AuditLog.create({
            user: user._id,
            email: user.email,
            role: user.role,
            action: 'LOGIN',
            localTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        });
sendTokenResponse(user, 200, res);

    } catch (error) {
        console.error('Google Auth Error:', error.message);
        res.status(500).json({ success: false, error: 'Google Auth Error: ' + (error.response ? JSON.stringify(error.response.data) : error.message) + ' (Stack: ' + error.stack + ')' });
    }
};


/**
 * @desc    Microsoft Authentication
 * @route   POST /api/auth/microsoft
 * @access  Public
 */
exports.microsoftAuth = async (req, res, next) => {
    try {
        const { accessToken, role, isRegister } = req.body;
        if (!accessToken) {
            return res.status(400).json({ success: false, error: 'No Microsoft access token provided' });
        }

        // Fetch user details from Microsoft Graph
        const msRes = await axios.get('https://graph.microsoft.com/v1.0/me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        const payload = msRes.data;
        const email = payload.mail || payload.userPrincipalName;
        const name = payload.displayName;

        if (!email) {
            return res.status(400).json({ success: false, error: 'Could not fetch email from Microsoft account' });
        }

                let user = await User.findOne({ email });

        if (user) {
            // Check if the requested portal role matches the user's actual registered role
            if (role && user.role !== role) {
                if (isRegister) {
                    return res.status(403).json({ 
                        success: false, 
                        error: `Account Exists: This email is already registered as a ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}. To create a ${role.charAt(0).toUpperCase() + role.slice(1)} account, please register with a different GitHub account.` 
                    });
                } else {
                    return res.status(403).json({ 
                        success: false, 
                        error: `Access Denied: You are registered as a ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}. Please switch to the ${user.role.charAt(0).toUpperCase() + user.role.slice(1)} tab to login.` 
                    });
                }
            }
        } else {
            const crypto = require('crypto');
                user = await User.create({
                    name,
                    email,
                    password: crypto.randomBytes(20).toString('hex'),
                    role: role || 'student',
                    isEmailVerified: true
                });
        }

        sendTokenResponse(user, 200, res);

    } catch (error) {
        console.error('Microsoft Auth Error:', error.response?.data || error.message);
        res.status(500).json({ success: false, error: 'Microsoft authentication failed' });
    }
};


/**
 * @desc    GitHub Authentication
 * @route   POST /api/auth/github
 * @access  Public
 */
exports.githubAuth = async (req, res, next) => {
    try {
        const { code, role, isRegister } = req.body;
        if (!code) {
            return res.status(400).json({ success: false, error: 'No GitHub code provided' });
        }

        // 1. Exchange code for access token
        const tokenRes = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code
        }, {
            headers: { Accept: 'application/json' }
        });

        const accessToken = tokenRes.data.access_token;
        if (!accessToken) {
            return res.status(400).json({ success: false, error: 'Failed to retrieve access token from GitHub' });
        }

        // 2. Fetch user profile
        const userRes = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        // 3. Fetch user emails (GitHub sometimes hides primary email in profile)
        const emailRes = await axios.get('https://api.github.com/user/emails', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const primaryEmailObj = emailRes.data.find(e => e.primary) || emailRes.data[0];
        if (!primaryEmailObj) {
            return res.status(400).json({ success: false, error: 'No email found in GitHub account' });
        }

        const email = primaryEmailObj.email;
        const name = userRes.data.name || userRes.data.login;

                let user = await User.findOne({ email });

        if (user) {
            // Check if the requested portal role matches the user's actual registered role
            if (role && user.role !== role) {
                return res.status(403).json({ 
                    success: false, 
                    error: `Access Denied: You are registered as a ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}. Please switch to the ${user.role.charAt(0).toUpperCase() + user.role.slice(1)} tab to login.` 
                });
            }
        } else {
            const crypto = require('crypto');
                user = await User.create({
                    name,
                    email,
                    password: crypto.randomBytes(20).toString('hex'),
                    role: role || 'student',
                    isEmailVerified: true
                });
        }

        
        // Record Audit Log
        await AuditLog.create({
            user: user._id,
            email: user.email,
            role: user.role,
            action: 'LOGIN',
            localTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        });
sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error('GitHub Auth Error:', error.response?.data || error.message);
        res.status(500).json({ success: false, error: 'GitHub Auth Error: ' + (error.response ? JSON.stringify(error.response.data) : error.message) + ' (Stack: ' + error.stack + ')' });
    }
};

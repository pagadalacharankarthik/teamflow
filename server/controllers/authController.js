const User = require('../models/User');
const Company = require('../models/Company');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res, next) => {
    try {
        const { name, email, password, role, companyName, companyCode } = req.body;

        let companyId;

        if (role === 'admin') {
            if (!companyName) {
                return res.status(400).json({ success: false, message: 'Please add a company name' });
            }
            
            // Generate a unique company code
            const code = 'COMP-' + Math.floor(100000 + Math.random() * 900000);
            
            const company = await Company.create({
                name: companyName,
                code
            });
            companyId = company._id;
        } else {
            if (!companyCode) {
                return res.status(400).json({ success: false, message: 'Please provide a company invite code' });
            }
            const company = await Company.findOne({ code: companyCode.toUpperCase() });
            if (!company) {
                return res.status(400).json({ success: false, message: 'Invalid company invite code' });
            }
            companyId = company._id;
        }

        // Create user
        let user = await User.create({
            name,
            email,
            password,
            role,
            company: companyId
        });

        user = await User.findById(user._id).populate('company');

        sendTokenResponse(user, 201, res);
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Admin creates user
// @route   POST /api/auth/create
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
    try {
        const { name, email, role, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password: password || 'welcome123',
            role: role || 'member',
            company: req.user.company._id || req.user.company // inherited from logged-in admin
        });

        res.status(201).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password').populate('company');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            company: user.company
        }
    });
};

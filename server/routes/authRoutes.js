const express = require('express');
const { signup, login, createUser } = require('../controllers/authController');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/create', protect, authorize('admin'), createUser);
router.get('/users', protect, (req, res) => {
    const companyId = req.user.company._id || req.user.company;
    User.find({ company: companyId }).select('name email role').then(users => res.json({ success: true, data: users }));
});

module.exports = router;

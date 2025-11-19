const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            phone
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        const token = generateToken(user._id);

        // Set token as cookie for server-side auth
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
};

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('wishlist')
            .populate('cart.product')
            .select('-password');

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, phone, birthday, gender } = req.body;

        // Build update object with only provided fields
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (birthday !== undefined) updateData.birthday = birthday;
        if (gender !== undefined) updateData.gender = gender;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both current and new password'
            });
        }

        // Validate new password length
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters long'
            });
        }

        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        if (!(await user.comparePassword(currentPassword))) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error changing password',
            error: error.message
        });
    }
};

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
exports.logout = async (req, res) => {
    try {
        // Clear cookie if it exists
        res.clearCookie('token');
        
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error logging out',
            error: error.message
        });
    }
};

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
exports.getAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('addresses');
        
        res.status(200).json({
            success: true,
            data: user.addresses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching addresses',
            error: error.message
        });
    }
};

// @desc    Add new address
// @route   POST /api/users/addresses
// @access  Private
exports.addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        // If this is the first address or set as default, make it default
        if (user.addresses.length === 0 || req.body.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
            req.body.isDefault = true;
        }

        user.addresses.push(req.body);
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Address added successfully',
            data: user.addresses
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error adding address',
            error: error.message
        });
    }
};

// @desc    Update address
// @route   PUT /api/users/addresses/:id
// @access  Private
exports.updateAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const address = user.addresses.id(req.params.id);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        Object.assign(address, req.body);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Address updated successfully',
            data: user.addresses
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating address',
            error: error.message
        });
    }
};

// @desc    Delete address
// @route   DELETE /api/users/addresses/:id
// @access  Private
exports.deleteAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.addresses.id(req.params.id).remove();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Address deleted successfully',
            data: user.addresses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting address',
            error: error.message
        });
    }
};

// @desc    Set default address
// @route   PUT /api/users/addresses/:id/default
// @access  Private
exports.setDefaultAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        // Remove default from all addresses
        user.addresses.forEach(addr => addr.isDefault = false);
        
        // Set new default
        const address = user.addresses.id(req.params.id);
        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }
        
        address.isDefault = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Default address updated',
            data: user.addresses
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error setting default address',
            error: error.message
        });
    }
};

// @desc    Forgot password
// @route   POST /api/users/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        // Implementation for password reset email
        res.status(200).json({
            success: true,
            message: 'Password reset email sent (feature coming soon)'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing password reset',
            error: error.message
        });
    }
};

// @desc    Reset password
// @route   POST /api/users/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        // Implementation for password reset
        res.status(200).json({
            success: true,
            message: 'Password reset successful (feature coming soon)'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error resetting password',
            error: error.message
        });
    }
};

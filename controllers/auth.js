const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Library = require('../models/Library');
const User = require('../models/User');


const registerLibrary = async (req, res) => {
    try {

        const {
            libraryName,
            adminName,
            email,
            password,
            mobile,
            address
        } = req.body;

        // Validation
        if (!libraryName || !adminName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        // Generate library code
        // const libraryCode =
        //     'LIB' + Math.floor(100000 + Math.random() * 900000);
        const libraryCode =
    libraryName
        .replace(/\s+/g, '')
        .substring(0, 3)
        .toUpperCase() +
    Date.now().toString().slice(-4);

        // Create Library
        const library = await Library.create({
            name: libraryName,
            libraryCode,
            mobile,
            address
        });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Admin User
        const user = await User.create({
            libraryId: library._id,
            name: adminName,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user._id,
                libraryId: library._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        return res.status(201).json({
            success: true,
            message: 'Library registered successfully',
            token,
            data: {
                libraryId: library._id,
                libraryName: library.name,
                libraryCode: library.libraryCode,
                userId: user._id,
                adminName: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find User
        const user = await User.findOne({ email })
            .populate('libraryId');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check Password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user._id,
                libraryId: user.libraryId._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            data: {
                userId: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                libraryId: user.libraryId._id,
                libraryName: user.libraryId.name,
                libraryCode: user.libraryId.libraryCode
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

const getProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.userId)
            .select('-password')
            .populate('libraryId');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

module.exports = {
    registerLibrary,
    login,
    getProfile
};
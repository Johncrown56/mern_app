const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs')
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phoneNo, password } = req.body;

    // if (validate(firstName, lastName, email, phoneNo, password)) {
    // if (firstName && lastName && email && phoneNo && password) {
    //     res.status(200).json({ message: 'User registered successfully' });
    // } else {
    //     res.status(400)
    //     throw new Error('Please provide all fields');
    // }

    if (!firstName || !lastName || !email || !phoneNo || !password) {
        res.status(400)
        throw new Error('Please provide all fields');
    }

    // check if the user exists
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ firstName, lastName, email, phoneNo, password: hashedPassword })
    if (user) {
        const profile = {
            _id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, phoneNo: user.phoneNo,
            token: generateToken(user._id)
        }
        res.status(200).json({ error: false, message: 'User registered successfully', data: profile });
    } else {
        res.status(400);
        throw new Error('User can not be created. Please try again');
    }

})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400)
        throw new Error('Please provide all fields');
    }
    //check if user exists
    const user = await User.findOne({ email });
    // check password and validate it
    const comparePassword = await bcrypt.compare(password, user.password)

    if (user && comparePassword) {
        const profile = {
            _id: user.id, firstName: user.firstName, lastName: user.lastName,
            email: user.email, phoneNo: user.phoneNo, token: generateToken(user._id)
        }
        res.status(200).json({ error: false, message: 'User login successfully', data: profile });
    } else {
        res.status(400);
        throw new Error('Invalid Email or Password');
    }

})

const getUser = asyncHandler(async (req, res) => {
    if (req.user.id) {
        const { _id, firstName, lastName, email, phoneNo } = await User.findById(req.user.id);
        const profile = { id: _id, firstName, lastName, email, phoneNo }
        res.status(200).json({ error: false, message: 'Profile retrieved successfully', data: profile });
    } else {
        res.status(401)
        throw new Error(' Token not valid')
    }
})

const validate = (firstName, lastName, email, phoneNo, password) => {
    if (firstName && lastName && email && phoneNo && password) {
        return true;
    } else {
        return false;
    }
}

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRESIN })
}

module.exports = {
    registerUser, loginUser, getUser
};
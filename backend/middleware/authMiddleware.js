const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler')

const protect = asyncHandler(async (req, res, next) => {
    let token;

    const auth = req.headers.authorization;

    if (auth && auth.startsWith('Bearer')) {
        try {

            token = auth.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // get user id from the token
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401)
            throw new Error('Invalid token');
        }

    }

    if (!token) {
        res.status(401)
        throw new Error('Token not provided');
    }

})

module.exports = { protect }
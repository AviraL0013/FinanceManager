const userModel = require('../models/User.model');
const { validationResult } = require('express-validator');
const userService = require('../services/service')
const BlacklistTokenModel = require('../models/blacklistToken.Model');

module.exports.registerUser = async(req, res,next) => {
    try {
        // Validate the request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Extract details from request
        const { fullname, email, password } = req.body;
        const isUserAlreadyExist = await userModel.findOne({ email });
        if (isUserAlreadyExist) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash the password
        const hashedPassword = await userModel.hashPassword(password);
        console.log(hashedPassword);

        // Create the user using the service
        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword,
        });

        // Generate auth token
        const token = user.generateAuthToken();

        // Respond with the token and user
        res.status(201).json({ token, user });
    } catch (err) {
        console.error('Error during user registration:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

module.exports.loginUser = async(req, res,next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        
        
        const user = await userModel.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or Password' });
        }
        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or Password' });
        }
        const token = user.generateAuthToken();
        res.cookie('token', token);
        return res.status(200).json({ token, user });

    };

module.exports.getUserProfile = async(req, res) => {
    res.status(200).json(req.user);
}
module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    await BlacklistTokenModel.create({ token });
    res.status(200).json({ message: 'Logged out successfully' });
}
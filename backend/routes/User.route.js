const express = require('express');
const {body} = require('express-validator');
const router = express.Router();
const userController = require('../controllers/User.controller');
const authMiddleware = require('../middlewares/auth.middleware');
router.post('/register',[
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min:5}).withMessage('Password must be at least 5 characters long'),
    body('fullname.firstname').isLength({min:3}).withMessage('First name must be at least 3 characters long'),
],
userController.registerUser
)
router.post('/login',[
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min:5}).withMessage('Password must be at least 5 characters long'),
],userController.loginUser
)

router.get('/profile',authMiddleware.authUser,userController.getUserProfile)

router.get('/logout',authMiddleware.authUser,userController.logoutUser)


module.exports = router; // Export the router for use in server.jS
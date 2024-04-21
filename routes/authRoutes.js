// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyTokenAdmin , verifyTokenAPI} = require('../middlewares/authMiddleware'); // Import verifyToken middleware

// Signup route
router.post('/signup', authController.signup);

// Login route
router.post('/login', authController.login);

// Deactivate user route
router.put('/users/:userId/deactivate', verifyTokenAdmin, authController.deactivateUser);

// Activate user route
router.put('/users/:userId/activate', verifyTokenAdmin, authController.activateUser);

// Update user route
router.put('/users/:userId', verifyTokenAdmin, authController.updateUser);

// Delete user route
//router.delete('/users/:userId', authController.deleteUser);
router.delete('/users/:userId', verifyTokenAdmin, authController.deleteUser);

router.post('/validate-token', verifyTokenAPI);

module.exports = router;

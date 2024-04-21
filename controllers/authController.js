// Contains controller files responsible for handling incoming requests, interacting with services, and sending responses back to the client.
const authService = require('../services/authService');
const config = require('../config');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

async function signup(req, res) {
    console.log('Received signup request:', req.body);
    try {
        const userData = req.body;
        
        // Check if the user is signing up as an admin
        const isAdmin = userData.isAdmin || false;

        // Create a new user object with isAdmin field
        const newUser = await authService.signup({ ...userData, isAdmin });

        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function login(req, res) {
    console.log('Received login request:', req.body);
    try {
        console.log('reqInfor',req.body);
        const { email, password } = req.body;
        const user = await authService.login(email, password);
        // Generate JWT token
        console.log('SecretKey at Login:',config.jwtSecret);
        const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '10h' });
        console.log('Logged-In Successfully');
        // Return token in response
        res.status(200).json({ token,user });       
 //       res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

async function activateUser(req, res) {
    try {
        // Check if the user making the request is an admin
        const currentUser = req.user;
        if (!currentUser.isAdmin) {
            return res.status(403).json({ error: 'Forbidden: Only admin can deactivate users' });
        }

        const userId = req.params.userId;
        console.log('Activating API userID:',userId);
        const user = await User.findByIdAndUpdate(userId, { active: true }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deactivateUser(req, res) {
    try {
        // Check if the user making the request is an admin
        const currentUser = req.user;
        if (!currentUser.isAdmin) {
            return res.status(403).json({ error: 'Forbidden: Only admin can deactivate users' });
        }

        const userId = req.params.userId;
        const user = await User.findByIdAndUpdate(userId, { active: false }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateUser(req, res) {
    try {
        const userIdToUpdate = req.params.userId;
        const newData = req.body;
        const loggedInUser = req.user; // Get logged-in user details from middleware

        // Check if logged-in user is an admin
        if (!loggedInUser.isAdmin) {
            return res.status(403).json({ error: 'Forbidden: Only admins can update users' });
        }

        // Proceed with updating the user
        const updatedUser = await authService.updateUser(userIdToUpdate, newData);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

async function deleteUser(req, res) {
    try {
        const requestingUser = req.user; // Extracting user information from the request
        console.log('Delete RequestingUser',requestingUser);
        // Check if the requesting user is an admin
        if (!requestingUser.isAdmin) {
            return res.status(403).json({ error: 'Forbidden: You are not authorized to perform this action' });
        }

        // If the requesting user is an admin, proceed with user deletion
        const userIdToDelete = req.params.userId;
        //console.log('User being deleted',await User.findById(userIdToDelete));
        console.log('User being deleted',userIdToDelete);
        const deletedUser = await authService.deleteUser(userIdToDelete);
        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}


module.exports = {
    signup,
    login,
    activateUser,
    deactivateUser,
    updateUser,
    deleteUser
};

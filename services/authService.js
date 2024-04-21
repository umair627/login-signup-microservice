// Contains service files that encapsulate the business logic of your application. Services are responsible for interacting with databases, external APIs, or other services.
/**
 * signup: Registers a new user by hashing the password and storing the user data in the database.
login: Authenticates a user by comparing the provided password with the hashed password stored in the database.
deactivateUser: Deactivates a user account by setting the active field to false.
updateUser: Updates user details such as name, email, etc.
deleteUser: Deletes a user account from the database.
You would need to define the User model in a separate file (user.js) and configure it according to your database
schema. Additionally, ensure that you handle errors gracefully and provide appropriate error messages to the client.
 */

const bcrypt = require('bcryptjs');
const User = require('../models/user');

async function signup(userData) {
    try {
        // Check if the email or username already exists
        const existingUser = await User.findOne({ $or: [{ email: userData.email }, { username: userData.username }] });
        if (existingUser) {
            throw new Error('Email or username already registered');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;

        // Create a new user with isAdmin field
        const newUser = await User.create(userData);
        return newUser;
    } catch (error) {
        throw error;
    }
}

async function login(email, password) {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        user.lastLoginTime = Date.now();
        await user.save();

        return user;
    } catch (error) {
        throw error;
    }
}

async function activateUser(userId) {
    try {
        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        // Update the user's active status to true
        user.active = true;
        await user.save();

        return { message: 'User activated successfully' };
    } catch (error) {
        throw new Error(error.message);
    }
}

async function deactivateUser(userId) {
    try {
        const user = await User.findByIdAndUpdate(userId, { active: false });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        throw error;
    }
}

async function updateUser(userId, newData) {
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, newData, { new: true });
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    } catch (error) {
        throw error;
    }
}

async function deleteUser(userId) {
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            throw new Error('User not found');
        }
        return deletedUser;
    } catch (error) {
        throw error;
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
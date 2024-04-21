// authMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');


const verifyTokenAdmin = async (req, res, next) => {
  console.log('In middleware:', req.body);
  try {
    // Extract token from request headers
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    console.log('token:',token);
    console.log('SecretKey at Verify:',config.jwtSecret);
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    console.log('decoded User:',decoded.userId);
    // Check if user exists in database
    const user = await User.findById(decoded.userId);

    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden: You are not authorized to access this resource' });
    }

    // Attach user object to request for further processing
    req.user = user;



    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// Middleware to verify JWT token and extract user ID
const verifyToken = async  (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.userId);

    // Attach user object to request for further processing
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to verify JWT token and extract user ID
const verifyTokenAPI = async  (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.userId);

    // Attach user object to request for further processing
    req.user = user;
    res.status(200).json({user });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to check if the user is the owner of the file or an admin
const checkFileAccess = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const fileId = req.params.fileId; // Assuming fileId is passed as a parameter in the request
    // Fetch the file from the database
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    // Check if the user is the owner of the file or an admin
    if (file.userId !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    next();
  } catch (error) {
    console.error('Error checking file access:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {verifyTokenAdmin, verifyTokenAPI, verifyToken, checkFileAccess };


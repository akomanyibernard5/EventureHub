const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/blacklistedToken.model');
const bcrypt = require('bcryptjs');
const { sendEmail } = require("../utils/email");

exports.signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const user = new User({
      fullName,
      email,
      password,
      phone: '',
      organization: '',
      bio: ''
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.lastLogin;
    delete userResponse.updatedAt;
    delete userResponse.__v;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: userResponse
    });

    const emailContent = `
           <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <table style="width: 100%; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <thead style="background-color: #333333; text-align: center;">
          <tr>
            <th style="padding: 20px; font-size: 24px; color: #007bff;">
              EventureHub
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 20px; text-align: center;">
              <h1 style="color: #007bff; cursor: pointer;">Welcome to EventureHub!</h1>
              <p style="margin-bottom: 20px;">
                Dear ${user.fullName},
              </p>
              <p style="margin-bottom: 20px;">
                We're thrilled to have you as part of our community! You can now start creating and managing your events with ease using EventureHub.
              </p>
              <p style="margin: 20px 0;">
                To get started, we recommend you check out our powerful tools for event creation, analytics, and ticket management. If you have any questions or need assistance, our support team is here to help!
              </p>
              <p>
                Thank you for choosing EventureHub. We look forward to helping you make your events a success! <br>
                <strong>EventureHub Support Team</strong>
              </p>
              <p>
                <a href="http://localhost:5173/" style="color: #007bff; text-decoration: none; cursor: pointer;">Go to your dashboard</a>
              </p>
            </td>
          </tr>
        </tbody>
        <tfoot style="background-color: #f8f9fa; text-align: center; font-size: 12px; padding: 10px;">
          <tr>
            <td>
              <p style="margin: 0;">
                &copy; 2024 EventureHub. All rights reserved.
              </p>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    `;
    await sendEmail(
      email,
      'Thanks for Joining EventureHub',
      emailContent
    );

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in signup',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.lastLogin;
    delete userResponse.updatedAt;
    delete userResponse.__v;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in login',
      error: error.message
    });
  }
};


exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    await BlacklistedToken.create({ token });

    res.json({
      success: true,
      message: 'Successfully logged out'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during logout',
      error: error.message
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating password',
      error: error.message
    });
  }
}; 
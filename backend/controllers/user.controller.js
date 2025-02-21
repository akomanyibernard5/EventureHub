const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');
const User = require("../models/user.model")
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail } = require("../utils/email");


const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const getGoogleUserInfo = async (accessToken) => {
  oauth2Client.setCredentials({ access_token: accessToken });
  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2'
  });

  try {
    const res = await oauth2.userinfo.get();
    return res.data;
  } catch (error) {
    console.error('Error fetching Google user info:', error);
    throw new Error('Failed to fetch Google user info');
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      console.error('Google login error: Token is missing in the request body.');
      return res.status(400).json({
        success: false,
        message: 'Google token is required'
      });
    }


    let googleUserInfo;
    try {
      googleUserInfo = await getGoogleUserInfo(token);
    } catch (error) {
      console.error('Error fetching Google user info:', error.message);
      return res.status(400).json({
        success: false,
        message: 'Invalid Google token or unable to fetch Google user info',
        error: error.message,
      });
    }

    const { email } = googleUserInfo;

    if (!email) {
      console.error('Google login error: No email found in Google user info.');
      return res.status(400).json({
        success: false,
        message: 'Google account email is required',
      });
    }

    let user;
    try {
      user = await User.findOne({ email });
    } catch (error) {
      console.error('Error querying the database for user:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Error while searching for user in the database',
        error: error.message,
      });
    }

    if (!user) {
      console.warn(`Google login error: No user found for email: ${email}`);
      return res.status(404).json({
        success: false,
        message: 'User not found. Please sign up first.',
      });
    }

    let jwtToken;
    try {
      jwtToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
    } catch (error) {
      console.error('Error generating JWT token:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to generate authentication token',
        error: error.message,
      });
    }

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.updatedAt;
    delete userResponse.__v;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: jwtToken,
      user: userResponse,
    });
  } catch (error) {
    console.error('Unexpected error during Google login:', error.message);
    res.status(500).json({
      success: false,
      message: 'Google login failed due to an unexpected error',
      error: error.message,
    });
  }
};


exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const updates = req.body

    const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    })
  }
}


const otpStore = {};


exports.requestOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const otp = crypto.randomInt(100000, 999999).toString();
  otpStore[email] = otp;

  const otpExpiration = new Date(Date.now() + 2 * 60 * 1000);

  user.otp = otp;
  user.otpExpiration = otpExpiration;
  await user.save();

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
            <h1 style="color: #007bff; cursor: pointer;">Password Reset Request</h1>
            <p style="margin-bottom: 20px;">
              Dear ${user.fullName},
            </p>
            <p style="margin-bottom: 20px;">
              We have received a request to reset your password. Please use the following One-Time Password (OTP) to complete the process:
            </p>
            <div style="display: inline-block; padding: 15px; font-size: 20px; font-weight: bold; color: #fff; background-color: #007bff; border-radius: 8px; cursor: pointer;">
              ${otp}
            </div>
            <p style="margin: 20px 0;">
              This OTP is valid for the next <strong style="cursor: pointer;">15 minutes</strong>. If you did not initiate this request, please ignore this message or contact our support team immediately.
            </p>
            <p>
              Thank you,<br>
              <strong>EventureHub Support Team</strong>
            </p>
            <p>
              <a href="http://localhost:5173/" style="color: #007bff; text-decoration: none; cursor: pointer;">Visit Our Website</a>
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
  </div>`;

  await sendEmail(
    email,
    'Password Reset Request',
    emailContent
  );

  res.json({ message: 'OTP sent to email' });
};


exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp || !user.otpExpiration) {
      return res.status(400).json({ message: "No OTP found. Please request a new one." });
    }

    if (new Date() > user.otpExpiration) {
      user.otp = null;
      user.otpExpiration = null;
      await user.save();
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    user.otp = null;
    user.otpExpiration = null;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (newPassword != confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Passwords do not match'
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
            <h1 style="color: #007bff; cursor: pointer;">Password Reset Request</h1>
            <p style="margin-bottom: 20px;">
              Dear ${user.fullName},
            </p>
            <p style="margin-bottom: 20px;">
              We want to let you know that your password has been successfully reset. You can now log in to your account using your new password.  
            </p>
            <p style="margin: 20px 0;">
              If you did not request this password reset or believe this action was unauthorized, please contact our support team immediately at eventurehub1@gmail.com so we can secure your account.  
            <p>
                Thank you for choosing EventureHub. <br>
              <strong>EventureHub Support Team</strong>
            </p>
            <p>
              <a href="http://localhost:5173/" style="color: #007bff; text-decoration: none; cursor: pointer;">Visit Our Website</a>
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
  </div>`;

  await sendEmail(
    email,
    'Password Reset Successful',
    emailContent
  );

  res.json({ message: 'Password updated successfully' });
};



exports.googleSignup = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      console.error('Google Signup error: Token is missing in the request body.');
      return res.status(400).json({
        success: false,
        message: 'Google token is required',
      });
    }

    let googleUserInfo;
    try {
      googleUserInfo = await getGoogleUserInfo(token);
    } catch (error) {
      console.error('Error fetching Google user info:', error.message);
      return res.status(400).json({
        success: false,
        message: 'Invalid Google token or unable to fetch Google user info',
        error: error.message,
      });
    }

    const { email, name, picture } = googleUserInfo;

    if (!email) {
      console.error('Google login error: No email found in Google user info.');
      return res.status(400).json({
        success: false,
        message: 'Google account email is required',
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      console.log(`User found for email: ${email}, sending exists message.`);
      return res.status(200).json({
        success: true,
        message: 'User already exists. Please log in instead.',
        user: {
          email: user.email,
          fullName: user.fullName,
        },
      });
    }

    user = new User({
      fullName: name,
      email,
      password: '',
      phone: '',
      organization: '',
      bio: '',
      isGoogleUser: true,
    });

    try {
      await user.save();
      console.log(`New user created for email: ${email}`);
    } catch (error) {
      console.error('Error creating new user:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to create new user account',
        error: error.message,
      });
    }

    let jwtToken;
    try {
      jwtToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

    } catch (error) {
      console.error('Error generating JWT token:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to generate authentication token',
        error: error.message,
      });
    }

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.lastLogin;
    delete userResponse.updatedAt;
    delete userResponse.__v;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: jwtToken,
      user: userResponse,
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
    console.error('Unexpected error during Google login/signup:', error.message);
    res.status(500).json({
      success: false,
      message: 'Google login/signup failed due to an unexpected error',
      error: error.message,
    });
  }
};

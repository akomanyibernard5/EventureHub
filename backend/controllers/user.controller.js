const { google } = require('googleapis');

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

exports.googleSignup = async (req, res) => {
  try {
    const { token } = req.body;
    const googleUserInfo = await getGoogleUserInfo(token);

    let user = await User.findOne({ email: googleUserInfo.email });

    if (!user) {
      user = new User({
        name: googleUserInfo.name,
        email: googleUserInfo.email,
        avatar: googleUserInfo.picture,
        googleId: googleUserInfo.id,
      });
      await user.save();
    }

    const jwtToken = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token: jwtToken, user });
  } catch (error) {
    console.error('Google signup error:', error);
    res.status(500).json({ message: 'Google signup failed' });
  }
};
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });


// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { username, mobile, email, password, confirmPassword } = req.body;

    if (!username || !mobile || !email || !password || !confirmPassword) {
      return res.status(400).json({
        error: "MISSING_FIELDS",
        message: "Please fill all fields"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "PASSWORD_MISMATCH",
        message: "Passwords do not match"
      });
    }

    const userExists = await User.findOne({ $or: [{ email }, { mobile }] });

    if (userExists) {
      return res.status(409).json({
        error: "USER_EXISTS",
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      mobile,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      pic: user.pic,
      token: generateToken(user.id)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "SERVER_ERROR",
      message: "Something went wrong"
    });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        error: "MISSING_FIELDS",
        message: "Mobile and password are required"
      });
    }

    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({
        error: "USER_NOT_FOUND",
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "INVALID_PASSWORD",
        message: "Password is incorrect"
      });
    }

    res.status(200).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      pic: user.pic,
      token: generateToken(user.id)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "SERVER_ERROR",
      message: "Server error"
    });
  }
};
// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
// @desc    Update user profile picture 🖼️
// @route   POST /api/auth/profile-pic
// @access  Private
const baseUrl = `${req.protocol}://${req.get("host")}`;


const updateProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "NO_FILE",
        message: "No file uploaded",
      });
    }

    const filePath = req.file.path.replace(/\\/g, "/");
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { pic: `${baseUrl}/${filePath}` },
      { new: true, select: "-password" }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "SERVER_ERROR",
      message: "Server error",
    });
  }
};

const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// @desc    Get all users (Search)
// @route   GET /api/auth?search=variable
// @access  Private
const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { username: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
};

module.exports = {
  signup,
  login,
  getMe,
  updateProfilePic,
  allUsers
};

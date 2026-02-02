
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name: `${firstName} ${lastName}`, // 🔥 FIX HERE
      email,
      password: hashed,
    });

    return res.status(201).json({
      success: true,
      message: "Signup successful",
    });
  } catch (err) {
    console.error("SIGNUP ERROR 👉", err); // 👈 add this
    return res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email & password required",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "You are not registered",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Password incorrect",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,          // ✅ FIX
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR 👉", err); // 👈 always log
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};


exports.logout = async (req, res) => {
  try {
    // JWT based logout me DB se kuch delete nahi hota
    // Token frontend pe remove hota hai

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("LOGOUT ERROR 👉", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};


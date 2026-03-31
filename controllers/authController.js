const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const validator = require("validator");

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email",
      });
    }

    if (!validator.isStrongPassword(password, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters and include uppercase, lowercase, and a number",
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

    // ✅ create user
    const user = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: hashed,
    });

    // ✅ generate token (10 hours)
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    // ✅ save token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 10 * 60 * 60 * 1000, // 10h
      sameSite: "lax",
      secure: false, // true in production https
    });

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("SIGNUP ERROR 👉", err);
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
      { expiresIn: "10h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 10 * 60 * 60 * 1000, 
      sameSite: "lax",
      secure: false, 
    });

    return res.status(200).json({
      success: true,
      message: "Login success",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR 👉", err);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    // verify token with google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { sub, name, email, picture } = payload;

    // check if user exists
    let user = await User.findOne({ email });

    // create if not exists
    if (!user) {
      user = await User.create({
        name,
        email,
        picture,
        googleId: sub,
      });
    }

    // create JWT
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      token: jwtToken,
      user,
    });

  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "Google authentication failed",
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


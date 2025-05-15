// controllers/authController.js
import { userModel } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existing = await userModel.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ message: "Email already exists", success: false });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new userModel({
      username,
      email,
      password: hashedPassword, // Don't store plain text
    });

    await user.save();

    res
      .status(201)
      .json({ message: "User registered successfully", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", success: false });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, username:user.username, email:user.email},
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );


    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only send on HTTPS in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        username: user.username,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

export const logoutUser = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only in HTTPS on production
      sameSite: "strict",
    })
    .status(200)
    .json({
      success: true,
      message: "Logged out successfully",
    });
};


import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are mandatory" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "user already registered" });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create and save new user
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.log("Error in register user", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    //compare password with hashed password

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }
    //generate a token
    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username }, // Payload
      process.env.ACCESS_TOKEN_SECRET, // Secret key from .env file
      { expiresIn: "1h" } // Token expiration time
    );

    //continue with login process

    res
      .status(200)
      .json({ success: true, message: "Login Successful", token, data: user });
  } catch (error) {
    console.log("Error in login user", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const currentUser = (req, res) => {
  // The `validateToken` middleware ensures that `req.user` is populated
  if (!req.user) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
  }

  res.status(200).json({
    success: true,
    message: "Current user details fetched successfully",
    user: req.user, // Contains decoded token data
  });
};

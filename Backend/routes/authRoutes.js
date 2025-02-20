const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Use an environment variable

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new Admin
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: "Invalid username or password" });

    // Compare Password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid username or password" });

    // Generate JWT Token
    const token = jwt.sign({ id: admin._id }, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ token, message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

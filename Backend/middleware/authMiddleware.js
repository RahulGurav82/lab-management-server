const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

module.exports = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token.split(" ")[1], SECRET_KEY);
    req.admin = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};
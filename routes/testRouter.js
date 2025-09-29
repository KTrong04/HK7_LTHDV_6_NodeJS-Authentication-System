import express from "express";
import jwt from "jsonwebtoken";

const testRouter = express.Router();

// Middleware verify JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token expired or invalid" });
    req.user = user;
    next();
  });
}

// Route test protected
testRouter.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "Access granted ✅",
    user: req.user,
  });
});

export default testRouter;


import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  // Handle "Bearer <token>" format
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  try {
    const verified = jwt.verify(token, process.env.JSON_WEB);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

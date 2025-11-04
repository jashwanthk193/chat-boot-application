import { verifyToken } from "../response/token.util.js";
import { ApiError } from "../response/error.js";

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Instead of throwing, just respond with 401
    return res.status(401).json({ message: "Unauthorized" });
  }


  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    throw new ApiError(403, "Invalid or expired token");
  }
};

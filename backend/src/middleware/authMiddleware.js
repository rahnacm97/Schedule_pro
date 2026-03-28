import jwt from "jsonwebtoken";
import HttpStatus from "../shared/enums/httpStatus.js";

//Authentication
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Invalid token" });
    req.userId = user.userId;
    req.userEmail = user.email;
    next();
  });
};

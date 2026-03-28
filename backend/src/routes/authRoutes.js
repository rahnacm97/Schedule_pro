import express from "express";
import {
  signup,
  login,
  getMe,
  googleLogin,
  updateProfile,
} from "../controllers/authController.js";
import {
  signupSchema,
  loginSchema,
  validate,
} from "../validation/authValidation.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import * as userRepository from "../repositories/userRepository.js";

const router = express.Router();
//Authentication routes
router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/google", googleLogin);
router.get("/me", authenticateToken, getMe);
router.patch("/profile", authenticateToken, updateProfile);

router.get("/public/:linkSuffix", async (req, res) => {
  try {
    const user = await userRepository.findByLinkSuffix(req.params.linkSuffix);
    if (!user) return res.status(404).json({ message: "Host not found" });
    res.json({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      timeZone: user.time_zone,
      bookingTitle: user.bookingTitle,
      bookingDuration: user.bookingDuration,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

import express from "express";
import * as calendarController from "../controllers/calendarController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();
//Google Calender routes
router.get("/google/auth", authenticateToken, calendarController.initiateAuth);
router.get("/google/callback", calendarController.handleCallback);

export default router;

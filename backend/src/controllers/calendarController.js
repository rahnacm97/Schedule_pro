import * as calendarService from "../services/calendarService.js";
import User from "../models/User.js";
import HttpStatus from "../shared/enums/httpStatus.js";

export const initiateAuth = (req, res) => {
  const url = calendarService.getAuthUrl(req.userId);
  res.json({ url });
};

//Calender
export const handleCallback = async (req, res) => {
  const { code, state: userId } = req.query;
  try {
    const tokens = await calendarService.getTokens(code);

    await User.findByIdAndUpdate(userId, {
      googleTokens: tokens,
      googleId: tokens.id_token,
    });

    res.redirect("http://localhost:5173/dashboard?connected=google");
  } catch (error) {
    console.error("OAuth Callback Error:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send("Authentication failed");
  }
};

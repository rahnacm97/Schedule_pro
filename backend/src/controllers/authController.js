import * as authService from "../services/authService.js";
import HttpStatus from "../shared/enums/httpStatus.js";
import SuccessMessages from "../shared/enums/successMessages.js";
import ErrorMessages from "../shared/enums/errorMessages.js";

// Signup
export const signup = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(HttpStatus.CREATED).json({
      message: SuccessMessages.SIGNUP_SUCCESS,
      ...result,
    });
  } catch (error) {
    console.error("Signup Controller Error:", error);
    const status =
      error.message === ErrorMessages.USER_ALREADY_EXISTS
        ? HttpStatus.CONFLICT
        : HttpStatus.INTERNAL_SERVER_ERROR;
    res
      .status(status)
      .json({
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
  }
};
//Login
export const login = async (req, res) => {
  try {
    const result = await authService.authenticate(req.body);
    res.status(HttpStatus.OK).json({
      message: SuccessMessages.LOGIN_SUCCESS,
      ...result,
    });
  } catch (error) {
    const status =
      error.message === ErrorMessages.INVALID_CREDENTIALS
        ? HttpStatus.UNAUTHORIZED
        : HttpStatus.INTERNAL_SERVER_ERROR;
    res.status(status).json({ message: error.message });
  }
};
// Google setup
export const getMe = async (req, res) => {
  try {
    const user = await authService.getProfile(req.userId);
    res.status(HttpStatus.OK).json(user);
  } catch (error) {
    res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
  }
};
// Google login
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    const result = await authService.googleAuthenticate(credential);
    res.status(HttpStatus.OK).json({
      message: SuccessMessages.LOGIN_SUCCESS,
      ...result,
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(HttpStatus.UNAUTHORIZED).json({ message: error.message });
  }
};
// Profile updating availability settings, name, or booking
export const updateProfile = async (req, res) => {
  try {
    const user = await authService.updateProfile(req.userId, req.body);
    res.status(HttpStatus.OK).json({
      message: SuccessMessages.PROFILE_UPDATED,
      user,
    });
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

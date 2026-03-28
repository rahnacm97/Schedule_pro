import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import * as userRepository from "../repositories/userRepository.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// Token generation
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId: userId.toString(), email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};

const sanitizeUser = (user) => ({
  id: user._id,
  email: user.email,
  name: user.name,
  avatar: user.avatar,
  linkSuffix: user.linkSuffix,
  timeZone: user.timeZone,
  bookingTitle: user.bookingTitle,
  bookingDuration: user.bookingDuration,
});
//Sign up
export const register = async ({ email, password, name }) => {
  console.log("Attempting registration for email:", email);
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    console.log("User already exists");
    throw new Error("User with this email already exists");
  }

  const baseSuffix = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const linkSuffix = `${baseSuffix}-${Math.random().toString(36).substring(2, 8)}`;
  console.log("Generated linkSuffix:", linkSuffix);

  try {
    const user = await userRepository.create({
      email,
      password,
      name,
      linkSuffix,
    });
    console.log("User created successfully in DB. ID:", user._id);
    const token = generateToken(user._id, user.email);
    return { token, user: sanitizeUser(user) };
  } catch (dbError) {
    console.error("Database error during creation:", dbError);
    throw dbError;
  }
};
//Check authenticated
export const authenticate = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken(user._id, user.email);
  return { token, user: sanitizeUser(user) };
};
//Google authentication
export const googleAuthenticate = async (credential) => {
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { email, name, sub: googleId, picture: avatar } = payload;

  let user = await userRepository.findByEmail(email);

  if (!user) {
    const baseSuffix = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const linkSuffix = `${baseSuffix}-${Math.random().toString(36).substring(2, 8)}`;
    user = await userRepository.create({
      email,
      name,
      googleId,
      avatar,
      linkSuffix,
    });
  } else if (!user.googleId) {
    user.googleId = googleId;
    if (!user.avatar) user.avatar = avatar;
    await user.save();
  }

  const token = generateToken(user._id, user.email);
  return { token, user: sanitizeUser(user) };
};
//Get profile
export const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new Error("User not found");
  return sanitizeUser(user);
};
//Profile update
export const updateProfile = async (userId, data) => {
  const allowedUpdates = [
    "name",
    "timeZone",
    "bookingTitle",
    "bookingDuration",
    "avatar",
    "linkSuffix",
  ];
  const filteredData = Object.keys(data)
    .filter((key) => allowedUpdates.includes(key))
    .reduce((obj, key) => {
      obj[key] = data[key];
      return obj;
    }, {});

  const user = await userRepository.updateProfile(userId, filteredData);
  if (!user) throw new Error("User not found");
  return sanitizeUser(user);
};

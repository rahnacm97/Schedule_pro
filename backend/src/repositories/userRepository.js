import User from "../models/User.js";

export const findByEmail = async (email) => {
  return User.findOne({ email }).select("+password");
};

export const findById = async (id) => {
  return User.findById(id);
};

export const findByLinkSuffix = async (linkSuffix) => {
  return User.findOne({ linkSuffix });
};

export const create = async ({
  email,
  password,
  name,
  linkSuffix,
  timeZone = "UTC",
}) => {
  const user = new User({ email, password, name, linkSuffix, timeZone });
  return user.save();
};

export const updateGoogleTokens = async (id, googleId, tokens) => {
  return User.findByIdAndUpdate(
    id,
    { googleId, googleTokens: tokens },
    { new: true },
  );
};

export const updateProfile = async (id, data) => {
  return User.findByIdAndUpdate(id, data, { new: true });
};

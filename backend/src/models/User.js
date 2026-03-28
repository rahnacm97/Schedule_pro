import mongoose from "mongoose";
import bcrypt from "bcryptjs";

//User
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    linkSuffix: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    googleId: {
      type: String,
      default: null,
      sparse: true,
    },
    googleTokens: {
      type: Object,
      default: null,
      select: false,
    },
    timeZone: {
      type: String,
      default: "UTC",
    },
    bookingTitle: {
      type: String,
      default: "30 Minute Meeting",
    },
    bookingDuration: {
      type: Number,
      default: 30,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;

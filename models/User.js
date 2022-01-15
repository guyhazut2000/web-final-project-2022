const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: {
      type: String,
      enum: ["student", "teacher"],
      default: "student",
    },
    isOnline: { type: Boolean, default: false },
  },
  { collection: "users" },
  { timestamps: true }
);
module.exports = mongoose.model("User", UserSchema);

import { Schema, model } from "mongoose";

// Define User Schema
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // createdAt: { type: Date, default: Date.now }
});

// Create User Model
const User = model("User", userSchema);

export default User;

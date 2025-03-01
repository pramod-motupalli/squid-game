import { Schema, model } from "mongoose";

// Define User Schema
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  level1: { type: Boolean, default: false },  // Tracks Level 1 completion
  level2: { type: Boolean, default: false },  // Tracks Level 2 completion
  level2Time: { type: Number, default: 0 },    // Level 2 time (default 0)
  level2Score: { type: Number, default: 0 }    // Level 2 score (default 0)
});

// Create User Model
const User = model("User", userSchema);

export default User;

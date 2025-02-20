import { Schema, model } from "mongoose";  

// Define User Schema 
const userSchema = new Schema({   
  username: { type: String, required: true, unique: true },   
  password: { type: String, required: true },   
  level1: { type: Boolean, default: false },  // Tracks Level 1 completion
  level2: { type: Boolean, default: false }   // Tracks Level 2 completion
});  

// Create User Model 
const User = model("User", userSchema);  

export default User;

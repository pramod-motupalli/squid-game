import { Schema, model } from "mongoose";

// Define User Schema
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  playerid: { type: String },                         // Added playerid field
  eliminated: { type: Boolean, default: false },       // Added eliminated field with default false
  won: { type: Number, default: 100 },                 // Added won field with default value 100
  level1: { type: Boolean, default: false },           // Tracks Level 1 completion
  level2: { type: Boolean, default: false },           // Tracks Level 2 completion
  level2Time: { type: Number, default: 0 },            // Level 2 time (default 0)
  level2Score: { type: Number, default: 0 },
  level1Q1 :{type:String},
  level1Q2 :{type : String},
  level1Q3 :{type : String},
  level2Q1 : {type: String},
  level2Q2 : {type: String},
  level2Q3 : {type: String},
  level2Q4 : {type: String},
  level2Q5 : {type: String},
  level2Q6 : {type: String},
  level2Q7 : {type: String},
  level2Q8 : {type: String},
  level2Q9 : {type: String},
  level2Q10 : {type: String},
  level3Time: { type:Number,default:0 },
  level3Score: { type:Number,default:0}, // Level 2 score (default 0)
  level3Q1: { type: String},
  level3Q2: { type : String}
});

// Create User Model
const User = model("User", userSchema);

export default User;

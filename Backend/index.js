import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import fs from "fs";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./database/db.js";
import User from "./database/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// ✅ CRUD Operations
app.post("/users", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Error creating user", details: error });
  }
});

app.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Check if user exists
      const user = await User.findOne({ username });
      console.log(user);
  
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
  
      res.status(200).json({ message: "Login successful", user });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  
  
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

app.get("/users/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
});

app.put("/users/:username", async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { password: newPassword },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Password updated", user });
  } catch (error) {
    res.status(500).json({ error: "Error updating password" });
  }
});

app.delete("/users/:username", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted", user });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
});

// ✅ C++ Compilation Setup
const CODE_DIR = path.join(__dirname, "temp_code");
if (!fs.existsSync(CODE_DIR)) {
  fs.mkdirSync(CODE_DIR, { recursive: true });
}

// ✅ C++ Compilation Route
app.post("/compile", (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  const fileName = `program_${Date.now()}.cpp`;
  const filePath = path.join(CODE_DIR, fileName);
  const outputFile = filePath.replace(".cpp", "");

  fs.writeFile(filePath, code, (writeErr) => {
    if (writeErr) {
      return res.status(500).json({ error: "Error writing file" });
    }

    exec(`g++ "${filePath}" -o "${outputFile}" && "${outputFile}"`, (error, stdout, stderr) => {
      if (error) {
        return res.json({ output: stderr || "Compilation failed" });
      }
      res.json({ output: stdout || "Execution successful" });

      // Cleanup temp files
      setTimeout(() => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
      }, 5000);
    });
  });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

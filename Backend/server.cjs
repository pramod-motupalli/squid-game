const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Directory to store temporary files
const CODE_DIR = path.join(__dirname, "temp_code");
if (!fs.existsSync(CODE_DIR)) {
  fs.mkdirSync(CODE_DIR, { recursive: true });
}

app.post("/compile", (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  const fileName = `program_${Date.now()}.cpp`;
  const filePath = path.join(CODE_DIR, fileName);
  const outputFile = filePath.replace(".cpp", "");

  // Write C++ code to a file
  fs.writeFile(filePath, code, (writeErr) => {
    if (writeErr) {
      return res.status(500).json({ error: "Error writing file" });
    }

    // Compile the C++ file using g++
    exec(`g++ "${filePath}" -o "${outputFile}" && "${outputFile}"`, (error, stdout, stderr) => {
      if (error) {
        return res.json({ output: stderr || "Compilation failed" });
      }
      res.json({ output: stdout || "Execution successful" });

      // Cleanup: Remove files after execution
      setTimeout(() => {
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting source file:", err);
          });
        }
        if (fs.existsSync(outputFile)) {
          fs.unlink(outputFile, (err) => {
            if (err) console.error("Error deleting compiled file:", err);
          });
        }
      }, 5000);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

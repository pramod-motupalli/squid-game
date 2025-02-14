const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const compiler = require("compilex");

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Allow frontend requests

// Initialize compilex with options
const options = { stats: true }; // Enable statistics for debugging
compiler.init(options);

app.post("/compile", (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required!" });
  }

  const envData = { OS: "windows" }; // Use "linux" for Linux servers

  if (language === "cpp") {
    compiler.compileCPP(envData, code, (data) => {
      if (data.error) {
        return res.json({ error: data.error });
      }
      res.json({ output: data.output });
    });
  } else if (language === "c") {
    compiler.compileC(envData, code, (data) => {
      if (data.error) {
        return res.json({ error: data.error });
      }
      res.json({ output: data.output });
    });
  } else {
    res.status(400).json({ error: "Unsupported language!" });
  }
});

// Cleanup compilex to free resources
process.on("exit", () => {
  compiler.flush(() => console.log("Temporary files deleted."));
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { dracula } from "@uiw/codemirror-theme-dracula";

const squidGameMusic = "/squid-game-music.mp3";
const redLightImage = "/squid-game-doll.png";

const COMPILERX_API_URL = "https://compilerx-api-url.com"; // Replace with actual URL
const COMPILERX_API_KEY = "your-api-key"; // Replace with your API key

const RedLightGreenLight = () => {
  const [won, setWon] = useState(100);
  const [isGreenLight, setIsGreenLight] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [audio] = useState(new Audio(squidGameMusic));

  useEffect(() => {
    audio.loop = true;
    const playMusic = () => {
      audio.play().catch((error) => console.log("Audio play blocked:", error));
      document.removeEventListener("click", playMusic);
    };
    document.addEventListener("click", playMusic);
    return () => audio.pause();
  }, [audio]);

  const questions = [
    "// Fix the bug in this function\nint add(int a, int b) {\n return a - b; // Incorrect operation\n}",
    "// Fix the bug in this function\n#include <stdio.h>\nint main() {\n  printf(\"Hello, world!\" // Missing closing parenthesis\n  return 0;\n}",
    "// Fix the bug in this function\nvoid swap(int a, int b) {\n  int temp = a;\n  a = b;\n  b = temp; // Values are not swapped outside the function\n}"
  ];

  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGreenLight(false);
      setTimeout(() => {
        setIsGreenLight(true);
      }, 10000);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (won < 75) {
      setGameOver(true);
    }
  }, [won]);

  const handleCodeChange = (value) => {
    if (!isGreenLight) {
      setWon((prevWon) => Math.max(prevWon - 5, 0));
    }
    setCode(value);
  };

  const handleCompileRun = async (isRun) => {
    const response = await fetch(COMPILERX_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": COMPILERX_API_KEY,
      },
      body: JSON.stringify({
        language: "c",
        code: code,
        stdin: "",
      }),
    });
    const result = await response.json();
    setOutput(result.output || "Error in execution");
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCode("");
      setOutput("");
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setCode("");
      setOutput("");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-black min-h-screen text-white relative">
      <h1 className="text-4xl font-bold mb-6">Level 1: Red Light, Green Light (Debugging Battle)</h1>
      <div className="flex w-full max-w-4xl space-x-4 relative">
        <div className="w-1/2 relative">
          {!isGreenLight && (
            <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50">
              <img src={redLightImage} alt="Squid Game Doll" className="w-48 h-48" />
            </div>
          )}
          <p className="text-lg font-bold">Question:</p>
          <pre className="bg-gray-800 p-4 rounded-md w-full overflow-auto mb-4">{questions[currentQuestion]}</pre>
          <div className="flex justify-between mt-2">
            <button onClick={handlePrevious} className="px-4 py-2 bg-gray-500 text-white rounded">Previous</button>
            <button onClick={handleNext} className="px-4 py-2 bg-yellow-500 text-white rounded">Next</button>
          </div>
        </div>
        <div className="w-1/2">
          <CodeMirror
            value={code}
            height="400px"
            width="100%"
            extensions={[cpp()]}
            theme={dracula}
            onChange={handleCodeChange}
          />
          <div className="flex mt-2 space-x-2">
            <button onClick={() => handleCompileRun(false)} className="px-4 py-2 bg-blue-500 text-white rounded">Compile</button>
            <button onClick={() => handleCompileRun(true)} className="px-4 py-2 bg-green-500 text-white rounded">Run</button>
            <button onClick={handleNext} className="px-4 py-2 bg-yellow-500 text-white rounded">Submit</button>
          </div>
        </div>
      </div>
      
      <p className="text-lg mt-4">Current Won: <span className="font-bold text-yellow-400">{won} Won</span></p>
      <p className="text-lg">Time Left: <span className="font-bold text-red-400">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span></p>
      
      {output && (
        <div className="bg-gray-900 p-4 rounded mt-4 w-full max-w-xl">
          <p className="text-lg font-bold">Output:</p>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
};

export default RedLightGreenLight;

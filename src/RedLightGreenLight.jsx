import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { dracula } from "@uiw/codemirror-theme-dracula";
import squidGameMusic from "./squid-game-music.mp3";
import redLightImage from "./squid-game-doll.png";

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

  useEffect(() => {
    const audio = new Audio(squidGameMusic);
    audio.loop = true;
    audio.play().catch(error => console.log("Audio play blocked:", error));
    return () => audio.pause();
  }, []);

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
      console.log("Red Light Start");
      setIsGreenLight(false);
      setTimeout(() => {
        console.log("Green Light Start");
        setIsGreenLight(true);
      }, 5000);
    }, 60000);
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

  return (
    <div className="flex flex-col items-center p-6 bg-black min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-6">Level 1: Red Light, Green Light (Debugging Battle)</h1>
      <p className="text-lg mb-2">Participants will compete in pairs from the start.</p>
      <p className="text-lg mb-2">Each pair starts with 100 won.</p>
      <p className="text-lg mb-2">A buggy code will be given along with an editor to fix it.</p>
      <p className="text-lg mb-4">Debugging is only allowed during the green light.</p>

      {/* Light Indicator */}
      <div className={`px-4 py-2 rounded-full text-lg font-semibold mb-4 ${isGreenLight ? 'bg-green-500' : 'bg-red-500'}`}>
        {isGreenLight ? "Green Light - You can code!" : "Red Light - Stop coding!"}
      </div>

      {!isGreenLight && <img src={redLightImage} alt="Squid Game Doll" className="w-40 h-40 mb-4" />}

      <p className="text-lg">Current Won: <span className="font-bold text-yellow-400">{won} Won</span></p>
      <p className="text-lg">Time Left: <span className="font-bold text-red-400">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span></p>
    </div>
  );
};

export default RedLightGreenLight;

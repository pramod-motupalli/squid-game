import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { dracula } from "@uiw/codemirror-theme-dracula";

const squidGameMusic = "/squid-game-music.mp3";
const COMPILERX_API_URL = "https://compilerx-api-url.com"; // Replace with actual URL
const COMPILERX_API_KEY = "your-api-key"; // Replace with actual API key

const RedLightGreenLight = () => {
  const [won, setWon] = useState(100);
  const [isGreenLight, setIsGreenLight] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [compiling, setCompiling] = useState(false);
  const [audio] = useState(() => {
    const newAudio = new Audio(squidGameMusic);
    newAudio.loop = true;
    return newAudio;
  });

  const questions = [
    { 
      prompt: "// Fix the bug in this function\nint add(int a, int b) {\n return a - b; // Incorrect operation\n}",
      expected: "15\n"
    },
    {
      prompt: "// Fix the bug in this function\n#include <stdio.h>\nint main() {\n  printf(\"Hello, world!\") // Missing closing parenthesis\n  return 0;\n}",
      expected: "Hello, world!\n"
    },
    {
      prompt: "// Fix the bug in this function\nvoid swap(int a, int b) {\n  int temp = a;\n  a = b;\n  b = temp; // Values are not swapped outside the function\n}",
      expected: "Swapped successfully\n"
    }
  ];

  useEffect(() => {
    setExpectedOutput(questions[currentQuestion].expected);
  }, [currentQuestion]);

  useEffect(() => {
    const playMusic = () => {
      audio.play().catch((error) => console.log("Audio play blocked:", error));
      document.removeEventListener("click", playMusic);
    };

    document.addEventListener("click", playMusic);
    return () => {
      document.removeEventListener("click", playMusic);
      audio.pause();
    };
  }, [audio]);

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
      const randomRedLightDuration = Math.floor(Math.random() * 11) + 5; // Random 5-15 sec
      setTimeout(() => {
        setIsGreenLight(true);
      }, randomRedLightDuration * 1000);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (won < 70) {
      setGameOver(true);
    }
  }, [won]);

  useEffect(() => {
    const updateISTTime = () => {
      const now = new Date();
      const utcOffset = now.getTimezoneOffset() * 60000;
      const istTime = new Date(now.getTime() + utcOffset + 19800000);
      const hours = istTime.getHours();
      const minutes = istTime.getMinutes();
      const seconds = istTime.getSeconds();

      if (hours === 20 && minutes >= 25) {
        const secondsSince805PM = (minutes - 25) * 60 + seconds;
        setTimeLeft(Math.max(600 - secondsSince805PM, 0));
      } else {
        setTimeLeft(600);
      }
    };

    updateISTTime();
    const interval = setInterval(updateISTTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCodeChange = (value) => {
    if (!isGreenLight) {
      setWon((prevWon) => Math.max(prevWon - 1, 0));
    }
    setCode(value);
  };

  const handleCompileRun = async (isRun) => {
    setCompiling(true);
    try {
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
    } catch (error) {
      console.error("Error compiling:", error);
      setOutput("Compilation Error");
    }
    setCompiling(false);
  };

  const handleSubmit = () => {
    if (output.trim() === expectedOutput.trim()) {
      setWon((prevWon) => prevWon + 10);
      alert("Correct! You earned 10 Won!");
    } else {
      setWon((prevWon) => Math.max(prevWon - 10, 0));
      alert("Incorrect output. You lost 10 Won!");
    }
  };

  return (
    <div className={`flex flex-col items-center p-6 min-h-screen bg-black text-white relative w-full 
      ${!isGreenLight ? "border-8 border-red-500 animate-pulse shadow-[0px_0px_50px_rgba(255,0,0,0.8)] before:content-[''] before:absolute before:inset-0 before:bg-red-600 before:blur-[80px] before:opacity-50" : ""}`}>
    

      <h1 className="text-2xl md:text-4xl font-bold mb-6 text-center">
        Level 1: Red Light, Green Light (Debugging Battle)
      </h1>
      <div className="flex flex-col lg:flex-row w-full max-w-6xl space-y-4 lg:space-y-0 lg:space-x-4 relative">
        <div className="w-full lg:w-1/2 relative">
          <p className="text-lg font-bold">Question:</p>
          {!isGreenLight && (
            <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50">
              <img src="/images/dollred.jpg" alt="Squid Game Doll" className="w-48 md:w-96 h-48 md:h-96 animate-pulse" />
            </div>
          )}
          <pre className="bg-gray-800 p-4 rounded-md w-full overflow-auto mb-4 text-sm md:text-base">
            {questions[currentQuestion].prompt}
          </pre>
        </div>
        <div className="w-full lg:w-1/2">
          <CodeMirror value={code} height="400px" width="100%" extensions={[cpp()]} theme={dracula} onChange={handleCodeChange} />
          <div className="flex mt-2 space-x-2">
            <button onClick={() => handleCompileRun(false)} className="px-4 py-2 bg-blue-500 text-white rounded">Compile</button>
            <button onClick={() => handleCompileRun(true)} className="px-4 py-2 bg-green-500 text-white rounded">Run</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-yellow-500 text-white rounded">Submit</button>
          </div>
          <pre className="bg-gray-800 p-4 rounded-md w-full overflow-auto mt-4 text-sm md:text-base">
            Output: {compiling ? "Compiling..." : output}
          </pre>
        </div>
      </div>
      <p className="text-lg mt-4">IST Timer: <span className="font-bold text-red-400">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span></p>
      <p className="text-lg">Current Won: <span className="font-bold text-yellow-400">{won} Won</span></p>
    </div>
  );
};

export default RedLightGreenLight;

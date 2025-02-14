import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { dracula } from "@uiw/codemirror-theme-dracula";

// IMPORTANT: Replace with your actual server URL
const SERVER_URL = "/compile"; // Or your full URL: "http://your-server.com/compile"

const RedLightGreenLight = () => {
  const [won, setWon] = useState(100);
  const [isGreenLight, setIsGreenLight] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [redLightCount, setRedLightCount] = useState(0);
  const [redLightDuration, setRedLightDuration] = useState(5000);
  const [minRedLightInterval, setMinRedLightInterval] = useState(25000);
  const [maxRedLightInterval, setMaxRedLightInterval] = useState(35000);

  const questions = [
    "// Fix the bug in this function\nint add(int a, int b) {\n return a - b; // Incorrect operation\n}",
    "// Fix the bug in this function\n#include <stdio.h>\nint main() {\n  printf(\"Hello, world!\"); // Missing closing parenthesis\n  return 0;\n}",
    "// Fix the bug in this function\nvoid swap(int *a, int *b) {\n  int temp = *a;\n  *a = *b;\n  *b = temp; // Values are not swapped outside the function\n}"
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
    let timeout;

    const startRedLight = () => {
      setIsGreenLight(false);
      setRedLightCount(prevCount => prevCount + 1);
      timeout = setTimeout(() => {
        setIsGreenLight(true);
      }, redLightDuration);
    };

    const scheduleRedLight = () => {
      const randomInterval = Math.random() * (maxRedLightInterval - minRedLightInterval) + minRedLightInterval;
      setTimeout(startRedLight, randomInterval);
    };

    scheduleRedLight();

    const intervalId = setInterval(scheduleRedLight, maxRedLightInterval);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeout);
    };
  }, [redLightDuration, minRedLightInterval, maxRedLightInterval]);

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

  const compileCode = async () => {
    setOutput("Compiling...");

    try {
      const response = await fetch(SERVER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.error) {
        setOutput(`Error: ${data.error}`);
      } else if (data.result) {
        setOutput(data.result);
      } else {
        setOutput("Compilation failed.");
      }
    } catch (error) {
      console.error("Compilation error:", error);
      setOutput("Error compiling code.");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-black min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-6">Level 1: Red Light, Green Light (Debugging Battle)</h1>
      <p className="text-lg mb-2">Participants will compete in pairs from the start.</p>
      <p className="text-lg mb-2">Each pair starts with 100 won.</p>
      <p className="text-lg mb-2">A buggy code will be given along with an editor to fix it.</p>
      <p className="text-lg mb-4">Debugging is only allowed during the green light.</p>

      <div className={`px-4 py-2 rounded-full text-lg font-semibold mb-4 ${isGreenLight ? 'bg-green-500' : 'bg-red-500'}`}>
        {isGreenLight ? "Green Light - You can code!" : "Red Light - Stop coding!"}
      </div>

      <p className="text-lg">Current Won: <span className="font-bold text-yellow-400">{won} Won</span></p>
      <p className="text-lg">Time Left: <span className="font-bold text-red-400">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span></p>
      <p className="text-lg">Red Lights: <span className="font-bold text-red-500">{redLightCount}</span></p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl mt-6">
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-2">Debug this C Code:</h2>
          <pre className="p-2 bg-gray-900 rounded-lg overflow-auto text-sm">
            {questions[currentQuestion]}
          </pre>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-2">Your Code:</h2>
          <CodeMirror
            value={code}
            height="300px"
            extensions={[cpp()]}
            theme={dracula}
            onChange={handleCodeChange}
          />
        </div>
      </div>

      <div className="flex flex-col items-center mt-6">
        <button
          className="px-6 py-2 bg-blue-600 hover:bg-blue-800 text-white rounded-lg text-lg"
          onClick={compileCode}
          disabled={gameOver}
        >
          Compile & Run
        </button>
        <div className="p-4 mt-4 w-full max-w-2xl bg-gray-800 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-2">Output:</h2>
          <pre className="p-2 bg-gray-700 rounded-lg overflow-auto text-sm">{output}</pre>
        </div>
      </div>

      <div className="flex mt-4 gap-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}
          disabled={currentQuestion === 0}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={() => setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1))}
          disabled={currentQuestion === questions.length - 1}
        >
          Next
        </button>
      </div>

      {gameOver && <p className="mt-4 text-xl text-red-500 font-bold">Game Over! Level 1 is over.</p>}
    </div>
  );
};

export default RedLightGreenLight;
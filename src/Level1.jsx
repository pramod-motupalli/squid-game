import React, { useState, useEffect } from "react";

const DebuggingBattle = () => {
  const [won, setWon] = useState(100);
  const [isGreenLight, setIsGreenLight] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);

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
      setTimeout(() => setIsGreenLight(true), 5000);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleCodeChange = (e) => {
    if (!isGreenLight) {
      setWon((prevWon) => Math.max(prevWon - 5, 0));
    }
  };

  useEffect(() => {
    if (won < 75) {
      setGameOver(true);
    }
  }, [won]);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 min-h-screen text-white">
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
      <textarea
        className="w-full md:w-2/3 p-4 mt-4 bg-gray-800 text-white rounded-lg border border-gray-600 hover:border-blue-400"
        rows="6"
        value={questions[currentQuestion]}
        onChange={handleCodeChange}
        disabled={gameOver}
      />
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

export default DebuggingBattle;

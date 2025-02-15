import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { useNavigate } from "react-router-dom";

const COMPILERX_API_URL = "https://compilerx-api-url.com"; // Replace with actual URL
const COMPILERX_API_KEY = "your-api-key"; // Replace with actual API key

const DebuggingBattle = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [compiling, setCompiling] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState([]);

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

  const handleCodeChange = (value) => {
    setCode(value);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCode("");
      setOutput("");
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setCode("");
      setOutput("");
    }
  };
  
  const handleCompileRun = async () => {
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
      alert("Correct! You passed this challenge!");
      if (!completedQuestions.includes(currentQuestion)) {
        setCompletedQuestions([...completedQuestions, currentQuestion]);
      }
    } else {
      alert("Incorrect output. Try again!");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-black text-white relative w-full">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 text-center">
        Debugging Battle
      </h1>
      <div className="flex flex-col lg:flex-row w-full max-w-6xl space-y-4 lg:space-y-0 lg:space-x-4 relative">
        <div className="w-full lg:w-1/2 relative">
          <p className="text-lg font-bold">Question:</p>
          <pre className="bg-gray-800 p-4 rounded-md w-full overflow-auto mb-4 text-sm md:text-base select-none">
            {questions[currentQuestion].prompt}
          </pre>
          <div className="flex space-x-4 mt-4">
            <button onClick={handlePreviousQuestion} className="px-4 py-2 bg-blue-700 hover:bg-blue-900 text-white rounded" disabled={currentQuestion === 0}>Previous</button>
            <button onClick={handleNextQuestion} className="px-4 py-2 bg-green-500 hover:bg-emerald-700 text-white rounded" disabled={currentQuestion === questions.length - 1}>Next</button>
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <CodeMirror value={code} height="400px" width="100%" extensions={[cpp()]} theme={dracula} onChange={handleCodeChange} />
          <div className="flex mt-2 space-x-2">
            <button onClick={handleCompileRun} className="px-4 py-2 bg-green-500 hover:bg-green-800 text-white rounded">Run</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-yellow-500 hover:bg-amber-600 text-white rounded">Submit</button>
          </div>
          <pre className="bg-gray-800 p-4 rounded-md w-full overflow-auto mt-4 text-sm md:text-base">
            Output: {compiling ? "Compiling..." : output}
          </pre>
        </div>
      </div>
      <button
        onClick={() => navigate("/Level2instructions")}
        className="mt-6 px-6 py-3 text-lg font-bold rounded bg-teal-500 hover:bg-teal-700 text-white"
      >
        Next Level
      </button>
    </div>
  );
};

export default DebuggingBattle;

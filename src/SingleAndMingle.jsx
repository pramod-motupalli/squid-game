import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { useNavigate } from "react-router-dom";

const squidGameMusic = "/images/SingleAndMingle.mp3";
const BACKEND_API_URL = "http://localhost:5000/compile"; // Update with actual backend URL

const SingleAndMingle = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userCode, setUserCode] = useState({});
  const [output, setOutput] = useState("");
  const [compiling, setCompiling] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);

  // Play background music on load
  useEffect(() => {
    const audio = new Audio(squidGameMusic);
    audio.loop = true;
    audio.play().catch((error) =>
      console.error("Audio playback failed:", error)
    );
  }, []);

  // Load questions from localStorage or select them once and store them
  useEffect(() => {
    const storedQuestions = localStorage.getItem("singleAndMingleQuestions");
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    } else {
      const allQuestions = [
        {
          prompt:
            "Fix the bug in this function:\nint add(int a, int b) {\n  return c - b; // Incorrect operation\n}",
          expected: "15\n",
        },
        {
          prompt:
            "Write a C program to print the first 10 terms of the Fibonacci series using both loops and recursion.",
          expected: "0 1 1 2 3 5 8 13 21 34",
        },
        {
          prompt:
            'Fix the bug in this function:\n#include <stdio.h>\nint main() {\n  printf("Hello, world!"); // Missing closing parenthesis fixed\n  return 0;\n}',
          expected: "Hello, world!",
        },
        {
          prompt:
            "Fix the bug in this function:\nvoid swap(int a, int b) {\n  int temp = a;\n  a = b;\n  b = temp; // Values are not swapped outside the function\n}",
          expected: "Swapped successfully\n",
        },
      ];
      // Randomize once, then persist the selected questions (for example, pick 2)
      const selectedQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 2);
      setQuestions(selectedQuestions);
      localStorage.setItem("singleAndMingleQuestions", JSON.stringify(selectedQuestions));
    }
  }, []);

  // Clear output when switching questions
  useEffect(() => {
    if (questions.length > 0) {
      setOutput("");
    }
  }, [currentQuestion, questions]);

  const handleCodeChange = (value) => {
    setUserCode((prevCode) => ({
      ...prevCode,
      [currentQuestion]: value,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleCompileRun = async () => {
    setCompiling(true);
    try {
      const response = await fetch(BACKEND_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: userCode[currentQuestion] || "",
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
    const expectedOutput = questions[currentQuestion].expected;
    if ((output || "").trim() === expectedOutput.trim()) {
      alert("Correct! You passed this challenge!");
      if (!completedQuestions.includes(currentQuestion)) {
        setCompletedQuestions([...completedQuestions, currentQuestion]);
      }
    } else {
      alert("Incorrect output. Try again!");
    }
  };

  if (questions.length === 0) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-black text-white w-full">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 text-center">
        Debugging Battle
      </h1>
      <div className="flex flex-col lg:flex-row w-full max-w-6xl space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Question Section */}
        <div className="w-full lg:w-1/2">
          <p className="text-lg font-bold">Question:</p>
          <pre className="bg-gray-800 p-4 rounded-md w-full overflow-auto mb-4 text-sm md:text-base select-none">
            {questions[currentQuestion].prompt}
          </pre>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handlePreviousQuestion}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-900 text-white rounded"
              disabled={currentQuestion === 0}
            >
              Previous
            </button>
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 bg-green-500 hover:bg-emerald-700 text-white rounded"
              disabled={currentQuestion === questions.length - 1}
            >
              Next
            </button>
          </div>
        </div>
        {/* Code Editor Section */}
        <div className="w-full lg:w-1/2">
          <CodeMirror
            value={userCode[currentQuestion] || ""}
            height="400px"
            width="100%"
            extensions={[cpp()]}
            theme={dracula}
            onChange={handleCodeChange}
          />
          <div className="flex mt-2 space-x-2">
            <button
              onClick={handleCompileRun}
              className="px-4 py-2 bg-green-500 hover:bg-green-800 text-white rounded"
            >
              Run
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-yellow-500 hover:bg-amber-600 text-white rounded"
            >
              Submit
            </button>
          </div>
          <pre className="bg-gray-800 p-4 rounded-md w-full overflow-auto mt-4 text-sm md:text-base">
            Output: {compiling ? "Compiling..." : output}
          </pre>
        </div>
      </div>
      <button
        onClick={() => navigate("/thank-you")}
        className="mt-6 px-6 py-3 text-lg font-bold rounded bg-teal-500 text-white"
      >
        Thank You!!!
      </button>
    </div>
  );
};

export default SingleAndMingle;

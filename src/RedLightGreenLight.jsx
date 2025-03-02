import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { useNavigate } from "react-router-dom";
import { EditorView } from "@codemirror/view";

const disableCopyPaste = EditorView.domEventHandlers({
  copy: (event, view) => {
    event.preventDefault();
    return true;
  },
  cut: (event, view) => {
    event.preventDefault();
    return true;
  },
  paste: (event, view) => {
    event.preventDefault();
    return true;
  }
});

const squidGameMusic = "/public/images/squid game music.mpeg";
const COMPILERX_API_URL = "http://localhost:5000/compile";

const RedLightGreenLight = () => {
  const navigate = useNavigate();

  // On a new login (detected via localStorage flag "newLogin"), reset game state.
  useEffect(() => {
    if (localStorage.getItem("newLogin") === "true") {
      localStorage.setItem("won", "100");
      localStorage.setItem("timeLeft", "600");
      localStorage.setItem("currentQuestion", "0");
      localStorage.setItem("completedQuestions", JSON.stringify([]));
      localStorage.removeItem("newLogin");
    }
  }, []);

  // Initialize state using localStorage values (or default if not set)
  const [won, setWon] = useState(() => {
    const stored = localStorage.getItem("won");
    return stored ? Number(stored) : 100;
  });
  const [timeLeft, setTimeLeft] = useState(() => {
    const stored = localStorage.getItem("timeLeft");
    return stored ? Number(stored) : 600;
  });
  const [currentQuestion, setCurrentQuestion] = useState(() => {
    const stored = localStorage.getItem("currentQuestion");
    return stored ? Number(stored) : 0;
  });
  const [completedQuestions, setCompletedQuestions] = useState(() => {
    const stored = localStorage.getItem("completedQuestions");
    return stored ? JSON.parse(stored) : [];
  });
  
  const [isGreenLight, setIsGreenLight] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [codeMap, setCodeMap] = useState({});
  const [output, setOutput] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [compiling, setCompiling] = useState(false);
  const [audio] = useState(() => new Audio(squidGameMusic));

  const questions = [
    {
      prompt:
        "// Fix the bug in this function\n#include <stdio.h>\nint main() {\n  for(i=0;i<10;i+)\n{\nprint('Hello')}\n  return 0;\n}",
      expected: "HelloHelloHelloHelloHelloHelloHelloHelloHelloHello",
    },
    {
      prompt:
        "// Fix the bug in this function\n #include <stdio.h>\nint main() {\n  int a = 5\n  int b = 3\n scan('%d %d', &a, &b);\n print('%d'a * b)\n return 0;\n}",
      expected: "15",
    },
    {
      prompt:
        "// Fix the bug in this function\n Swapping of two number without using third variable\n #include<studio.h>\n void main(){\n int a=5,b=10\n a=b+a;\n b=a-b;\n a=a+b;\n printf('a= d b= %d',a,b);}",
      expected: "a=10 b=5",
    },
  ];

  // Update expected output when current question changes
  useEffect(() => {
    setExpectedOutput(questions[currentQuestion].expected);
  }, [currentQuestion]);

  // Persist state changes in localStorage
  useEffect(() => {
    localStorage.setItem("won", won.toString());
  }, [won]);

  useEffect(() => {
    localStorage.setItem("currentQuestion", currentQuestion.toString());
  }, [currentQuestion]);

  useEffect(() => {
    localStorage.setItem("completedQuestions", JSON.stringify(completedQuestions));
  }, [completedQuestions]);

  // Countdown timer: update timeLeft every second and persist it.
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          const newTime = prevTime - 1;
          localStorage.setItem("timeLeft", newTime.toString());
          return newTime;
        }
        return 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-navigate when timeLeft reaches 0 and conditions are met.
  useEffect(() => {
    if (timeLeft === 0) {
      if (completedQuestions.length === questions.length && won >= 70) {
        navigate("/Level2instructions");
      } else {
        alert("Not qualified! Either not all questions are completed or you did not score enough Won.");
      }
    }
  }, [timeLeft, completedQuestions, won, navigate, questions.length]);

  // Manage red/green light transitions and audio playback
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGreenLight(false);
      audio.play().catch((error) => console.log("Audio play blocked:", error));

      const randomRedLightDuration = Math.floor(Math.random() * 11) + 5; // Random 5-15 sec
      setTimeout(() => {
        setIsGreenLight(true);
        audio.pause();
        audio.currentTime = 0;
      }, randomRedLightDuration * 1000);
    }, 30000);

    return () => {
      clearInterval(interval);
      audio.pause();
    };
  }, [audio]);

  useEffect(() => {
    if (won < 70) {
      setGameOver(true);
    }
  }, [won]);

  // Update code for the current question without clearing previous entries
  const handleCodeChange = (value) => {
    if (!isGreenLight) {
      setWon((prevWon) => Math.max(prevWon - 2, 0));
    }
    setCodeMap((prev) => ({ ...prev, [currentQuestion]: value }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setOutput("");
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setOutput("");
    }
  };

  const handleCompileRun = async () => {
    setCompiling(true);
    try {
      const response = await fetch(COMPILERX_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: "c",
          code: codeMap[currentQuestion] || "",
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

  // On submission, update won and mark the current question as completed.
  const handleSubmit = () => {
    if (output.trim() === expectedOutput.trim()) {
      if (!completedQuestions.includes(currentQuestion)) {
        setWon((prevWon) => prevWon + 10);
        setCompletedQuestions((prev) => [...prev, currentQuestion]);
        alert(`Correct! You earned 10 Won! Completed Questions: ${completedQuestions.length + 1}`);
      } else {
        alert("You've already completed this question. Move to the next one!");
      }
    } else {
      setWon((prevWon) => Math.max(prevWon - 10, 0));
      alert("Incorrect output. You lost 10 Won!");
    }
  };

  const markLevel1Complete = async () => {
    const username = localStorage.getItem("username");
    if (!username) {
      console.error("No username found in localStorage");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/updatelevel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, level1: true }),
      });
      const data = await response.json();
      if (data) {
        navigate("/Level2instructions");
      } else {
        console.error("Error updating level:", data.message);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  return (
    <div
      className={`flex flex-col items-center p-6 min-h-screen bg-black text-white relative w-full 
      ${
        !isGreenLight
          ? "border-8 border-red-500 animate-pulse shadow-[0px_0px_50px_rgba(255,0,0,0.8)] before:content-[''] before:absolute before:inset-0 before:bg-red-600 before:blur-[80px] before:opacity-50"
          : ""
      }`}
    >
      <h1 className="text-2xl md:text-4xl font-bold mb-6 text-center">
        Level 1: Red Light, Green Light (Debugging Battle)
      </h1>
      <div className="flex flex-col lg:flex-row w-full max-w-6xl space-y-4 lg:space-y-0 lg:space-x-4 relative">
        <div className="w-full lg:w-1/2 relative">
          <p className="text-lg font-bold">Question:</p>
          {!isGreenLight && (
            <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50">
              <img
                src="/images/dollred.jpg"
                alt="Squid Game Doll"
                className="w-96 md:w-96 h-48 md:h-96 animate-pulse"
              />
            </div>
          )}
          <pre
            className="bg-gray-800 p-4 rounded-md w-full overflow-auto mb-4 text-sm md:text-base select-none"
            onContextMenu={(e) => e.preventDefault()}
            onCopy={(e) => e.preventDefault()}
            style={{ userSelect: "none", cursor: "default" }}
          >
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
        <div className="w-full lg:w-1/2">
          <CodeMirror
            value={codeMap[currentQuestion] || ""}
            height="400px"
            width="100%"
            extensions={[cpp(), disableCopyPaste]}
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
      <p className="text-lg mt-4">
        IST Timer:{" "}
        <span className="font-bold text-red-400">
          {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </span>
      </p>
      <p className="text-lg">
        Current Won:{" "}
        <span className="font-bold text-yellow-400">{won} Won</span>
      </p>
      <button
        onClick={markLevel1Complete}
        className="mt-6 px-6 py-3 text-lg font-bold rounded bg-teal-500 hover:bg-teal-700 text-white"
      >
        Next Level
      </button>
    </div>
  );
};

export default RedLightGreenLight;

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
  },
});

const squidGameMusic = "/public/images/squid game music.mpeg";
const COMPILERX_API_URL = "http://localhost:5000/compile";

// Admin-provided start time and game duration (in seconds)
const adminStartTime = new Date("2025-03-04T23:56:00"); //Replace with admin-provid2ed timest3amp
const gameDuration = 600; // Game duration in seconds
const targetTime = new Date(adminStartTime.getTime() + gameDuration * 1000);

const RedLightGreenLight = () => {
  const navigate = useNavigate();

  // Reset state on new login (except for the timer which is fixed by admin)
  useEffect(() => {
    if (localStorage.getItem("newLogin") === "true") {
      // We no longer persist game state in localStorage;
      // instead, it is immediately updated in the DB.
      localStorage.removeItem("newLogin");
    }
  }, []);

  // Won value comes from the database, default to 100
  const [won, setWon] = useState(100);
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(Math.floor((targetTime - Date.now()) / 1000), 0)
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState([]);
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
    // {
    //   prompt:
    //   "// Fix the bug in this code\n#include <stdio.h>\nvoid Fib(int n) {\n int f1= 0, f2 = 1, next;\nprintf('Fibonacci Series: %d %d', f1,f2);\nfor (int i = 2,i < n, i++) {\nnext = f1 + f2;\nprintf('%lld', next);\nf1 = f2;\nf2 = next;\n}\nprintf(''\n'');\n}\nint main() {\nint n = 10;\nFib(n);\nreturn 0;\n }",
    //   expected: "Fibonacci Series:0 112358132134",
    // },
    {
      prompt:
        "// Fix the bug in this code\n#include <stdoi.h>\nint isPrime(int n) {\n if (n < 2) return 0\nfor (int i = 2, i * i <= n; i++) {\nif (n % i == 0) return 0;}\nreturn 1;\n}\nint main() {\nint num = 483187726;\nprintf(%d is %s prime number., num, isPrime(num) ? '''   ''' : 'not a ');\nreturn 0;\n}",

      expected: "483187726 is not a prime number",
    },
    {
      prompt:
        "// Fix the bug in this code\n#include <stdio.h>\nint sumOfDigits(int n) {\nint sum = 0;\nwhile (n > 0)\n{\nsum += n % 10; \nn =n/10; \n}\nreturn s;\nint main() {\nint num = 30213468; \n printf('Sum of digits of %d is %d', num, sumOfDigits(num));\n return 0,\n}",

      expected: "9",
    },
  ];

  // Update expected output when current question changes
  useEffect(() => {
    setExpectedOutput(questions[currentQuestion].expected);
  }, [currentQuestion]);

  // Retrieve the won value from the backend
  useEffect(() => {
    const fetchWon = async () => {
      const username = localStorage.getItem("username");
      if (username) {
        try {
          const response = await fetch(
            `http://localhost:5000/users/${username}`
          );
          const data = await response.json();
          if (data.won) {
            setWon(data.won);
          } else {
            setWon(100);
          }
        } catch (err) {
          console.error("Error fetching won:", err);
          setWon(100);
        }
      } else {
        setWon(100);
      }
    };
    fetchWon();
  }, []);

  // Update game state in the database whenever currentQuestion or completedQuestions change.
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) return;
    fetch("http://localhost:5000/updategamestate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, currentQuestion, completedQuestions }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Game state updated in DB:", data))
      .catch((err) => console.error("Error updating game state:", err));
  }, [currentQuestion, completedQuestions]);

  // Real-time timer sync using admin-provided targetTime.
  useEffect(() => {
    const timerInterval = setInterval(() => {
      const newTimeLeft = Math.max(
        Math.floor((targetTime - Date.now()) / 1000),
        0
      );
      setTimeLeft(newTimeLeft);
      if (newTimeLeft === 0) {
        clearInterval(timerInterval);
        if (completedQuestions.length === questions.length && won >= 70) {
          navigate("/Level2instructions");
        } else {
          setGameOver(true);
          alert("Game over! You did not qualify. Please relogin to try again.");
        }
      }
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [completedQuestions, questions.length, won, navigate]);

  // Manage red/green light transitions and audio playback.
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGreenLight(false);
      audio.play().catch((error) => console.log("Audio play blocked:", error));
      const randomRedLightDuration = Math.floor(Math.random() * 11) + 5; // 5-15 sec
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

  // Update the won value in the database.
  const updateWonInDB = (newWon) => {
    const username = localStorage.getItem("username");
    if (!username) return;
    fetch("http://localhost:5000/updatewon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, won: newWon }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Won updated in DB:", data))
      .catch((err) => console.error("Error updating won:", err));
  };

  // Update code for the current question. Deduct 2 won if not green light.
  const handleCodeChange = (value) => {
    if (!isGreenLight) {
      setWon((prevWon) => {
        const newWon = Math.max(prevWon - 2, 0);
        updateWonInDB(newWon);
        return newWon;
      });
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

  // On submission, update won via the database and mark the question as completed.
  const handleSubmit = () => {
    if (output.trim() === expectedOutput.trim()) {
      if (!completedQuestions.includes(currentQuestion)) {
        const newWon = won + 10;
        setWon(newWon);
        updateWonInDB(newWon);
        setCompletedQuestions((prev) => [...prev, currentQuestion]);
        alert(
          `Correct! You earned 10 Won! Completed Questions: ${
            completedQuestions.length + 1
          }`
        );
      } else {
        alert("You've already completed this question. Move to the next one!");
      }
    } else {
      const newWon = Math.max(won - 10, 0);
      setWon(newWon);
      updateWonInDB(newWon);
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

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <h1 className="text-3xl font-bold mb-4">Game Over</h1>
        <p className="mb-4">
          Your time has ended. Please relogin to try again.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center p-6 min-h-screen bg-black text-white relative w-full 
      ${
        !isGreenLight
          ? "border-8 border-red-500 animate-pulse shadow-[0px_0px_50px_rgba(255,0,0,0.8)] before:content-[''] before:absolute before:inset-0 before:bg-red-600 before:blur-[80px] before:opacity-50"
          : ""
      }`}
    >
      <div className="absolute top-4 left-4 px-8 py-4 rounded-md text-yellow-400 font-bold text-xl">
        Player ID: {localStorage.getItem("playerid") || "Guest"}
      </div>
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

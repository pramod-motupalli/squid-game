import React, { useState, useEffect, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { useNavigate } from "react-router-dom";
import { EditorView } from "@codemirror/view";
import { motion, useAnimation } from "framer-motion";

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
const COMPILERX_API_URL = "https://squidgamebackend.onrender.com/compile";

// Admin-provided start time and game duration (in seconds)
const adminStartTime = new Date("2025/03/08 16:10:00"); // Replace with admin-provided timestamp
const gameDuration = 600; // Game duration in seconds
const targetTime = new Date(adminStartTime.getTime() + gameDuration * 1000);

const RedLightGreenLight = () => {
  const navigate = useNavigate();
  const tugWarControls = useAnimation();

  // Custom blood alert state
  const [bloodAlert, setBloodAlert] = useState(null);

  // Helper to show our custom alert
  const showBloodAlert = (
    message,
    onClose,
    buttonText = "OK",
    title = "Blood Bath Alert!"
  ) => {
    setBloodAlert({ message, onClose, buttonText, title });
  };

  // Reset state on new login
  useEffect(() => {
    if (localStorage.getItem("newLogin") === "true") {
      localStorage.removeItem("newLogin");
    }
  }, []);

  const [won, setWon] = useState(100);
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(Math.floor((targetTime - Date.now()) / 1000), 0)
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [isGreenLight, setIsGreenLight] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [output, setOutput] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [compiling, setCompiling] = useState(false);
  const [audio] = useState(() => new Audio(squidGameMusic));
  const username = localStorage.getItem("username");
  const [userCode, setUserCode] = useState({});

  const questions = [
    {
      prompt:
        "// Fix the bug in this function\n#include <stdio.h>\nint main() {\n  for(i=0;i<10;i+)\n{\nprint('Hello')}\n  return 0;\n}",
      expected: "HelloHelloHelloHelloHelloHelloHelloHelloHelloHello",
    },
    {
      prompt:
        "// Fix the bug in this code\ninclude <stduio.h>\nint isPrime(it num) {\nif (num < 2) return 0, \nfor ( i = 2, i * i <= num; i+) {\nif (num % i == 0) return 0,\n}\n return 1;\n}\nint main() {\nint number=31847726;\nif (isPrime(num)){\nprinf('%d is a prime number.', number);\nelse{\nprntf('%d is not a prime number.', num);\n return 0;\n}",
      expected: "31847726 is not a prime number.",
    },
    {
      prompt:
        "// Fix the bug in this code\n#incude <stdoi.h>\nint sumOfDigits(int n) {\nint sum = 0;\nwhle (n > 0)\n{\nsum += n % (100/10); \nn =n/10; \n}\nreturn s;\nint man() {\nint num = 30213468; \n print('Sum of digits of %D is %D', num, sumOfDigits(num));\n return 0,\n}",
      expected: "Sum of digits of 30213468 is 27",
    },
  ];

  // Update expected output when current question changes
  useEffect(() => {
    setExpectedOutput(questions[currentQuestion].expected);
  }, [currentQuestion]);

  // Fetch saved code from the database on mount
  useEffect(() => {
    async function fetchSavedCode() {
      try {
        const username = localStorage.getItem("username");
        const response = await fetch(
          "https://squidgamebackend.onrender.com/fetch-code1",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
          }
        );
        const data = await response.json();
        console.log(data);
        let savedCode1 = { ...userCode };
        if (data.level1Q1) {
          savedCode1[0] = data.level1Q1;
        }
        if (data.level1Q2) {
          savedCode1[1] = data.level1Q2;
        }
        if (data.level1Q3) {
          savedCode1[2] = data.level1Q3;
        }
        setUserCode(savedCode1);
      } catch (err) {
        console.error("Error fetching saved code", err);
      }
    }
    fetchSavedCode();
  }, []);

  // Retrieve the won value from the backend
  useEffect(() => {
    const fetchWon = async () => {
      const username = localStorage.getItem("username");
      if (username) {
        try {
          const response = await fetch(
            "https://squidgamebackend.onrender.com/users1",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username }),
            }
          );
          const data = await response.json();
          console.log(data.user.won);
          setWon(data.user.won || 100);
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

  // Update game state in the database when currentQuestion or completedQuestions change.
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) return;
    fetch("https://squidgamebackend.onrender.com/updategamestate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Game state updated in DB:", data))
      .catch((err) => console.error("Error updating game state:", err));
  }, [currentQuestion, completedQuestions]);

  // Real-time timer sync using admin-provided targetTime.
  const handleGameOver = useCallback(async () => {
    try {
      const username = localStorage.getItem("username");
      const response = await fetch(
        "https://squidgamebackend.onrender.com/eliminateUser",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, eliminated: true }),
        }
      );
      if (response.ok) {
        navigate("/Thankyou");
      } else {
        console.error("Failed to mark user as eliminated.");
      }
    } catch (error) {
      console.error("Error updating elimination status:", error);
    }
  }, [navigate]);

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
          // When alert is acknowledged, handleGameOver is called
          showBloodAlert(
            "Game over!!!",
            handleGameOver,
            "Farewell",
            "Blood Bath Finale"
          );
        }
      }
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [
    targetTime,
    completedQuestions,
    questions.length,
    won,
    navigate,
    handleGameOver,
    showBloodAlert,
  ]);

  // Manage red/green light transitions and audio playback.
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGreenLight(false);
      audio.play().catch((error) => console.log("Audio play blocked:", error));
      const redLightDuration = 5; // exactly 31 seconds
      setTimeout(() => {
        setIsGreenLight(true);
        audio.pause();
        audio.currentTime = 0;
      }, redLightDuration * 1000);
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
    fetch("https://squidgamebackend.onrender.com/updatewon", {
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
    setUserCode((prev) => ({ ...prev, [currentQuestion]: value }));
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
          code: userCode[currentQuestion] || "",
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

  // On submission, update won via the database, mark the question as completed,
  // and automatically progress to the next question if available.
  const handleSubmit = async () => {
    if (output.trim() === expectedOutput.trim()) {
      if (!completedQuestions.includes(currentQuestion)) {
        const newWon = won + 10;
        setWon(newWon);
        updateWonInDB(newWon);
        setCompletedQuestions((prev) => [...prev, currentQuestion]);
        showBloodAlert(
          `Correct! You earned 10 Won! Completed Questions: ${
            completedQuestions.length + 1
          }`,
          () => {},
          "Continue",
          "Slaughter of Success!"
        );
        // Automatically go to the next question if available.
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion((prev) => prev + 1);
        }
        // Determine the field name for saving code.
        let questionField = "";
        if (currentQuestion === 0) {
          questionField = "level1Q1";
        } else if (currentQuestion === 1) {
          questionField = "level1Q2";
        } else if (currentQuestion === 2) {
          questionField = "level1Q3";
        }
        if (questionField) {
          try {
            const response = await fetch(
              "https://squidgamebackend.onrender.com/savecode1",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  username: username,
                  question: questionField,
                  code: userCode[currentQuestion] || "",
                }),
              }
            );
            console.log(response);
            console.log(`Saved code for ${questionField}`);
          } catch (error) {
            console.error("Error saving code:", error);
          }
        }
      } else {
        showBloodAlert(
          "You've already completed this question. Move to the next one!",
          () => {}
        );
      }
    } else {
      const newWon = Math.max(won - 10, 0);
      setWon(newWon);
      updateWonInDB(newWon);
      showBloodAlert("Incorrect output. You lost 10 Won!", () => {});
    }
  };

  const markLevel1Complete = async () => {
    const username = localStorage.getItem("username");
    if (!username) {
      console.error("No username found in localStorage");
      return;
    }
    try {
      const response = await fetch(
        "https://squidgamebackend.onrender.com/updatelevel",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, level1: true }),
        }
      );
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
        <button
          onClick={() => navigate("/Thankyou")}
          className="mt-6 px-6 py-3 text-lg font-bold rounded bg-teal-500 text-white"
        >
          Thank You!!!
        </button>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center p-6 min-h-screen bg-black text-white w-full relative 
      ${
        !isGreenLight
          ? "border-8 border-red-500 animate-pulse shadow-[0px_0px_50px_rgba(255,0,0,0.8)] before:content-[''] before:absolute before:inset-0 before:bg-red-600 before:blur-[80px] before:opacity-50"
          : ""
      }`}
    >
      {/* Player ID at the top left corner */}
      <div className="absolute top-4 left-4 px-8 py-4 rounded-md text-yellow-400 font-bold text-xl">
        Player ID: {localStorage.getItem("playerid") || "Guest"}
      </div>
      {/* Timer positioned at the top right corner */}
      <div className="absolute top-4 right-4 px-8 py-4 rounded-md text-red-400 font-bold text-xl">
        ⏳ Time Left: {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, "0")}
      </div>
      <h1 className="text-2xl md:text-4xl font-bold mb-6 text-center">
        Level 1: Red Light, Green Light
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
            value={userCode[currentQuestion] || ""}
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

      {/* Custom Blood Alert Modal */}
      {bloodAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="bg-red-800 border-4 border-red-500 p-8 rounded-lg shadow-xl text-center animate-pulse">
            <h2 className="text-3xl font-bold text-white mb-4">
              {bloodAlert.title}
            </h2>
            <p className="text-xl text-white">{bloodAlert.message}</p>
            <button
              className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded"
              onClick={() => {
                setBloodAlert(null);
                bloodAlert.onClose && bloodAlert.onClose();
              }}
            >
              {bloodAlert.buttonText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedLightGreenLight;

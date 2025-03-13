import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { useNavigate } from "react-router-dom";
import { EditorView } from "@codemirror/view";

// Disable cut, copy and paste in the editor.
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

const squidGameMusic = "/images/SingleAndMingle.mp3";
const BACKEND_COMPILE_URL = "https://squidgamebackend.onrender.com/compile";
const BACKEND_SAVE_CODE_URL = "https://squidgamebackend.onrender.com/savecode";
const BACKEND_FETCH_CODE_URL = "https://squidgamebackend.onrender.com/fetch-code";

const SingleAndMingle = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userCode, setUserCode] = useState({});
  const [output, setOutput] = useState("");
  const [compiling, setCompiling] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [bloodAlert, setBloodAlert] = useState(null);
  // New state to track if the code has been run.
  const [hasRun, setHasRun] = useState(false);
  const username = localStorage.getItem("username");

  // Helper to show our custom alert modal.
  const showBloodAlert = (title, message, buttonText, onClose, variant = "") => {
    setBloodAlert({ title, message, buttonText, onClose, variant });
  };

  // Play background music on load.
  useEffect(() => {
    const audio = new Audio(squidGameMusic);
    audio.loop = true;
    audio
      .play()
      .catch((error) => console.error("Audio playback failed:", error));
  }, []);
  const targetTime = new Date("2025-03-13 11:37:00");
  // Timer: Synchronize against a fixed deadline.
  useEffect(() => {
    
    const computeTimeLeft = () => {
      const now = new Date();
      const diff = Math.floor((targetTime - now) / 1000);
      return diff > 0 ? diff : 0;
    };

    setTimeLeft(computeTimeLeft());
   
    const interval = setInterval(() => {
      setTimeLeft(computeTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
useEffect(() => {
    const fetchPlayerId = async () => {
      const username = localStorage.getItem("username");
      if (!username) {
        setError("Username not found in localStorage");
        // setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://squidgamebackend.onrender.com/api/player",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
          }
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error("Network response was not ok: " + text);
        }

        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          const rawText = await response.text();
          try {
            data = JSON.parse(rawText);
          } catch (parseError) {
            throw new Error(
              "Failed to parse JSON from response: " + parseError.message
            );
          }
        }
        if (data && data.playerId) {
          // setPlayerId(data.playerId);
          localStorage.setItem("playerid", data.playerId);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        console.error("Error fetching player ID:", err);
        setError(err.message);
      } finally {
        // setLoading(false);
      }
    };

    fetchPlayerId();
  }, []);
  // Load questions from localStorage or select them once and store them.
  useEffect(() => {
    const storedQuestions = localStorage.getItem("singleAndMingleQuestions");
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    } else {
      const allQuestions = [
        {
          prompt:
            "// Function to convert a string to lowercase \n //the string is SquidGame.CreSenCe2k25",
          expected: "squidgame.cresence2k25",
        },
        {
          prompt:
            "//Subtract product and sum of digits \nInitialize product to 1.Initialize sum to 0.\nWhile n is greater than 0 do:\nLet digit be the remainder when n is divided by 10.\nMultiply product by digit.\nAdd digit to sum.\nUpdate n by performing integer division by 10.\nEnd While\nReturn the difference: product - sum.\nvalue=31726.",
          expected: "233",
        },
        {
          prompt:
            "write c program to print the trailing zeroes\nStart\nInitialize a variable count = 0 (to store the number of trailing zeroes).\nSet a divisor i = 5.\nLoop while n / i >= 1:\nAdd n / i to count (integer division).\nMultiply i by 5 (i = i * 5).\nEnd loop when n / i < 1.\nReturn count as the final number of trailing zeroes.\nn=100\nEnd",
          expected: "24",
        },
        {
          prompt:
            "Complete the searching algorithm's code.\n Initialize low = 0 and high = n-1.\nRepeat while low <= high:\nFind the middle element: mid = (low + high) / 2.\nIf arr[mid] == target, return mid (element found).\nIf arr[mid] > target, search in the left half (high = mid - 1).\nIf arr[mid] < target, search in the right half (low = mid + 1).\nIf not found, return -1.\nint arr[] = {34, 12, 9, 56, 23, 78, 5, 45};\nint target = 23;",
          expected: "3",
        },
      ];
      const selectedQuestions = allQuestions
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      setQuestions(selectedQuestions);
      localStorage.setItem(
        "singleAndMingleQuestions",
        JSON.stringify(selectedQuestions)
      );
    }
  }, []);

  // Fetch saved code from the database on mount.
  useEffect(() => {
    async function fetchSavedCode() {
      try {
        const response = await fetch(BACKEND_FETCH_CODE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });
        const data = await response.json();
        console.log(data);
        let savedCode = { ...userCode };
        if (data.level3Q1) {
          savedCode[0] = data.level3Q1;
        }
        if (data.level3Q2) {
          savedCode[1] = data.level3Q2;
        }
        setUserCode(savedCode);
      } catch (err) {
        console.error("Error fetching saved code", err);
      }
    }
    fetchSavedCode();
  }, []);

  // Clear output when switching questions.
  useEffect(() => {
    if (questions.length > 0) {
      setOutput("");
    }
  }, [currentQuestion, questions]);

  // Update code and reset the run status.
  const handleCodeChange = (value) => {
    setHasRun(false);
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
      const response = await fetch(BACKEND_COMPILE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: userCode[currentQuestion] || "",
        }),
      });
      const result = await response.json();
      setOutput(result.output || "Error in execution");
      // Mark that the code has been run.
      setHasRun(true);
    } catch (error) {
      console.error("Error compiling:", error);
      setOutput("Compilation Error");
    }
    setCompiling(false);
  };

  const handleSubmit = async () => {
    const expected = questions[currentQuestion].expected;
    if ((output || "").trim() === expected.trim()) {
      showBloodAlert(
        "Blood Bath Victory!",
        "Correct! You passed this challenge!",
        "Continue",
        () => {
          if (!completedQuestions.includes(currentQuestion)) {
            setCompletedQuestions((prev) => [...prev, currentQuestion]);
          }
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
          }
        }
      );
      let questionField = "";
      if (currentQuestion === 0) {
        questionField = "level3Q1";
      } else if (currentQuestion === 1) {
        questionField = "level3Q2";
      }
      if (questionField) {
        try {
          await fetch(BACKEND_SAVE_CODE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username,
              question: questionField,
              code: userCode[currentQuestion] || "",
            }),
          });
          console.log(`Saved code for ${questionField}`);
        } catch (error) {
          console.error("Error saving code:", error);
        }
      }
    } else {
      showBloodAlert("Crimson Defeat!", "Incorrect output. Try again!", "Retry");
    }
  };

  // Final submission handler.
  const handleFinalSubmit = async () => {
    const confirmSubmit = window.confirm("Are you sure you want to submit?");
    if (!confirmSubmit) return;

    const marksGained = completedQuestions.length * 50;
    try {
      const response = await fetch("https://squidgamebackend.onrender.com/finalsubmit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          timeLeft,
          marksGained,
        }),
      });
      if (response.ok) {
        console.log("Final submission updated successfully.");
        showBloodAlert(
          "Final Bloodshed!",
          "Your final submission is successful. Prepare to meet your fate...",
          "Proceed",
          () => navigate("/Thankyou"),
          "final"
        );
      } else {
        console.error("Final submission failed.");
        showBloodAlert(
          "Bloody Error!",
          "There was an error with final submission. Please try again.",
          "Retry"
        );
      }
    } catch (error) {
      console.error("Error in final submission:", error);
      showBloodAlert(
        "Crimson Catastrophe!",
        "An error occurred during final submission.",
        "Retry"
      );
    }
  };


  // Format timeLeft as mm:ss.
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  if (questions.length === 0) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-black text-white w-full relative">
      {/* Player ID */}
      <div className="absolute top-4 left-4 px-8 py-4 rounded-md text-yellow-400 font-bold text-xl">
        Player ID: {localStorage.getItem("playerid")}
      </div>
      {/* Timer */}
      <div className="absolute top-4 right-4 px-8 py-4 rounded-md text-red-400 font-bold text-xl">
        ⏳ Time Left: {formattedTime}
      </div>
      <h1 className="text-2xl md:text-4xl font-bold mb-6 text-center">
        Single And Mingle
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
              disabled={!hasRun}
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
        onClick={handleFinalSubmit}
        className="mt-6 px-6 py-3 text-lg font-bold rounded bg-teal-500 text-white"
      >
        FinalSubmit
      </button>

      {/* Custom Blood-Bath Alert Modal */}
      {bloodAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div
            className={`bg-green-900 border-4 border-breen-700 p-8 rounded-lg text-center animate-pulse ${
              bloodAlert.variant === "final" ? "shadow-2xl" : ""
            }`}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              {bloodAlert.title}
            </h2>
            <p className="text-xl text-white">{bloodAlert.message}</p>
            <button
              onClick={() => {
                setBloodAlert(null);
                if (bloodAlert.onClose) bloodAlert.onClose();
              }}
              className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded"
            >
              {bloodAlert.buttonText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleAndMingle;

import React, { useState, useEffect, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";

const TugOfWar = () => {
  const navigate = useNavigate();

  // Duration of the challenge in seconds (15 minutes)
  const challengeDuration = 900;

  const [challengeStartTime, setChallengeStartTime] = useState(null);
  useEffect(() => {
    function fetchChallengeStartTime() {
      try {
        const simulatedStartTime = new Date("2025-03-13T9:45:00");
        setChallengeStartTime(simulatedStartTime);
      } catch (error) {
        console.error("Failed to fetch challenge start time:", error);
      }
    }
    fetchChallengeStartTime();
  }, []);

  // Calculate the target time (challenge end time) when challengeStartTime is available.
  const targetTime = challengeStartTime
    ? challengeStartTime.getTime() + challengeDuration * 1000
    : null;

  const [timeLeft, setTimeLeft] = useState(challengeDuration);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [ropePosition, setRopePosition] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [level2pair, setPairId] = useState("");
  const [playerid, setPlayerId] = useState("");
  const tugWarControls = useAnimation();
  const totalQuestions = 10;
  const questions = [
    { question: "What is 5 + 3?", options: [6, 7, 8, 9], answer: 8, marks: 10 },
    {
      question: "Which number is prime?",
      options: [9, 10, 11, 12],
      answer: 11,
      marks: 10,
    },
    {
      question: "What is 7 x 6?",
      options: [40, 42, 44, 48],
      answer: 42,
      marks: 10,
    },
    {
      question: "Find the missing number: 2, 4, ?, 8, 10",
      options: [5, 6, 7, 9],
      answer: 6,
      marks: 10,
    },
    {
      question: "What is the square root of 64?",
      options: [6, 7, 8, 9],
      answer: 8,
      marks: 10,
    },
    {
      question: "If x = 5, what is x^2?",
      options: [10, 15, 20, 25],
      answer: 25,
      marks: 10,
    },
    { question: "Solve: 15 - 7", options: [6, 7, 8, 9], answer: 8, marks: 10 },
    {
      question: "Which is an even number?",
      options: [11, 13, 16, 19],
      answer: 16,
      marks: 10,
    },
    {
      question: "What is 4! (4 factorial)?",
      options: [12, 24, 36, 48],
      answer: 24,
      marks: 10,
    },
    {
      question: "Which shape has 6 sides?",
      options: ["Triangle", "Pentagon", "Hexagon", "Octagon"],
      answer: "Hexagon",
      marks: 10,
    },
  ];

  // Load saved answer for the current question (if any)
  useEffect(() => {
    const saved = localStorage.getItem(`answer-${currentQuestion}`);
    if (saved) {
      setSelectedAnswer(JSON.parse(saved));
    } else {
      setSelectedAnswer(null);
    }
  }, [currentQuestion]);

  // Fetch pairId and playerId from the backend
  useEffect(() => {
    async function fetchUserData() {
      try {
        const username = localStorage.getItem("username");
        const response = await fetch("https://squidgamebackend.onrender.com/level2pair", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });
        const data = await response.json();
        console.log("Server response:", data);
        setPairId(data.level2pair);
        setPlayerId(data.playerid);
      } catch (error) {
        console.error("Failed to fetch pair and player IDs:", error);
      }
    }
    fetchUserData();
  }, []);

  // Optionally, log updated pair and player IDs when they change.
  useEffect(() => {
    console.log("Updated level2pair:", level2pair);
    console.log("Updated playerid:", playerid);
  }, [level2pair, playerid]);


  // Continuous oscillation for rope animation.
  useEffect(() => {
    const oscillateTugOfWar = async () => {
      while (!gameOver) {
        await tugWarControls.start({
          x: 10,
          transition: { duration: 0.5, yoyo: Infinity },
        });
        await tugWarControls.start({
          x: -10,
          transition: { duration: 0.5, yoyo: Infinity },
        });
      }
    };
    oscillateTugOfWar();
  }, [gameOver, tugWarControls]);

  // When a user selects an answer, update state and save locally.
  const handleOptionSelect = (option) => {
    setSelectedAnswer(option);
    localStorage.setItem(`answer-${currentQuestion}`, JSON.stringify(option));
  };

  // Handle moving to the next question.
  const handleNextQuestion = () => {
    localStorage.setItem(
      `answer-${currentQuestion}`,
      JSON.stringify(selectedAnswer)
    );
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  // Final submission: compute score, evaluate rope position, and decide navigation.
  const handleFinalSubmit = useCallback(async () => {
    localStorage.setItem(
      `answer-${currentQuestion}`,
      JSON.stringify(selectedAnswer)
    );
    setIsSubmitting(true);
    setErrorMessage("");

    let calculatedScore = 0;
    let calculatedRopePosition = 0;
    questions.forEach((q, index) => {
      const storedAnswer = localStorage.getItem(`answer-${index}`);
      if (storedAnswer) {
        const answer = JSON.parse(storedAnswer);
        if (answer === q.answer) {
          calculatedScore += q.marks;
        }
      }
    });
    console.log("Calculated Score:", calculatedScore);
    setScore(calculatedScore);
    localStorage.setItem("score", calculatedScore);

    // Animate rope to its final position.
    tugWarControls.start({
      transition: { type: "spring", stiffness: 100 },
    });

    const submitTime = new Date().toISOString();
    try {
      const response = await fetch("https://squidgamebackend.onrender.com/submitTugOfWar", {
        method: "POST",
        body: JSON.stringify({
          playerid: localStorage.getItem("playerid"),
          score: calculatedScore,
          timeLeft,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log("Server response:", data);
      try {
        const Score = localStorage.getItem(score);
        const playerid = localStorage.getItem("playerid");
        if (!playerid) {
          console.error("Player ID not found.");
          return;
        }
        // const response1 = await fetch("https://squidgamebackend.onrender.com/score1", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ playerid: playerid, level2Score: Score }),
        // });
        
        const response = await fetch("https://squidgamebackend.onrender.com/user1", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerid }),
        });
        const playerData = await response.json();
        console.log(playerData);
        if (
          playerData.user.level2pair === "solo player" &&
          timeLeft === 0
        ) {
          console.log(localStorage.getItem("score"));
          if (localStorage.getItem("score") > 0) {
            navigate("/Level3instructions");
          } else {
            navigate("/TugOfWarDisqualified");
          }
          return;
        }
        const opponentId = playerData.user.level2pair;
        console.log(opponentId);
        
          const oppResponse = await fetch("https://squidgamebackend.onrender.com/user1", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playerid: opponentId }),
          });
          const opponentData = await oppResponse.json();
          console.log(opponentData);
        
        console.log("343");
        console.log(timeLeft);
        console.log(opponentData);
        
        if (playerData.user.level2 && opponentData.user.level2 && timeLeft===0) {
          if (playerData.user.level2Score > opponentData.user.level2Score) {
            navigate("/Level3instructions");
          } else if (playerData.user.level2Score < opponentData.user.level2Score) {
            console.log("ji");
          } else {
            if (playerData.user.level2Time > opponentData.user.level2Time) {
              navigate("/Level3instructions");
            } else {
              console.log("hi");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching level 2 data:", error);
      }
    } catch (error) {
      if (error.response) {
        console.error("Server error:", error.response.data);
        setErrorMessage(
          error.response.data.message || "Server error occurred."
        );
      } else if (error.request) {
        console.error("No response:", error.request);
        setErrorMessage("No response from server. Please try again later.");
      } else {
        console.error("Request error:", error.message);
        setErrorMessage("Error in request. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
      setGameOver(true);
    }
  }, [
    currentQuestion,
    selectedAnswer,
    questions,
    timeLeft,
    tugWarControls,
    navigate,
    playerid,
    level2pair,
  ]);

  // Sync timer with real-life time using the targetTime.
  useEffect(() => {
    if (!targetTime) return; // Wait until challengeStartTime is loaded
    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((targetTime - Date.now()) / 1000)
      );
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(interval);
        // When time runs out, auto-submit the evaluated scores
        handleFinalSubmit();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetTime, handleFinalSubmit]);
  useEffect(() => {
    async function scores1() {
      // try {
      //   const Score = localStorage.getItem(score);
      //   const playerid = localStorage.getItem("playerid");
      //   if (!playerid) {
      //     console.error("Player ID not found.");
      //     return;
      //   }
      //   const response1 = await fetch("https://squidgamebackend.onrender.com/score1", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ playerid: playerid, level2Score: Score }),
      //   });
        
      //   const response = await fetch("https://squidgamebackend.onrender.com/user1", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ playerid }),
      //   });
      //   const playerData = await response.json();
      //   console.log(playerData);
        
      //   const opponentId = playerData.user.level2pair;
      //   console.log(opponentId);
      //   if (opponentId !== "solo player") {
      //     const oppResponse = await fetch("https://squidgamebackend.onrender.com/user1", {
      //       method: "POST",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({ playerid: opponentId }),
      //     });
      //     const opponentData = await oppResponse.json();
      //     console.log(opponentData);
      //   }
      //   console.log("343");
      //   console.log(timeLeft);
      //   console.log(timeLeft === 900);
      //   if (
      //     playerData.user.level2pair === "solo player" &&
      //     timeLeft === 0
      //   ) {
      //     console.log(localStorage.getItem("score"));
      //     if (localStorage.getItem("score") > 0) {
      //       navigate("/Level3instructions");
      //     } else {
      //       navigate("/TugOfWarDisqualified");
      //     }
      //     return;
      //   }
      //   if (playerData.user.level2 && opponentData.user.level2) {
      //     if (playerData.user.level2Score > opponentData.user.level2Score) {
      //       navigate("/Level3instructions");
      //     } else if (playerData.user.level2Score < opponentData.user.level2Score) {
      //       console.log("ji");
      //     } else {
      //       if (playerData.user.level2Time > opponentData.user.level2Time) {
      //         navigate("/Level3instructions");
      //       } else {
      //         console.log("hi");
      //       }
      //     }
      //   }
      // } catch (error) {
      //   console.error("Error fetching level 2 data:", error);
      // }
    }
  
    scores1();
  }, [navigate]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-black text-white">
      <div className="absolute top-4 left-4 px-8 py-4 rounded-md text-yellow-400 font-bold text-xl">
        Player ID: {localStorage.getItem("playerid") || "Guest"}
      </div>
      <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">
        Tug of War Challenge
      </h1>
      <p className="mb-2">
        Question {currentQuestion + 1} of {totalQuestions}
      </p>
      <p className="text-lg text-center max-w-xl mb-4">
        Answer all questions! The team with the highest score wins. If scores
        are tied, the fastest team wins!
      </p>
      <p className="text-xl font-bold text-red-400 mb-4">
        ⏳ Time Left: {minutes}:{seconds}
      </p>

      <motion.div
        className="relative w-1/2 h-40 flex justify-between items-center mt-4"
        animate={tugWarControls}
      >
        <motion.img
          src="/images/TeamA.png"
          alt="Team A"
          className="w-32 h-32 z-10"
          animate={{ x: -ropePosition / 2 }}
          transition={{ type: "spring", stiffness: 100 }}
        />
        <motion.div
          className="absolute top-[53%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-full h-2 bg-yellow-800"
          style={{ zIndex: 1 }}
          animate={{ x: ropePosition }}
          transition={{ type: "spring", stiffness: 100 }}
        />
        <motion.img
          src="/images/TeamB.png"
          alt="Team B"
          className="w-32 h-32 z-10"
          animate={{ x: ropePosition / 2 }}
          transition={{ type: "spring", stiffness: 100 }}
        />
      </motion.div>

      <div className="my-6 w-1/2 flex justify-center">
        <div className="bg-gray-800 p-4 rounded-lg text-center w-full">
          <p className="mt-2 text-xl">{questions[currentQuestion]?.question}</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {questions[currentQuestion]?.options.map((option, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded text-white ${
                  selectedAnswer === option ? "bg-blue-600" : "bg-gray-700"
                } hover:bg-blue-800`}
                onClick={() => handleOptionSelect(option)}
                disabled={isSubmitting}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            <button
              className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded"
              onClick={() =>
                setCurrentQuestion((prev) => Math.max(prev - 1, 0))
              }
              disabled={currentQuestion === 0 || isSubmitting}
            >
              Previous
            </button>
            {currentQuestion === totalQuestions - 1 ? (
              <button
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                onClick={handleFinalSubmit}
                disabled={gameOver || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "submit"}
              </button>
            ) : (
              <button
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                onClick={handleNextQuestion}
                disabled={isSubmitting}
              >
                Next
              </button>
            )}
          </div>
          <button
            onClick={() => navigate("/Level3instructions")}
            className="mt-6 px-6 py-3 text-lg font-bold rounded bg-teal-500 hover:bg-teal-700 text-white"
            disabled={isSubmitting}
          >
            Next Level
          </button>
          {errorMessage && (
            <p className="text-red-500 mt-4 text-center">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TugOfWar;

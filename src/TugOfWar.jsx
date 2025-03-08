import React, { useState, useEffect, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";

const TugOfWar = () => {
  const navigate = useNavigate();

  // Challenge duration in seconds (15 minutes)
  const challengeDuration = 900;

  // Component states
  const [challengeStartTime, setChallengeStartTime] = useState(null);
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
    {
      question:
        "If January 1, 2024 is a Monday, what day of the week will October 31, 2024 be?",
      options: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      answer: "Thursday",
      marks: 10,
    },
    {
      question:
        "A train traveling at 60 km/hr departs a station at 8:00 AM. A second train traveling at 80 km/hr leaves the same station at 8:30 AM in the same direction. At what time will the second train catch up with the first?",
      options: ["9:30 AM", "10:00 AM", "10:15 AM", "10:30 AM"],
      answer: "10:00 AM",
      marks: 10,
    },
    {
      question:
        "Find the next term in the sequence: 7G, 11K, 13Q, 17U, ___, given that the numeric parts are consecutive prime numbers and the letters are obtained by alternately adding 4 and 6 to the previous term’s letter position (with A=1, Z=26).",
      options: ["19A", "19B", "19C", "19D"],
      answer: "19A",
      marks: 10,
    },
    {
      question:
        "A school's student council has 12 members. How many different subcommittees of 4 can be formed?",
      options: [495, 330, 210, 120],
      answer: 495,
      marks: 10,
    },
    {
      question:
        "Consider the sentences: (i) Everybody in the class is prepared for the exam. (ii) Babu invited Danish to his home because he enjoys playing chess. Which observation is correct?",
      options: [
        "(i) is grammatically correct and (ii) is unambiguous",
        "(i) is grammatically incorrect and (ii) is unambiguous",
        "(i) is grammatically correct and (ii) is ambiguous",
        "(i) is grammatically incorrect and (ii) is ambiguous",
      ],
      answer: "(i) is grammatically correct and (ii) is ambiguous",
      marks: 10,
    },
    {
      question:
        "Directions: Refer to the following data: In a survey of 100 students, 60 like Mathematics, 45 like Science, and 30 like both subjects. How many students like only Science?",
      options: ["15", "30", "45", "60"],
      answer: "15",
      marks: 10,
    },
    {
      question:
        "In a family, if A is the sister of B, B is married to C, and C is the sister of D, who is the mother of E, what is the relation of A to E?",
      options: ["Aunt", "Cousin", "Sister", "Grandmother"],
      answer: "Aunt",
      marks: 10,
    },
    {
      question:
        "Directions: From town A, travel 3 km east, then 4 km north, then 5 km west, and finally 2 km south to reach town B. In which direction from town A is town B located?",
      options: ["North-West", "North-East", "South-West", "South-East"],
      answer: "North-West",
      marks: 10,
    },
    {
      question:
        "In a family, if A is the daughter of B, B has two children, A and C. C is married to D, and they have a daughter E. What is the relation of E to A?",
      options: ["Sister", "Cousin", "Niece", "Aunt"],
      answer: "Niece",
      marks: 10,
    },
    {
      question:
        "A book costs Rs. 250. A discount of 10% is given on the marked price, and an additional discount of 5% is offered on the sale price. What is the final price of the book?",
      options: ["Rs. 210", "Rs. 213.75", "Rs. 220", "Rs. 225"],
      answer: "Rs. 213.75",
      marks: 10,
    },
  ];

  // Calculate challenge end time when start time is available.
  const targetTime = challengeStartTime
    ? challengeStartTime.getTime() + challengeDuration * 1000
    : null;

  // Simulate fetching challenge start time
  useEffect(() => {
    setChallengeStartTime(new Date("2025/03/08 16:25:00"));
  }, []);

  // Load saved answer for the current question from localStorage.
  useEffect(() => {
    const saved = localStorage.getItem(`answer-${currentQuestion}`);
    setSelectedAnswer(saved ? JSON.parse(saved) : null);
  }, [currentQuestion]);

  // Fetch pair and player IDs from backend.
  useEffect(() => {
    async function fetchUserData() {
      try {
        const username = localStorage.getItem("username");
        const response = await fetch(
          "https://squidgamebackend.onrender.com/level2pair",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
          }
        );
        const data = await response.json();
        setPairId(data.level2pair);
        setPlayerId(data.playerid);
      } catch (error) {
        console.error("Failed to fetch pair and player IDs:", error);
      }
    }
    fetchUserData();
  }, []);

  // Continuous oscillation for rope animation until game is over.
  useEffect(() => {
    const oscillate = async () => {
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
    oscillate();
  }, [gameOver, tugWarControls]);

  // Handle answer selection.
  const handleOptionSelect = (option) => {
    setSelectedAnswer(option);
    localStorage.setItem(`answer-${currentQuestion}`, JSON.stringify(option));
  };

  // Move to the next question.
  const handleNextQuestion = () => {
    localStorage.setItem(
      `answer-${currentQuestion}`,
      JSON.stringify(selectedAnswer)
    );
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  // Final submission: calculate score, animate rope, and handle navigation.
  const handleFinalSubmit = useCallback(async () => {
    localStorage.setItem(
      `answer-${currentQuestion}`,
      JSON.stringify(selectedAnswer)
    );
    setIsSubmitting(true);
    setErrorMessage("");

    let calculatedScore = 0;
    questions.forEach((q, index) => {
      const storedAnswer = localStorage.getItem(`answer-${index}`);
      if (storedAnswer && JSON.parse(storedAnswer) === q.answer) {
        calculatedScore += q.marks;
      }
    });
    setScore(calculatedScore);
    localStorage.setItem("score", calculatedScore);

    // Animate rope to final position.
    tugWarControls.start({
      transition: { type: "spring", stiffness: 100 },
    });

    try {
      const response = await fetch(
        "https://squidgamebackend.onrender.com/submitTugOfWar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerid: localStorage.getItem("playerid"),
            score: calculatedScore,
            timeLeft,
          }),
        }
      );
      await response.json();

      // Fetch user data for current player.
      const responseUser = await fetch(
        "https://squidgamebackend.onrender.com/user1",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerid: localStorage.getItem("playerid") }),
        }
      );
      const playerData = await responseUser.json();

      if (playerData.user.level2pair === "solo player" && timeLeft === 0) {
        if (localStorage.getItem("score") > 0) {
          navigate("/Level3instructions");
        } else {
          navigate("/TugOfWarDisqualified");
        }
        return;
      }

      // Compare scores with opponent.
      const opponentId = playerData.user.level2pair;
      const oppResponse = await fetch(
        "https://squidgamebackend.onrender.com/user1",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerid: opponentId }),
        }
      );
      const opponentData = await oppResponse.json();

      console.log(playerData.user.level2Score)
      console.log(opponentData.user.level2Score)
      if (
        playerData.user.level2 &&
        opponentData.user.level2 &&
        timeLeft === 0
      ) {
        if (playerData.user.level2Score > opponentData.user.level2Score) {
          navigate("/Level3instructions");
        } else if (playerData.user.level2Score < opponentData.user.level2Score) {
          console.log("Opponent won the tug of war challenge");
        } else {
          if (playerData.user.level2Time > opponentData.user.level2Time) {
            navigate("/Level3instructions");
          } else {
            console.log("Opponent won the tug of war challenge by time");
            navigate("/Level3instructions");
          }
        }
      }
    } catch (error) {
      console.error("Error in submission:", error);
      setErrorMessage("An error occurred. Please try again.");
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
  ]);

  // Timer: update remaining time every second based on the target time.
  useEffect(() => {
    if (!targetTime) return;
    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((targetTime - Date.now()) / 1000)
      );
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(interval);
        handleFinalSubmit();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetTime, handleFinalSubmit]);

  // Format time display.
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
          <p className="mt-2 text-xl">
            {questions[currentQuestion]?.question}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {questions[currentQuestion]?.options.map((option, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded text-white ${
                  selectedAnswer === option
                    ? "bg-blue-600"
                    : "bg-gray-700"
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
                {isSubmitting ? "Submitting..." : "Submit"}
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

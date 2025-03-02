import React, { useState, useEffect, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TugOfWar = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [ropePosition, setRopePosition] = useState(0); // Position of the rope movement
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const tugWarControls = useAnimation();
  const totalQuestions = 10;
  const questions = [
    { question: "What is 5 + 3?", options: [6, 7, 8, 9], answer: 8, marks: 10 },
    { question: "Which number is prime?", options: [9, 10, 11, 12], answer: 11, marks: 10 },
    { question: "What is 7 x 6?", options: [40, 42, 44, 48], answer: 42, marks: 10 },
    { question: "Find the missing number: 2, 4, ?, 8, 10", options: [5, 6, 7, 9], answer: 6, marks: 10 },
    { question: "What is the square root of 64?", options: [6, 7, 8, 9], answer: 8, marks: 10 },
    { question: "If x = 5, what is x^2?", options: [10, 15, 20, 25], answer: 25, marks: 10 },
    { question: "Solve: 15 - 7", options: [6, 7, 8, 9], answer: 8, marks: 10 },
    { question: "Which is an even number?", options: [11, 13, 16, 19], answer: 16, marks: 10 },
    { question: "What is 4! (4 factorial)?", options: [12, 24, 36, 48], answer: 24, marks: 10 },
    { question: "Which shape has 6 sides?", options: ["Triangle", "Pentagon", "Hexagon", "Octagon"], answer: "Hexagon", marks: 10 },
  ];

  // Timer: counts down and auto-submits the current question when time runs out.
  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver) {
      handleAnswerSubmission(true);
    }
  }, [timeLeft, gameOver]);

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

  // Process answer submission for the current question.
  // When isFinal is true (last question or overall time out), perform final submission.
  const handleAnswerSubmission = useCallback(
    async (isFinal = false) => {
      if (isSubmitting) return;
      // Removed alert for no answer selection.
      setIsSubmitting(true);
      setErrorMessage("");

      let localScore = score;
      let localRopePosition = ropePosition;
      const currentQ = questions[currentQuestion];

      if (selectedAnswer === currentQ.answer) {
        localScore += currentQ.marks;
        localRopePosition += 50;
      } else {
        localRopePosition -= 50;
      }

      setScore(localScore);
      setRopePosition(localRopePosition);

      tugWarControls.start({
        x: localRopePosition,
        transition: { type: "spring", stiffness: 100 },
      });

      setSelectedAnswer(null);

      if (isFinal || currentQuestion === totalQuestions - 1) {
        const submitTime = new Date().toISOString();
        try {
          // Note: The payload now uses 'score' and 'timeRemaining'
          const response = await axios.post(
            "http://localhost:5000/submitTugOfWar",
            {
              pairId: "pair1",
              playerId: "player1",
              score: localScore,
              timeRemaining: timeLeft,
              submitTime,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          const data = response.data;
          console.log("Server response:", data);

          if (data.winner) {
            if (data.winner === "player1") {
              alert("You won this round!");
            } else if (data.winner === "player2") {
              alert("Your opponent won this round. Better luck next time!");
            } else {
              alert("It's a tie! Proceed to the next round.");
            }
            navigate("/Level3instructions", { state: { score: localScore } });
          } else {
            alert("Submission received. Waiting for your opponent's response.");
          }
        } catch (error) {
          if (error.response) {
            console.error("Server error:", error.response.data);
            setErrorMessage(error.response.data.message || "Server error occurred.");
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
      } else {
        setCurrentQuestion((prev) => prev + 1);
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      selectedAnswer,
      currentQuestion,
      questions,
      ropePosition,
      score,
      tugWarControls,
      navigate,
      timeLeft,
      totalQuestions,
    ]
  );

  // Calculate minutes and seconds for the timer (logic remains intact)
  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-black text-white">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">Tug of War Challenge</h1>
      <p className="mb-2">
        Question {currentQuestion + 1} of {totalQuestions}
      </p>
      <p className="text-lg text-center max-w-xl mb-4">
        Answer all questions! The team with the highest score wins. If scores are tied, the fastest team wins!
      </p>
      
      {/* Hidden timer element */}
      <p className="text-xl font-bold mb-4" style={{ display: "none" }}>
        Time Left: {minutes}:{seconds}
      </p>
      
      {/* Total Marks information moved above the animation */}
      <p className="text-xl font-bold mb-4">Total Marks: 10</p>
      
      {/* Tug-of-War Animation */}
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

      {/* Questions Section */}
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
                onClick={() => setSelectedAnswer(option)}
                disabled={isSubmitting}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            <button
              className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded"
              onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}
              disabled={currentQuestion === 0 || isSubmitting}
            >
              Previous
            </button>
            {currentQuestion === totalQuestions - 1 ? (
              <button
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                onClick={() => handleAnswerSubmission(true)}
                disabled={gameOver || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            ) : (
              <button
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                onClick={() => handleAnswerSubmission(false)}
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
        </div>
      </div>
    </div>
  );
};

export default TugOfWar;

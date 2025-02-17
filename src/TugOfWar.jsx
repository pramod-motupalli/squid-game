import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TugOfWar = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [endTime, setEndTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const totalQuestions = 10;

  const questions = [
    { question: "What is 5 + 3?", options: [6, 7, 8, 9], answer: 8 },
    { question: "Which number is prime?", options: [9, 10, 11, 12], answer: 11 },
    { question: "What is 7 x 6?", options: [40, 42, 44, 48], answer: 42 },
    { question: "Find the missing number: 2, 4, ?, 8, 10", options: [5, 6, 7, 9], answer: 6 },
    { question: "What is the square root of 64?", options: [6, 7, 8, 9], answer: 8 },
    { question: "If x = 5, what is x^2?", options: [10, 15, 20, 25], answer: 25 },
    { question: "Solve: 15 - 7", options: [6, 7, 8, 9], answer: 8 },
    { question: "Which is an even number?", options: [11, 13, 16, 19], answer: 16 },
    { question: "What is 4! (4 factorial)?", options: [12, 24, 36, 48], answer: 24 },
    { question: "Which shape has 6 sides?", options: ["Triangle", "Pentagon", "Hexagon", "Octagon"], answer: "Hexagon" },
  ];

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameOver(true);
      setEndTime(Date.now());
      alert("Time's up! The game is over.");
      navigate("/Level3instructions", { state: { score, timeTaken: endTime - startTime } });
    }
  }, [timeLeft]);

  const handleSubmit = () => {
    if (selectedAnswer === null) return alert("Please select an answer!");

    if (selectedAnswer === questions[currentQuestion].answer) {
      setScore((prev) => prev + 1);
    }
    setSelectedAnswer(null);
    setCurrentQuestion((prev) => prev + 1);

    if (currentQuestion === totalQuestions - 1) {
      setGameOver(true);
      setEndTime(Date.now());
    }
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-black text-white">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 text-center">Tug of War Challenge</h1>
      <p className="mt-4 text-lg text-center max-w-xl">Answer all 10 questions! The team with the highest score wins. If scores are tied, the fastest team wins!</p>
      <p className="text-xl font-bold">Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}</p>
      <div className="my-6 w-full flex justify-center">
        <div className="bg-gray-800 p-4 rounded-lg text-center w-1/2">
          <p className="mt-2 text-xl">{questions[currentQuestion]?.question}</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {questions[currentQuestion]?.options.map((option, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded text-white ${selectedAnswer === option ? "bg-blue-600" : "bg-gray-700"} hover:bg-blue-800`}
                onClick={() => setSelectedAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            <button
              className="px-6 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded"
              onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}
              disabled={currentQuestion === 0}
            >
              Previous
            </button>
            {currentQuestion === totalQuestions - 1 && (
              <button
                className="px-6 py-2 bg-green-500 hover:bg-green-700 text-white rounded"
                onClick={handleSubmit}
                disabled={gameOver}
              >
                Submit
              </button>
            )}
            <button
              className="px-6 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
              onClick={() => setCurrentQuestion((prev) => Math.min(prev + 1, totalQuestions - 1))}
              disabled={currentQuestion === totalQuestions - 1}
            >
              Next
            </button>
          </div>
          {gameOver && (
            <button
              onClick={() => navigate("/Level3instructions")}
              className="mt-6 px-6 py-3 text-lg font-bold rounded bg-teal-500 hover:bg-teal-700 text-white"
            >
              Next Level
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TugOfWar;

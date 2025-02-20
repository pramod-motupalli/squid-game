import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios to send data to the database

const TugOfWar = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [ropePosition, setRopePosition] = useState(0); // Position of the rope movement

  const tugWarControls = useAnimation(); // Controls the entire animation

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

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameOver(true);
      alert("Time's up! The game is over.");
      navigate("/Level3instructions", { state: { score } });
    }
  }, [timeLeft]);

  useEffect(() => {
    // Continuous natural movement (small oscillations)
    const oscillateTugOfWar = async () => {
      while (!gameOver) {
        await tugWarControls.start({ x: 10, transition: { duration: 0.5, yoyo: Infinity } });
        await tugWarControls.start({ x: -10, transition: { duration: 0.5, yoyo: Infinity } });
      }
    };
    oscillateTugOfWar();
  }, [gameOver, tugWarControls]);
  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedAnswer(null);
    }
  };
  const handleSubmit = async () => {
    if (selectedAnswer === null) return alert("Please select an answer!");

    const currentQ = questions[currentQuestion];

    if (selectedAnswer === currentQ.answer) {
      setScore((prev) => prev + currentQ.marks);
      setRopePosition((prev) => prev + 50); // Moves everything to the right on correct answer
    } else {
      setRopePosition((prev) => prev - 50); // Moves everything to the left on incorrect answer
    }

    // Moves entire div based on user answer
    tugWarControls.start({ x: ropePosition, transition: { type: "spring", stiffness: 100 } });

    // Save submit time to database
    const submitTime = new Date().toISOString();
    try {
      await axios.post("http://localhost:5000/saveSubmitTime", {
        question: currentQ.question,
        answer: selectedAnswer,
        marks: currentQ.marks,
        submitTime,
      });
    } catch (error) {
      console.error("Error saving submit time:", error);
    }

    setSelectedAnswer(null);
    setCurrentQuestion((prev) => prev + 1);

    if (currentQuestion === totalQuestions - 1) {
      setGameOver(true);
    }
  };

  // Time formatting (minutes:seconds)
  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-black text-white">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 text-center">Tug of War Challenge</h1>
      <p className="text-lg text-center max-w-xl">
        Answer all 10 questions! The team with the highest score wins. If scores are tied, the fastest team wins!
      </p>
      <p className="text-xl font-bold">Time Left: {minutes}:{seconds}</p>

      {/* Tug of War Full Animation (Teams + Rope) */}
      <motion.div className="relative w-1/2 h-40 flex justify-between items-center mt-8" animate={tugWarControls}>
        <motion.img src="/images/TeamA.png" className="w-32 h-32 z-10" animate={{ x: -ropePosition / 2 }} transition={{ type: "spring", stiffness: 100 }} />
        <motion.div className="absolute top-[53%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-2 bg-yellow-800"
          style={{ zIndex: 1 }} animate={{ x: ropePosition }} transition={{ type: "spring", stiffness: 100 }} />
        <motion.img src="/images/TeamB.png" className="w-32 h-32 z-10" animate={{ x: ropePosition / 2 }} transition={{ type: "spring", stiffness: 100 }} />
      </motion.div>

      {/* Questions */}
      <div className="my-6 w-1/2 flex justify-center">
        <div className="bg-gray-800 p-4 rounded-lg text-center w-full">
          <p className="mt-2 text-xl">{questions[currentQuestion]?.question}</p>
          <p className="mt-2 text-md">Marks: {questions[currentQuestion]?.marks}</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {questions[currentQuestion]?.options.map((option, index) => (
              <button key={index} className={`px-4 py-2 rounded text-white ${selectedAnswer === option ? "bg-blue-600" : "bg-gray-700"} hover:bg-blue-800`}
                onClick={() => setSelectedAnswer(option)}>
                {option}
              </button>
            ))}
          </div>
          <div className="flex gap-4 justify-center mt-4">
  <button 
    className="px-6 py-2 bg-yellow-500 hover:bg-yellow-700 text-white rounded"
    onClick={handlePrev} 
    disabled={currentQuestion === 0}
  >
    Previous
  </button>

  {/* Submit Button */}
  <button 
    className="px-6 py-2 bg-green-500 hover:bg-green-700 text-white rounded"
    onClick={handleSubmit} 
    disabled={gameOver}
  >
    Submit
  </button>
  <button className="px-6 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded" 
                onClick={handleNext}>
                Next
              </button>
</div>

          
        </div>
      </div>
    </div>
  );
};

export default TugOfWar;

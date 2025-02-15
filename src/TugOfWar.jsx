import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TugOfWar = () => {
  const navigate = useNavigate();
  const [ropePosition, setRopePosition] = useState(0); // 0 is center, positive values favor Team A, negative favor Team B
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [teamTurn, setTeamTurn] = useState("A"); // Alternates between A and B
  const [gameOver, setGameOver] = useState(false);
  const winThreshold = 3; // Number of correct answers needed to win

  const questions = [
    {
      question: "What is the next number in the sequence? 2, 6, 12, 20, ?",
      options: [28, 30, 32, 36],
      answer: 30,
    },
    {
      question: "If a train travels 60 km in 1 hour, how long does it take to travel 180 km?",
      options: [2, 3, 4, 5],
      answer: 3,
    },
    {
      question: "A man walks 10 meters north, then 10 meters east, then 10 meters south. How far is he from his starting point?",
      options: [0, 10, 20, 30],
      answer: 10,
    },
    {
      question: "Which shape has the most sides?",
      options: ["Triangle", "Pentagon", "Hexagon", "Octagon"],
      answer: "Octagon",
    },
  ];

  useEffect(() => {
    if (ropePosition >= winThreshold) {
      setGameOver(true);
      alert("Team A Wins! They qualify for the next level!");
    } else if (ropePosition <= -winThreshold) {
      setGameOver(true);
      alert("Team B Wins! They qualify for the next level!");
    }
  }, [ropePosition]);

  const handleSubmit = () => {
    if (selectedAnswer === null) return alert("Please select an answer!");

    if (selectedAnswer === questions[currentQuestion].answer) {
      setRopePosition((prev) => (teamTurn === "A" ? prev + 1 : prev - 1));
    }

    setSelectedAnswer(null);
    setTeamTurn(teamTurn === "A" ? "B" : "A");
    setCurrentQuestion((prev) => (prev + 1) % questions.length);
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-black text-white">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 text-center">
        Level 2: Tug of War (Aptitude & Logic Face-off)
      </h1>
      <p className="mt-4 text-lg text-center max-w-xl">
        Welcome to the second level of the competition! The remaining pairs are
        split into two teams. Both teams receive the same set of aptitude and
        logical reasoning questions. Correct answers move the virtual rope
        toward their team’s side. The team that pulls the rope completely to
        their side wins the round and qualifies for the next level.
      </p>
      
      <div className="my-6 w-full flex justify-center">
        <div className="bg-gray-800 p-4 rounded-lg text-center w-1/2">
          <p className="text-lg font-bold">{teamTurn === "A" ? "Team A's Turn" : "Team B's Turn"}</p>
          <p className="mt-2 text-xl">{questions[currentQuestion].question}</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded text-white ${
                  selectedAnswer === option ? "bg-blue-600" : "bg-gray-700"
                } hover:bg-blue-800`}
                onClick={() => setSelectedAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-700 text-white rounded"
            onClick={handleSubmit}
            disabled={gameOver}
          >
            Submit
          </button>
        </div>
      </div>

      <div className="my-6 w-full flex justify-center">
        <div className="relative w-2/3 h-10 bg-gray-500 rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-yellow-500 transition-all"
            style={{ width: `${(ropePosition + winThreshold) * (100 / (winThreshold * 2))}%` }}
          ></div>
        </div>
      </div>

      {/* {gameOver && ( */}
        <button
          onClick={() => navigate("/Level3instructions")}
          className="mt-6 px-6 py-3 text-lg font-bold rounded bg-teal-500 hover:bg-teal-700 text-white"
        >
          Next Level
        </button>
      {/* )} */}
    </div>
  );
};

export default TugOfWar;

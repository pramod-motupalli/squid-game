import React from "react";
import { useNavigate } from "react-router-dom";

const Level2Instructions = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      <div className="w-full max-w-4xl p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Level 2: Tug of War (Aptitude & Logic Face-off)</h1>
        <p className="mb-4">Welcome to the second level of the competition! Follow the instructions carefully:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>The remaining pairs will be split into two teams.</li>
          <li>Both teams receive the same set of aptitude and logical reasoning questions.</li>
          <li>Correct answers move the virtual rope toward their team’s side.</li>
          <li>The team that pulls the rope completely to their side wins the round, while the other team is eliminated.</li>
        </ul>
        <button 
          onClick={() => navigate("/level2/game")}
          className="mt-6 px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-700 transition"
        >
          Start Level 2
        </button>
      </div>
    </div>
  );
};

export default Level2Instructions;

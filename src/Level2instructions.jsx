import React from "react";
import { useNavigate } from "react-router-dom";

const Level2Instructions = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black  text-white p-4"  style={{ backgroundImage: "url('public/images/Tug_of_War.PNG.webp')"}}>
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-center max-w-2xl">
        <h1 className="text-3xl font-bold text-white">Level 2: Tug of War (Aptitude & Logic Face-off)</h1>
        <p className="mt-4 text-lg">Welcome to the Second level of the competition! Follow the instructions carefully:</p>
        <ul className="mt-4 text-left space-y-2">
          <li>🔹 The remaining pairs will be split into two teams.</li>
          <li>🔹 Both teams receive the same set of aptitude and logical reasoning questions.</li>
          <li>🔹 Correct answers move the virtual rope toward their team’s side.</li>
          <li>🔹 The team that pulls the rope completely to their side wins the round.</li>
          <li>🔹 The winning team will be qualified to next level of the game.</li>
        </ul>
        <button
          onClick={() => navigate("/TugOfWar ")}
          className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-800 text-white rounded-lg text-lg"
        >
          Start Level 2
        </button>
      </div>
    </div>
  );
};

export default Level2Instructions;

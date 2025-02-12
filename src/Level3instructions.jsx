import React from "react";
import { useNavigate } from "react-router-dom";

const Level3Instructions = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Level 3: Single and Mingle (Algorithmic Showdown)</h1>
        <p className="mb-4">Welcome to the final level! Follow the instructions carefully:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Each pair will receive an algorithm and pseudo code.</li>
          <li>The team should predict the suitable data structure to solve it.</li>
          <li>The team must analyze and complete the given pseudo code.</li>
          <li>The teams that correctly implement them will be declared the winners.</li>
        </ul>
        <button 
          onClick={() => navigate("/level3/game")} 
          className="mt-6 px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-700 transition"
        >
          Start Level 3
        </button>
      </div>
    </div>
  );
};

export default Level3Instructions;

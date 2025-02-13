import React from "react";
import { useNavigate } from "react-router-dom";

const Level1Instructions = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-6">
      <div className="bg-white/10 p-6 rounded-lg shadow-lg max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-blue-500 mb-4">
          Level 1: Red Light, Green Light (Debugging Battle)
        </h1>
        <p className="text-lg mb-4">
          Welcome to the first level of the competition! Follow the instructions carefully:
        </p>
        <ul className="text-left list-disc list-inside space-y-2 text-lg">
          <li>Participants will compete in pairs from the start.</li>
          <li><strong>Each pair starts with 100 won.</strong></li>
          <li>A buggy code will be given along with an editor to fix it.</li>
          <li><strong>Debugging is only allowed during the green light.</strong></li>
          <li>If they write during the red light, <strong>5 won</strong> is deducted.</li>
          <li>Pairs with less than <strong>75 won</strong> are eliminated.</li>
        </ul>
        <button
          // onClick={() => navigate("/level1/game")}
          className="mt-6 bg-blue-700 px-6 py-3 text-lg rounded-md hover:bg-blue-900 transition-all"
        >
          Start Level 1
        </button>
      </div>
    </div>
  );
};

export default Level1Instructions;

import React from "react";
import { useNavigate } from "react-router-dom";

const Level1Instructions = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4" style={{ backgroundImage: "url('public/images/Redlight.jpg')" ,backgroundRepeat:"no-repeat",backgroundSize:"cover"}} >
      <div className=" border-gray-900  bg-black/50 p-6 rounded-lg shadow-lg text-center max-w-2xl">
        <h1 className="text-3xl font-bold text-white">Level 1: Red Light, Green Light (Debugging Battle)</h1>
        <p className="mt-4 text-lg">Welcome to the first level of the competition! Follow the instructions carefully:</p>
        <ul className="mt-4 text-left space-y-2">
          <li>🔹 Participants will compete in pairs from the start.</li>
          <li>🔹 Each pair starts with 100 won.</li>
          <li>🔹 A buggy code will be given along with an editor to fix it.</li>
          <li>🔹 Debugging is only allowed during the green light.</li>
          <li>🔹 If they write during the red light, 5 won is deducted.</li>
          <li>🔹 Pairs with less than 75 won are eliminated.</li>
        </ul>
        <button
          onClick={() => navigate("/level1/game")}
          className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-800 text-white rounded-lg text-lg"
        >
          Start Level 1
        </button>
      </div>
    </div>
  );
};

export default Level1Instructions;

import React from "react";
import { useNavigate } from "react-router-dom";

const Level3Instructions = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4" style={{ backgroundImage: "url('public/images/Level3insbg.jpg')" ,backgroundRepeat:"no-repeat",backgroundSize:"cover"}}>
      <div className="border-gray-900  bg-black/50 p-6 rounded-lg shadow-lg text-center max-w-2xl">
        <h1 className="text-3xl font-bold text-white">Level 3: Single and Mingle (Algorithmic Showdown)</h1>
        <p className="mt-4 text-lg">Welcome to the final level! Follow the instructions carefully:</p>
        <ul className="mt-4 text-left space-y-2">

        {/* <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4" style={{ backgroundImage: "url('public/images/Redlight.jpg')" ,backgroundRepeat:"no-repeat",backgroundSize:"cover"}} >
      <div className=" border-gray-900  bg-black/50 p-6 rounded-lg shadow-lg text-center max-w-2xl">
        <h1 className="text-3xl font-bold text-white">Level 1: Red Light, Green Light (Debugging Battle)</h1>
        <p className="mt-4 text-lg">Welcome to the first level of the competition! Follow the instructions carefully:</p>
        <ul className="mt-4 text-left space-y-2"> */}

          <li>🔹Each pair will receive an algorithm and pseudo code.</li>
          <li>🔹The team should predict the suitable data structure to solve it.</li>
          <li>🔹The team must analyze and complete the given pseudo code.</li>
          <li>🔹The teams that correctly implement them will be declared the winners.</li>
        </ul>
        <button 
          onClick={() => navigate("/Symbols ")} 
          className="mt-6 px-6 py-3 bg-blue-500 text-white justify-center items-center font-bold rounded-lg hover:bg-blue-700 transition"
        >
          Start Level 3
        </button>
      </div>
    </div>
  );
};

export default Level3Instructions;

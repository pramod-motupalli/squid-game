import React from "react";
import { useNavigate } from "react-router-dom";

const Disqualified = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-center p-6">
      <h1 className="text-4xl font-bold mb-4">Sorry, You Are Disqualified</h1>
      <p className="text-lg mb-6">Unfortunately, your team has been eliminated based on the score.</p>
      <button
        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-lg"
        onClick={() => navigate("/")}
      >
        Go to Home
      </button>
    </div>
  );
};

export default Disqualified;
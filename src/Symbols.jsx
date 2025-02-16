import React, { useState } from "react";
import { Umbrella, Star, Codesandbox } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Symbols = () => {
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const navigate = useNavigate();

  const renderSymbol = () => {
    switch (selectedSymbol) {
      case "umbrella":
        return <Umbrella size={50} className="text-blue-500" />;
      case "star":
        return <Star size={50} className="text-yellow-500" />;
      case "codesandbox":
        return <Codesandbox size={50} className="text-red-500" />;
      default:
        return <p className="text-gray-500">Select a symbol to display</p>;
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6 text-white"
      style={{
        backgroundImage: "url(/SquidSymbol.png)", // Change this to your actual image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 className="text-2xl font-bold mb-4">
        Choose a Symbol that you <b> DON'T</b> want
      </h1>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedSymbol("umbrella")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Umbrella
        </button>
        <button
          onClick={() => setSelectedSymbol("star")}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded"
        >
          Star
        </button>
        <button
          onClick={() => setSelectedSymbol("codesandbox")}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
        >
          Codesandbox
        </button>
      </div>
      <div className="flex items-center justify-center border border-gray-600 p-4 rounded-lg w-40 h-40 bg-black/50">
        {renderSymbol()}
      </div>
      <button
        onClick={() => navigate("/SingleAndMingle")}
        className="mt-6 px-6 py-3 text-lg font-bold rounded bg-teal-500 hover:bg-teal-700 text-white"
      >
        Next Level
      </button>
    </div>
  );
};

export default Symbols;

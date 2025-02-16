import React, { useState } from "react";
import { Circle, Umbrella, Star, Triangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Symbols = () => {
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const navigate = useNavigate();

  const toggleSymbol = (symbol) => {
    setSelectedSymbols((prev) => {
      if (prev.includes(symbol)) {
        return prev.filter((s) => s !== symbol);
      } else if (prev.length < 2) {
        return [...prev, symbol];
      }
      return prev;
    });
  };

  const renderSymbol = (symbol) => {
    switch (symbol) {
      case "circle":
        return <Circle size={50} className="text-gray-900" />;
      case "umbrella":
        return <Umbrella size={50} className="text-blue-900" />;
      case "star":
        return <Star size={50} className="text-yellow-500" />;
      case "triangle":
        return <Triangle size={50} className="text-red-500" />;
      default:
        return <p className="text-gray-900 text-center">Select a symbol</p>;
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-black p-6 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('public/images/SquidSymbol.jpg')" }}
    >
      <h1 className="text-2xl font-bold mb-4">
        Choose any <b>TWO</b> Symbols that you want
      </h1>
      <div className="flex gap-4 mb-6">
        {[
          { name: "circle", color: "bg-gray-600 hover:bg-gray-700" },
          { name: "triangle", color: "bg-red-600 hover:bg-red-700" },
          { name: "star", color: "bg-yellow-500 hover:bg-yellow-600" },
          { name: "umbrella", color: "bg-blue-600 hover:bg-blue-700" },
        ].map(({ name, color }) => (
          <button
            key={name}
            onClick={() => toggleSymbol(name)}
            className={`${color} px-4 py-2 rounded ${selectedSymbols.includes(name) ? "border-2 border-white" : ""}`}
          >
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </button>
        ))}
      </div>
      <div className="flex flex-row gap-3">
        <div className="flex items-center justify-center border border-gray-500 p-4 rounded-lg w-40 h-40 bg-black/31">
          {renderSymbol(selectedSymbols[0])}
        </div>
        <div className="flex items-center justify-center border border-gray-500 p-4 rounded-lg w-40 h-40 bg-black/31">
          {renderSymbol(selectedSymbols[1])}
        </div>
      </div>
      <button
        onClick={() => navigate("/SingleAndMingle")}
        className="mt-6 px-6 py-3 text-lg font-bold rounded bg-teal-500 hover:bg-teal-700 text-white"
        disabled={selectedSymbols.length !== 2} // Ensures exactly two symbols are selected
      >
        Next Level
      </button>
    </div>
  );
};

export default Symbols;

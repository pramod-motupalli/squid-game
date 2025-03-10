import React from "react";

const PairingButton = () => {
  const handlePairing = async () => {
    try {
      const response = await fetch("https://squidgamebackend.onrender.com/pair-users", {
        method: "GET", // Adjust the method if needed
        headers: { "Content-Type": "application/json" }
      });
      const data = await response.json();
      console.log("Pairing response:", data);
    } catch (error) {
      console.error("Error during pairing process:", error);
    }
  };

  return (
    <div className="bg-black h-screen flex justify-center items-center">
      <button
        onClick={handlePairing}
        className="px-4 py-2 text-base cursor-pointer text-white bg-blue-500 hover:bg-blue-600 rounded"
      >
        Start Pairing
      </button>
    </div>
  );
};

export default PairingButton;

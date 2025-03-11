import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Level1Instructions = () => {
  const navigate = useNavigate();
  const initialTime = 2 * 60; // Timer in seconds (2 minutes)
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const storedTime = localStorage.getItem("level1StartTime");
    const startTime = storedTime ? parseInt(storedTime, 10) : Date.now();

    if (!storedTime) {
      localStorage.setItem("level1StartTime", startTime);
    }

    const updateTimer = () => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      const remainingTime = Math.max(initialTime - elapsedTime, 0);
      setTimeLeft(remainingTime);

      if (remainingTime === 0) {
        clearInterval(timer);
        localStorage.removeItem("level1StartTime");
        navigate("/Level1/game");
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4"
      style={{
        backgroundImage: "url('/images/RedLight.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="border-gray-900 bg-black/50 p-6 rounded-lg shadow-lg text-center max-w-2xl">
        {/* Countdown Timer */}
        <div className="text-2xl font-bold text-red-500">
          Time Left: {formatTime(timeLeft)}
        </div>

        <h1 className="text-3xl font-bold text-white mt-4">
          Level 1: Red Light, Green Light (Debugging Battle)
        </h1>
        <p className="mt-4 text-lg">
          Welcome to the first level of the competition! Follow the instructions
          carefully:
        </p>
        <ul className="mt-4 text-left space-y-2">
          <li>🔹 Participants will compete in pairs from the start.</li>
          <li>🔹 Each pair starts with 100 won.</li>
          <li>🔹 A buggy code will be given along with an editor to fix it.</li>
          <li>🔹 Debugging is only allowed during the green light.</li>
          <li>🔹 If they write during the red light, 1 won is deducted.</li>
          <li>🔹 Pairs with less than 70 won are eliminated.</li>
        </ul>
      </div>
    </div>
  );
};

export default Level1Instructions;

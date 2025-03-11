import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Level3Instructions = () => {
  const navigate = useNavigate();
  const initialTime = 3; // Timer in seconds
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const storedTime = localStorage.getItem("level3StartTime");
    const startTime = storedTime ? parseInt(storedTime, 10) : Date.now();

    if (!storedTime) {
      localStorage.setItem("level3StartTime", startTime);
    }

    const updateTimer = () => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      const remainingTime = Math.max(initialTime - elapsedTime, 0);
      setTimeLeft(remainingTime);

      if (remainingTime === 0) {
        clearInterval(timer);
        localStorage.removeItem("level3StartTime");
        navigate("/Symbols");
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
        backgroundImage: "url('/images/Level3insbg.jpg')",
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
          Level 3: Single and Mingle (Algorithmic Showdown)
        </h1>
        <p className="mt-4 text-lg">
          Welcome to the final level! Follow the instructions carefully:
        </p>
        <ul className="mt-4 text-left space-y-2">
          <li>🔹 Each pair will receive an algorithm and pseudo code.</li>
          <li>
            🔹 The team should predict the suitable data structure to solve it.
          </li>
          <li>
            🔹 The team must analyze and complete the given pseudo code.
          </li>
          <li>
            🔹 The teams that correctly implement them will be declared the winners.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Level3Instructions;

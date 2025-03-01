import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Level3Instructions = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(3); // Timer in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/Symbols"); // Navigate to the next level and green light page when time is up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

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

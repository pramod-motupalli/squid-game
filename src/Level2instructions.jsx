import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Level2Instructions = () => {
  const navigate = useNavigate();
  const initialTime = 2 * 60; // Timer in seconds (2 minutes)
  const [timeLeft, setTimeLeft] = useState(initialTime);

  // Fetch Level 1 completed users
  const fetchLevel1CompletedUsers = async () => {
    try {
      const response = await fetch(
        "https://squidgamebackend.onrender.com/users-with-level1-true",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();

      if (data) {
        console.log("Users with Level 1 completed:", data);
        navigate("/TugOfWar"); // Navigate to Level 2 page
      } else {
        console.error("Error fetching users:", data.message);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    const storedTime = localStorage.getItem("level2StartTime");
    const startTime = storedTime ? parseInt(storedTime, 10) : Date.now();
    
    if (!storedTime) {
      localStorage.setItem("level2StartTime", startTime);
    }

    const timer = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      const remainingTime = Math.max(initialTime - elapsedTime, 0);
      setTimeLeft(remainingTime);

      if (remainingTime === 0) {
        clearInterval(timer);
        localStorage.removeItem("level2StartTime");
        fetchLevel1CompletedUsers();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [initialTime, navigate]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4"
      style={{
        backgroundImage: "url('/images/Tugofwarbg.jpg')",
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
          Level 2: Tug of War (Aptitude & Logic Face-off)
        </h1>
        <p className="mt-4 text-lg">
          Welcome to the Second level of the competition! Follow the instructions carefully:
        </p>
        <ul className="mt-4 text-left space-y-2">
          <li>🔹 Both teams receive the same set of aptitude and logical reasoning questions.</li>
          <li>🔹 Correct answers move the virtual rope toward their team’s side.</li>
          <li>🔹 The team that pulls the rope completely to their side wins the round.</li>
          <li>🔹 The winning team will be qualified to the next level of the game.</li>
        </ul>
      </div>
    </div>
  );
};

export default Level2Instructions;

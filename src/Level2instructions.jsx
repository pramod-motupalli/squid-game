import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Level2Instructions = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(3); // Timer in seconds

  const fetchLevel1CompletedUsers = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/users-with-level1-true",
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
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          fetchLevel1CompletedUsers(); // Trigger API call when timer ends
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4"
      style={{
        backgroundImage: "url('public/images/Tugofwarbg.jpg')",
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

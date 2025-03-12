import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ThankYou() {
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");

    const eliminateUser = async () => {
      try {
        const response = await fetch("https://squidgamebackend.onrender.com/eliminateUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });
        if (!response.ok) {
          console.error("Failed to update elimination status");
        }
      } catch (error) {
        console.error("Error updating elimination status:", error);
      } finally {
        // Clear localStorage only after the elimination API call is done.
        localStorage.clear();
      }
    };

    eliminateUser();
  }, []);

  return (
    <div
      className="flex flex-col justify-end items-center min-h-screen bg-cover bg-top text-white text-center"
      style={{
        backgroundImage: "url('/images/Lastpage.jpg')",
      }}
    >
      <div className="mb-10">
        <h1 className="text-8xl font-bold mb-6">Thank You! 😊</h1>
        <p className="text-3xl">
          We appreciate your effort and time in the game.
        </p>
      </div>
    </div>
  );
}

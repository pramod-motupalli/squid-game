import React from "react";
import { useNavigate } from "react-router-dom";

const Disqualified = () => {
  const navigate = useNavigate();

  const handleNextClick = async () => {
    try {
      // Get the username (this can also be fetched from an API if needed)
      const username = localStorage.getItem("username");
      
      // Send a POST request to mark the user as eliminated
      const response = await fetch("https://squidgamebackend.onrender.com/eliminateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, eliminated: true }),
      });

      if (response.ok) {
        // If successful, navigate to the thank you page
        navigate("/thankyou");
      } else {
        console.error("Failed to update elimination status.");
      }
    } catch (error) {
      console.error("Error updating elimination status:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-center p-6">
      <h1 className="text-4xl font-bold mb-4">Sorry, You Are Disqualified</h1>
      <p className="text-lg mb-6">
        Unfortunately, your team has been eliminated.
      </p>
      <button
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg"
        onClick={handleNextClick}
      >
        Next
      </button>
    </div>
  );
};

export default Disqualified;

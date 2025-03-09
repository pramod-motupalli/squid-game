import React, { useState, useEffect } from "react";

function LeaderBoard() {
  // State to hold players fetched from the API
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch players from the backend on mount
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch("https://localhost:5000/api/players", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const text = await response.text();
          throw new Error("Network response was not ok: " + text);
        }
        const data = await response.json();
        console.log(data)
        // Expecting the API to return { players: [...] }
        setPlayers(data.players);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching players:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading)
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="w-screen h-screen overflow-hidden flex items-center justify-center bg-black">
      {/* Hexagon Container */}
      <div
        className="w-[80vmin] h-[80vmin] bg-gray-800 flex flex-wrap justify-center items-center
          clip-[polygon(25%_6.7%,_75%_6.7%,_100%_50%,_75%_93.3%,_25%_93.3%,_0%_50%)]"
      >
        {players.map((player, index) =>
          player.eliminate ? (
            <div
              key={index}
              className="w-36 h-36 m-2 flex items-center justify-center border-2 border-white text-white font-bold
                clip-[polygon(25%_6.7%,_75%_6.7%,_100%_50%,_75%_93.3%,_25%_93.3%,_0%_50%)]"
            >
              {player.id}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

export default LeaderBoard;

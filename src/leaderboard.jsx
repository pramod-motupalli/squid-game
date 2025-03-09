import React, { useState, useEffect } from "react";
import { Hexagon } from "lucide-react";

function LeaderBoard() {
  // State to hold users as an object fetched from the API
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from the backend on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://squidgamebackend.onrender.com/api/players", {
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
        console.log("Fetched data:", data);
        setUsers(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500 text-white text-2xl font-bold">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500 text-red-500 text-2xl font-bold">
        Error: {error}
      </div>
    );

  // Convert the JSON object to an array of [key, user] pairs
  const userEntries = Object.entries(users);
  // Filter: Display only players that are not eliminated (eliminated === false)
  const nonEliminatedEntries = userEntries.filter(([key, user]) => !user.eliminated);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 p-4">
      <h1 className="text-white text-4xl font-extrabold mb-8 drop-shadow-lg">LeaderBoard</h1>
      <div className="w-[80vmin] h-[80vmin] bg-gray-800 flex flex-wrap justify-center items-center relative shadow-2xl">
        {nonEliminatedEntries.length > 0 ? (
          nonEliminatedEntries.map(([key, user]) => (
            <div key={key} className="relative w-36 h-36 m-2 transform transition duration-300 hover:scale-110">
              {/* Render Hexagon icon from lucide-react */}
              <Hexagon className="w-full h-full stroke-white fill-transparent" />
              {/* Overlay player's id */}
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                {user.playerid}
              </div>
            </div>
          ))
        ) : (
          <div className="text-white text-xl">No non-eliminated users found.</div>
        )}
      </div>
    </div>
  );
}

export default LeaderBoard;

import React, { useState, useEffect } from "react";

function LeaderBoard() {
  // State to hold users (as an object) fetched from the API
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
        // Store data as an object (assuming data is an object with user keys)
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

  // Convert the JSON object to an array of [key, user] pairs
  const userEntries = Object.entries(users);
  // Filter only those users who are eliminated
  const eliminatedEntries = userEntries.filter(([key, user]) => user.eliminated);

  return (
    <div className="w-screen h-screen overflow-hidden flex items-center justify-center bg-black">
      <div
        className="w-[80vmin] h-[80vmin] bg-gray-800 flex flex-wrap justify-center items-center
          clip-[polygon(25%_6.7%,_75%_6.7%,_100%_50%,_75%_93.3%,_25%_93.3%,_0%_50%)]"
      >
        {eliminatedEntries.length > 0 ? (
          eliminatedEntries.map(([key, user]) => (
            <div
              key={key}
              className="w-36 h-36 m-2 flex items-center justify-center border-2 border-white text-white font-bold
                clip-[polygon(25%_6.7%,_75%_6.7%,_100%_50%,_75%_93.3%,_25%_93.3%,_0%_50%)]"
            >
              {user.playerid}
            </div>
          ))
        ) : (
          <div className="text-white">No eliminated users found.</div>
        )}
      </div>
    </div>
  );
}

export default LeaderBoard;

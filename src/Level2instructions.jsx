import React from "react";
import { useNavigate } from "react-router-dom";

const Level2Instructions = () => {
  const navigate = useNavigate();
  const fetchUsersWithLevel1 = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/users-with-level1-true",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data) {
        // Add index numbers starting from 1
        pairUsersIntoTeams();

        const indexedUsers = data.map((user, index) => ({
          index: index + 1, // Index starting from 1
          username: user.username,
        }));

        console.log("Indexed Users who completed Level 1:", indexedUsers);
        return indexedUsers;
      } else {
        console.error("Error fetching users:", data.message);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  const pairUsersIntoTeams = async () => {
    const users = await fetchUsersWithLevel1(); // Fetch indexed users
    navigate("/TugOfWar ");
    const teams = [];
    let soloPlayer = null;

    for (let i = 0; i < users.length; i += 2) {
      if (i + 1 < users.length) {
        teams.push({
          team: `Team ${teams.length + 1}`,
          members: [users[i], users[i + 1]],
        });
      } else {
        soloPlayer = users[i]; // Last user plays solo
      }
    }

    console.log("Paired Teams:", teams);
    if (soloPlayer) {
       console.log("Solo Player:", soloPlayer);
    }

    return { teams, soloPlayer };
  };
  // Call the function to create teams

  const fetchLevel1CompletedUsers = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/users-with-level1-true",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data) {
        console.log("Users with Level 1 completed:", data);
        fetchUsersWithLevel1();

        return data; // Return data for further use if needed
      } else {
        console.error("Error fetching users:", data.message);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4"
      style={{
        backgroundImage: "url('public/images/Tugofwarbg.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="border-gray-900  bg-black/50 p-6 rounded-lg shadow-lg text-center max-w-2xl">
        <h1 className="text-3xl font-bold text-white">
          Level 2: Tug of War (Aptitude & Logic Face-off)
        </h1>
        <p className="mt-4 text-lg">
          Welcome to the Second level of the competition! Follow the
          instructions carefully:
        </p>
        <ul className="mt-4 text-left space-y-2">
          <li>🔹 The remaining pairs will be split into two teams.</li>
          <li>
            🔹 Both teams receive the same set of aptitude and logical reasoning
            questions.
          </li>
          <li>
            🔹 Correct answers move the virtual rope toward their team’s side.
          </li>
          <li>
            🔹 The team that pulls the rope completely to their side wins the
            round.
          </li>
          <li>
            🔹 The winning team will be qualified to next level of the game.
          </li>
        </ul>
        <button
          onClick={() => fetchLevel1CompletedUsers()}
          className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-800 text-white rounded-lg text-lg"
        >
          Start Level 2
        </button>
      </div>
    </div>
  );
};

export default Level2Instructions;

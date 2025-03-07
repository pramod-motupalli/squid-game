import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("intro");
  const navigate = useNavigate();
  const [playerId, setPlayerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the player ID from the API endpoint

  useEffect(() => {
    const fetchPlayerId = async () => {
      const username = localStorage.getItem("username");
      if (!username) {
        setError("Username not found in localStorage");
        setLoading(false);
        return;
      }

      console.log(username);

      try {
        // Send a POST request with the username in the request body
        const response = await fetch(`https://squidgamebackend.onrender.com/api/player`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error("Network response was not ok: " + text);
        }

        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          // If content type is not JSON, attempt to parse the raw text
          const rawText = await response.text();
          try {
            data = JSON.parse(rawText);
          } catch (parseError) {
            throw new Error(
              "Failed to parse JSON from response: " + parseError.message
            );
          }
        }
        if (data && data.playerId) {
          setPlayerId(data.playerId);
          localStorage.setItem("playerid", data.playerId); 
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        console.error("Error fetching player ID:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerId();
  }, []);

  return (
    <div className="home-container flex flex-col items-center justify-center p-4 bg-black w-full min-h-screen text-white relative">
      {/* Player ID Display (Top-Left Corner) */}
      <div className="absolute top-4 left-4 text-white font-bold px-3 py-1 rounded-md text-sm sm:text-lg shadow-md">
        Welcome, {playerId || "N/A"}
      </div>

      {/* Main Content Box */}
      <div className="slider w-full max-w-screen-lg bg-white/20 p-6 rounded-lg shadow-lg text-center h-auto flex flex-col justify-between">
        {/* Tab Buttons */}
        <div className="tab-buttons flex flex-wrap justify-center gap-3 w-full">
          {["intro", "about", "rules"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 bg-blue-700 text-white cursor-pointer rounded-md transition-all text-sm sm:text-lg ${
                activeTab === tab ? "bg-blue-900" : "hover:bg-blue-900"
              }`}
            >
              {tab === "intro"
                ? "Introduction"
                : tab === "about"
                ? "About Us"
                : "Rules"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content flex-grow overflow-y-auto mt-4 text-sm sm:text-lg">
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && !error && activeTab === "intro" && (
            <div className="intro-section">
              <h1 className="text-2xl sm:text-3xl font-bold mb-4">
                Welcome to Cresence 2K25
              </h1>
              <p>
                <b className="text-blue-500">
                  Get ready for an electrifying experience!
                </b>
                <br />
                Cresence 2K25 is more than just a tech fest—it’s a celebration
                of innovation, competition, and creativity. Organized by the
                third-year students of JNTU GV's CSE department, this
                national-level fest brings together some of the sharpest minds
                from across the country.
              </p>
            </div>
          )}

          {!loading && !error && activeTab === "about" && (
            <div className="about-section">
              <h1 className="text-2xl sm:text-3xl font-bold mb-4">About Us</h1>
              <p>
                <b className="text-blue-500">
                  Cresence2K25: A National-Level Tech Fest
                </b>
                <br />
                Organized by JNTU GV's CSE department, this event unites tech
                enthusiasts nationwide.
              </p>
            </div>
          )}

          {!loading && !error && activeTab === "rules" && (
            <div className="rules-section">
              <h1 className="text-2xl sm:text-3xl font-bold mb-4">
                Game Rules
              </h1>
              <div className="rules-grid flex flex-wrap justify-center gap-4">
                {[
                  {
                    title: "Level 1: Red Light, Green Light (Debugging Battle)",
                    rules: [
                      "•Participants will compete in pairs from the start.",
                      "•Each pair starts with 100 won.",
                      "•A buggy code will be given along with an editor to fix it.",
                      "•Debugging is only allowed during the green light.",
                      "•If they write during the red light, 5 won is deducted.",
                      "•Pairs with less than 75 won are eliminated.",
                    ],
                  },
                  {
                    title: "Level 2: Tug of War (Aptitude & Logic Face-off)",
                    rules: [
                      "•The remaining pairs will be split into two teams.",
                      "•Both teams receive the same set of aptitude and logical reasoning questions.",
                      "•Correct answers move the virtual rope toward their team’s side.",
                      "•The team that pulls the rope completely to their side wins the round.",
                    ],
                  },
                  {
                    title: "Level 3: Single and Mingle (Algorithmic Showdown)",
                    rules: [
                      "•Each pair will receive an algorithm and pseudo code.",
                      "•The team should predict the suitable data structure to solve it and complete the code.",
                      "•The teams that correctly implement them will be declared the winners.",
                    ],
                  },
                ].map((level, index) => (
                  <div
                    key={index}
                    className="rule-box bg-white/5 p-4 rounded-lg shadow-md text-center border border-white/10 w-full sm:w-[30%]"
                  >
                    <b className="text-lg text-blue-500">{level.title}</b>
                    <ul className="text-left pl-4 mt-2">
                      {level.rules.map((rule, i) => (
                        <li key={i}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Photo Grid Section */}
      <div className="photo-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center mt-6 w-full max-w-screen-lg">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="grid-item w-full h-52 sm:h-64 lg:h-85 bg-[url('/images/SquidGame.png')] bg-no-repeat bg-center bg-cover rounded-md shadow-md"
          ></div>
        ))}
      </div>

      {/* Next Button: Visible Only When Rules Tab is Active */}
      {activeTab === "rules" && (
        <button
          onClick={() => navigate("/level1-instructions")}
          className="relative mt-4 bg-blue-700 text-white px-6 py-3 text-sm sm:text-lg rounded-md hover:bg-blue-900"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default HomePage;

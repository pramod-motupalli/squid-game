import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("intro");
  const navigate = useNavigate();
  const [playerId, setPlayerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Slider state for three static cards
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slider navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? 2 : prev - 1));
  };

  // Static player data for slides
  const playerNames = [
    "Pramod Motupalli",
    "Snehitha Mankena",
    "Bhavani Maradapu"
  ];
  const playerIds = ["Player531", "Player526", "Player572"];

  // Fetch the player ID from the API endpoint
  useEffect(() => {
    const fetchPlayerId = async () => {
      const username = localStorage.getItem("username");
      if (!username) {
        setError("Username not found in localStorage");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://squidgamebackend.onrender.com/api/player",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
          }
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error("Network response was not ok: " + text);
        }

        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
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
      {/* Player ID Display - Responsive positioning */}
      <div
        className="
          absolute top-8 left-4 md:top-4 md:left-4 
          text-white font-bold px-3 py-1 rounded-md shadow-md 
          text-base md:text-lg
        "
      >
        <div className="font-extrabold bg-gradient-to-r from-green-500 to-red-500 bg-clip-text text-transparent text-lg md:text-2xl">Welcome,</div>
        {playerId || "N/A"}
      </div>

      {/* Main Content Box (Tabs Section) */}
      <div className="slider w-full max-w-screen-lg bg-white/20 p-6 rounded-lg shadow-lg text-center flex flex-col justify-between">
        {/* Tab Buttons */}
        <div className="tab-buttons flex flex-wrap justify-center gap-3 w-full">
          {["intro", "about", "rules"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 bg-blue-700 cursor-pointer rounded-md transition-all text-sm sm:text-lg ${
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
              <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent mb-4">
                Welcome to Cresence 2K25
              </h1>
              <p>
                <b className="text-blue-500">Get ready for an electrifying experience!</b>
                <br />
                Cresence 2K25 is more than just a tech fest—it’s a celebration of
                innovation, competition, and creativity. Organized by the
                third-year students of JNTU GV's CSE department, this national-level
                fest brings together some of the sharpest minds from across the country.
              </p>
            </div>
          )}

          {!loading && !error && activeTab === "about" && (
            <div className="about-section">
              <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-red-400 to-blue-500 bg-clip-text text-transparent mb-4">
                About Us
              </h1>
              <p>
                <b className="text-blue-500">Cresence2K25: A National-Level Tech Fest</b>
                <br />
                CRESENCE is a technical symposium organized by the students from the
Department of Computer Science & Engineering, JNTU Vizianagaram. Designed
around an immersive space theme, the fest serves as a dynamic platform for
students to explore emerging technologies, enhance technical competencies, and
engage in collaborative innovation. The symposium features a diverse range of
technical events, coding challenges, hackathons, workshops, and expert sessions,
alongside cultural engagements that foster a holistic learning experience.
CRESENCE aims to bridge the gap between academia and industry by
encouraging knowledge sharing, problem-solving, and technical excellence.
              </p>
            </div>
          )}

          {!loading && !error && activeTab === "rules" && (
            <div className="rules-section">
              <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-500 to-red-300 bg-clip-text text-transparent mb-4">
                Game Rules
              </h1>
              <div className="rules-grid flex flex-wrap justify-center gap-4">
                {[
                  {
                    title: "Level 1: Red Light, Green Light (Debugging Battle)",
                    rules: [
                      "• Participants will compete in pairs from the start.",
                      "• Each pair starts with 100 won.",
                      "• A buggy code will be given along with an editor to fix it.",
                      "• Debugging is only allowed during the green light.",
                      "• If they write during the red light, 5 won is deducted.",
                      "• Pairs with less than 75 won are eliminated.",
                    ],
                  },
                  {
                    title: "Level 2: Tug of War (Aptitude & Logic Face-off)",
                    rules: [
                      "• The remaining pairs will be split into two teams.",
                      "• Both teams receive the same set of aptitude and logical reasoning questions.",
                      "• Correct answers move the virtual rope toward their team’s side.",
                      "• The team that pulls the rope completely to their side wins the round.",
                    ],
                  },
                  {
                    title: "Level 3: Single and Mingle (Algorithmic Showdown)",
                    rules: [
                      "• Each pair will receive an algorithm and pseudo code.",
                      "• The team should predict the suitable data structure to solve it and complete the code.",
                      "• The teams that correctly implement them will be declared the winners.",
                    ],
                  },
                ].map((level, index) => (
                  <div
                    key={index}
                    className="rule-box bg-white/5 p-4 rounded-lg shadow-md text-center border border-white/10 w-full sm:w-[30%]"
                  >
                    <b className="text-lg text-blue-500">
                      {level.title}
                    </b>
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

      {/* 
        ================================
        Team Section (Three Columns)
        Stacks into one column on small screens
        ================================
      */}
      <div className="max-w-screen-xl mx-auto my-8 px-4">
        {/* 
          flex-col -> stack on small screens
          md:flex-row -> side-by-side on medium & up
          items-center + text-center for small screens
          md:items-start + md:text-left for large screens
        */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 text-center md:text-left">
          {/* Left Column */}
          <div className="md:w-1/3">
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent mb-4">
              Our Team
            </h1>
            <p className="text-base sm:text-lg leading-relaxed">
              Squid Game is powered by a passionate team of students
              dedicated to making this tech event a success. From Level1 to Level3,
              we ensure a seamless and engaging experience. Together, we bring
              innovation, creativity, and technology to life.
            </p>
          </div>

          {/* Middle Column - Slider with 3 Static Pictures */}
          <div className="md:w-1/3">
            <div className="overflow-hidden rounded-md">
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {/* Card 1 */}
                <div
                  className="
                    min-w-full relative 
                    h=72 sm:h-96 md:h-auto w-64 md:aspect-[4/5] 
                    bg-no-repeat bg-center bg-cover
                  "
                  style={{ backgroundImage: "url('/images/pramodSG.jpg')" }}
                ></div>
                {/* Card 2 */}
                <div
                  className="
                    min-w-full relative 
                    h-72 sm:h-96 md:h-auto md:aspect-[4/5] 
                    bg-no-repeat bg-center bg-cover
                  "
                  style={{ backgroundImage: "url('/images/snehithasg.jpg')" }}
                ></div>
                {/* Card 3 */}
                <div
                  className="
                    min-w-full relative 
                    h-72 sm:h-96 md:h-auto md:aspect-[4/5] 
                    bg-no-repeat bg-center bg-cover
                  "
                  style={{ backgroundImage: "url('/images/bhavanisg.jpg')" }}
                ></div>
              </div>
            </div>
            {/* Navigation Buttons below the slider */}
            <div className="flex justify-center mt-2 gap-4">
              <button
                onClick={prevSlide}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-700 text-white hover:bg-blue-900"
              >
                &#8592;
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-700 text-white hover:bg-blue-900"
              >
                &#8594;
              </button>
            </div>
          </div>

          {/* Right Column - Dynamic Player Details */}
          <div className="md:w-1/3 md:text-right">
            <h3 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent mb-2">
              {playerNames[currentSlide]}
            </h3>
            <p className="text-base sm:text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
              {playerIds[currentSlide]}
            </p>
          </div>
        </div>
      </div>

      {/* Next Button: Visible Only When "Rules" Tab is Active */}
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

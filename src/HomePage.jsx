import React, { useState } from "react";
import "./HomePage.css";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="home-container">
      <div className="slider">
        <div className="tab-buttons">
          <button onClick={() => setActiveTab("about")} className={activeTab === "about" ? "active" : ""}>
            About Us
          </button>
          <button onClick={() => setActiveTab("rules")} className={activeTab === "rules" ? "active" : ""}>
            Rules
          </button>
        </div>
        <div className="tab-content">
          {activeTab === "about" ? (
            <div className="about-section">
              <h2>About Us</h2>
              <p>The Ultimate Squid Game Challenge!<br></br>
Do you have what it takes to survive the ultimate technical showdown? Brace yourself for an intense, high-stakes competition where only the sharpest minds will prevail! Inspired by the thrilling challenges of Squid Game, this event will test your debugging skills, teamwork, and coding speed. With each level pushing you closer to the edge, precision and strategy are the keys to survival.

Think fast, code smart, and stay in the game—because only the best will make it to the final stage!</p>
            </div>
          ) : (
            <div className="rules-section">
              <h2>Rules</h2>
              <p>
              Level 1: Red Light, Green Light (Debugging Battle)

Participants will compete in pairs from the start.

Each pair starts with 100 won.
A buggy code will be given along with an editor to fix it.

Debugging is only allowed during the green light.

If they write during the red light, 10 won is deducted.

Pairs with less than 80 won are eliminated.


Level 2: Tug of War (Aptitude & Logic Face-off)

The remaining pairs will be split into two teams.

Both teams receive the same set of aptitude and logical reasoning questions.

Correct answers move the virtual rope toward their team’s side.

The team that pulls the rope completely to their side wins the round, while the other team are  eliminated.


Level 3: Single and Mingle (Algorithmic Showdown)

Each pair will receive an algorithm
The team should predict the suitable data structure to solve it and complete the code.

The teams that correctly Implements  them will be declared the winners.


This is your moment to prove your coding survival skills. Can you and your partner outthink, outcode, and outlast the competition?

              </p>
            </div>
          )}
        </div>
      </div>

      <div className="photo-grid">
        <div className="grid-item"> <img src="/images/SquidGame.png" alt="Player531" /> </div>
        <div className="grid-item"> <img src="/images/SquidGame.png" alt="Player526" /> </div>
        <div className="grid-item"> <img src="/images/SquidGame.png" alt="Player572" /> </div>
      </div>
    </div>
  );
};

export default HomePage;

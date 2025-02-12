import React, { useState } from "react";
import "./HomePage.css";
import { Type } from "lucide-react";

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
              <h1>About Us</h1>
              <p> 
                <b> Cresence2K25: A National-Level Tech Fest by JNTU GV CSE 3rd Year Students</b><br/>
                <p></p>
                Welcome to Cresence, an exciting and vibrant national-level tech fest organized by the third-year students of the Computer Science and Engineering department at JNTU Guntur (JNTU GV).
                This fest brings together the brightest minds from across the country to showcase their creativity, skills, and passion for technology.
                Cresence is a unique blend of tech and non-tech events that pushes the boundaries of innovation while offering fun, engaging activities for everyone.
                From mind-bending coding challenges and hackathons to thought-provoking workshops, our tech events will test your coding, problem-solving, and collaboration skills.
                Whether you're a budding coder, a tech enthusiast, or just looking to learn something new, there's something for you.
                But that’s not all! The non-tech events, including a thrilling Flashmob, cultural performances, and exciting competitions, ensure that you have a balanced and memorable experience.
                It's not just about technology – it’s about teamwork, creativity, and having a blast with like-minded peers.
                Join us for Cresence, where innovation meets celebration, and let your talent shine in a truly electrifying environment!<br/>
                <p></p>
                <b>The Ultimate Squid Game Challenge!</b><br />
                <p></p>
                Do you have what it takes to survive the ultimate technical showdown? 
                Brace yourself for an intense, high-stakes competition where only the sharpest minds will prevail! 
                Inspired by the thrilling challenges of Squid Game, this event will test your debugging skills, teamwork, and coding speed.
                With each level pushing you closer to the edge, precision and strategy are the keys to survival.
                Think fast, code smart, and stay in the game—because only the best will make it to the final stage!<br/>
                <p></p>
                <b>This event is designed by</b>  
                <ul>
                  <li>
                    Bhavani Maradapu
                  </li>
                  <li>
                    Snehtiha Mankena
                  </li>
                  <li>
                    Pramod Motupalli
                  </li>
                  </ul> 
              </p>
            </div>
          ) : (
            <div className="rules-section">
              <h2>Rules</h2>
              <div className="rules-grid">
                <div className="rule-box">
                  <b>Level 1: Red Light, Green Light (Debugging Battle)</b>
                  <ul>
                    <li>Participants will compete in pairs from the start.</li>
                    <li>Each pair starts with 100 won.</li>
                    <li>A buggy code will be given along with an editor to fix it.</li>
                    <li>Debugging is only allowed during the green light.</li>
                    <li>If they write during the red light, 5 won is deducted.</li>
                    <li>Pairs with less than 75 won are eliminated.</li>
                  </ul>
                </div>
                <div className="rule-box">
                  <b>Level 2: Tug of War (Aptitude & Logic Face-off)</b>
                  <ul>
                    <li>The remaining pairs will be split into two teams.</li>
                    <li>Both teams receive the same set of aptitude and logical reasoning questions.</li>
                    <li>Correct answers move the virtual rope toward their team’s side.</li>
                    <li>The team that pulls the rope completely to their side wins the round, while the other team is eliminated.</li>
                  </ul>
                </div>
                <div className="rule-box">
                  <b>Level 3: Single and Mingle (Algorithmic Showdown)</b>
                  <ul>
                    <li>Each pair will receive an algorithm and pseudo code.</li>
                    <li>The team should predict the suitable data structure to solve it and complete the code.</li>
                    <li>The teams that correctly implement them will be declared the winners.</li>
                  </ul>
                </div>
              </div>
              <p>This is your moment to prove your coding survival skills. Can you and your partner outthink, outcode, and outlast the competition?</p>
            </div>
          )}
        </div>
      </div>
      <div className="photo-grid">
        <div className="grid-item">
          <img src="/images/SquidGame.png" alt="Game 1" />
        </div>
        <div className="grid-item">
          <img src="/images/SquidGame.png" alt="Game 2" />
        </div>
        <div className="grid-item">
          <img src="/images/SquidGame.png" alt="Game 3" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

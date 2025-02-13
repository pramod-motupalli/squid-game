import React, { useState } from "react";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("intro");

  return (
    <div className="home-container flex flex-col items-center justify-center p-2 bg-black w-screen h-screen text-white">
      {/* Main Content Box */}
      <div className="slider w-[80vw] bg-white/20 p-4 rounded-lg shadow-lg text-center h-[65vh] flex flex-col justify-between">
        {/* Tab Buttons */}
        <div className="tab-buttons flex justify-center gap-4 w-full">
          <button
            onClick={() => setActiveTab("intro")}
            className={`px-4 py-2 border-none bg-blue-700 text-white cursor-pointer rounded-md transition-all text-lg ${
              activeTab === "intro" ? "bg-blue-900" : "hover:bg-blue-900"
            }`}
          >
            Introduction
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`px-4 py-2 border-none bg-blue-700 text-white cursor-pointer rounded-md transition-all text-lg ${
              activeTab === "about" ? "bg-blue-900" : "hover:bg-blue-900"
            }`}
          >
            About Us
          </button>
          <button
            onClick={() => setActiveTab("rules")}
            className={`px-4 py-2 border-none bg-blue-700 text-white cursor-pointer rounded-md transition-all text-lg ${
              activeTab === "rules" ? "bg-blue-900" : "hover:bg-blue-900"
            }`}
          >
            Rules
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content flex-grow overflow-y-auto mt-4">
          {/* Introduction Tab */}
          {activeTab === "intro" && (
            <div className="intro-section">
              <h1 className="text-3xl font-bold mb-4">Welcome to Cresence 2K25</h1>
              <p className="text-lg">
                <b className="text-blue-500">Get ready for an electrifying experience!</b>
                <br />
                Cresence 2K25 is more than just a tech fest—it’s a celebration of innovation, competition, and creativity.  
                Organized by the third-year students of JNTU GV's CSE department, this national-level fest brings together  
                some of the sharpest minds from across the country.
              </p>
            </div>
          )}

          {/* About Us Tab */}
          {activeTab === "about" && (
            <div className="about-section">
              <h1 className="text-3xl font-bold mb-4">About Us</h1>
              <p className="text-lg">
                <b className="text-blue-500">
                  Cresence2K25: A National-Level Tech Fest by JNTU GV CSE 3rd Year Students
                </b>
                <br />
                Welcome to Cresence, an exciting and vibrant national-level tech fest organized by the third-year students  
                of the Computer Science and Engineering department at JNTU Guntur (JNTU GV). This fest brings together  
                the brightest minds from across the country to showcase their creativity, skills, and passion for technology.
              </p>
            </div>
          )}

          {/* Rules Tab */}
          {activeTab === "rules" && (
            <div className="rules-section ">
              
              <div className="rules-grid flex flex-wrap justify-center gap-3">
                <div className="rule-box bg-white/10 p-4 rounded-lg shadow-md text-center border border-white/30 w-[30%]">
                  <b className="text-lg text-blue-500">Level 1: Red Light, Green Light (Debugging Battle)</b>
                  <ul className="text-left pl-4 mt-2">
                    <li>Participants will compete in pairs from the start.</li>
                    <li>Each pair starts with 100 won.</li>
                    <li>A buggy code will be given along with an editor to fix it.</li>
                    <li>Debugging is only allowed during the green light.</li>
                    <li>If they write during the red light, 5 won is deducted.</li>
                    <li>Pairs with less than 75 won are eliminated.</li>
                  </ul>
                </div>

                <div className="rule-box bg-white/10 p-4 rounded-lg shadow-md text-center border border-white/30 w-[30%]">
                  <b className="text-lg text-blue-500">Level 2: Tug of War (Aptitude & Logic Face-off)</b>
                  <ul className="text-left pl-4 mt-2">
                    <li>The remaining pairs will be split into two teams.</li>
                    <li>Both teams receive the same set of aptitude and logical reasoning questions.</li>
                    <li>Correct answers move the virtual rope toward their team’s side.</li>
                    <li>The team that pulls the rope completely to their side wins the round.</li>
                  </ul>
                </div>

                <div className="rule-box bg-white/10 p-4 rounded-lg shadow-md text-center border border-white/30 w-[30%]">
                  <b className="text-lg text-blue-500">Level 3: Single and Mingle (Algorithmic Showdown)</b>
                  <ul className="text-left pl-4 mt-2">
                    <li>Each pair will receive an algorithm and pseudo code.</li>
                    <li>The team should predict the suitable data structure to solve it and complete the code.</li>
                    <li>The teams that correctly implement them will be declared the winners.</li>
                  </ul>
                </div>
              </div>
              
            </div>
          )}
        </div>
      </div>

      {/* Image Grid */}
      <div className="photo-grid flex gap-4 justify-center mt-6 w-full">
        <div className="grid-item w-[22vw] h-[35vh] bg-[url('/images/SquidGame.png')] bg-no-repeat bg-center bg-cover rounded-md shadow-sm"></div>
        <div className="grid-item w-[22vw] h-[35vh] bg-[url('/images/SquidGame.png')] bg-no-repeat bg-center bg-cover rounded-md shadow-sm"></div>
        <div className="grid-item w-[22vw] h-[35vh] bg-[url('/images/SquidGame.png')] bg-no-repeat bg-center bg-cover rounded-md shadow-sm"></div>
      </div>

      {/* Next Button */}
      <button
        type="submit"
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-blue-700 text-white px-6 py-3 text-lg rounded-md hover:bg-blue-900"
      >
        Next
      </button>
    </div>
  );
};

export default HomePage;

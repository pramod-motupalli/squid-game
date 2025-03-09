import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage.jsx";
import HomePage from "./HomePage.jsx";
import Level1Instructions from "./level1instructions.jsx";
import RedLightGreenLight from "./RedLightGreenLight.jsx";
import Level2instructions from "./Level2instructions";
import TugOfWar from "./TugOfWar.jsx";
import Level3instructions from "./Level3instructions";
import Symbols from "./Symbols.jsx";
import SingleAndMingle from "./SingleAndMingle.jsx";
import TugOfWarDisqualified from "./TugOfWarDisqualified.jsx";
import Thankyou from "./Thankyou.jsx";
import ContinuousBloodStainEffect from "./ContinuousRedTrailEffect"; // Import the effect
import PairingButton from "./pair.jsx";
import LeaderBoard from "./leaderboard.jsx";
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      {/* Render the BloodStainEffect component so it applies globally */}
      <ContinuousBloodStainEffect />

      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <LoginPage />}
        />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/pair" element={<PairingButton />} />
        <Route path="/level1-instructions" element={<Level1Instructions />} />
        <Route path="/level1/game" element={<RedLightGreenLight />} />
        <Route path="/Level2instructions" element={<Level2instructions />} />

        <Route path="/TugOfWar" element={<TugOfWar />} />
        <Route path="/Level3instructions" element={<Level3instructions />} />
        <Route path="/Symbols" element={<Symbols />} />
        <Route path="/SingleAndMingle" element={<SingleAndMingle />} /> 
        <Route path="/TugOfWarDisqualified" element={<TugOfWarDisqualified />} />
        <Route path="/SingleAndMingle" element={<SingleAndMingle />} />
        <Route path="/Thankyou" element={<Thankyou />} />
        <Route path="/LeaderBoard" element={<LeaderBoard />} />
      </Routes>
    </Router>
  );
};

export default App;

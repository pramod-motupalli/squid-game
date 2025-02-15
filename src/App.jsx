import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage.jsx";
import HomePage from "./HomePage.jsx";
import Level1Instructions from "./level1instructions.jsx";
import RedLightGreenLight from "./RedLightGreenLight.jsx";
import Level2instructions from "./Level2instructions";
import TugOfWar from "./TugOfWar.jsx";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (username, password) => {
    if (
      (username === "player531" && password === "Pramod") ||
      (username === "player526" && password === "Snehitha") ||
      (username === "player572" && password === "Bhavani")
    ) {
      setIsAuthenticated(true);
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <HomePage /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/level1-instructions" element={<Level1Instructions />} />
        <Route path="/level1/game" element={<RedLightGreenLight />} />
        <Route path="/Level2instructions" element={<Level2instructions />} /> 
        <Route path="/TugOfWar" element={<TugOfWar />} />
      </Routes>
    </Router>
  );
};

export default App;
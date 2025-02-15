import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage.jsx";
import HomePage from "./HomePage.jsx";
import Level1Instructions from "./level1instructions.jsx";
import RedLightGreenLight from "./RedLightGreenLight.jsx";
import Level2Instructions from "./Level2instructions.jsx";
import TugOfWar from "./TugOfWar.jsx";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const handleLogin = (username, password) => {
    if (
      (username === "player531" && password === "Pramod") ||
      (username === "player526" && password === "Snehitha") ||
      (username === "player572" && password === "Bhavani")
    ) {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/level1-instructions" element={<Level1Instructions />} />
        <Route path="/level1/game" element={<RedLightGreenLight />} />
        <Route path="/level2-instructions" element={<Level2Instructions />} />
        <Route path="/tug-of-war" element={<TugOfWar />} />
      </Routes>
    </Router>
  );
};

export default App;

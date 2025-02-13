import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage.jsx";
import HomePage from "./HomePage.jsx";
import Level1Instructions from "./level1instructions.jsx";

const users = [
  { username: "player531", password: "Pramod" },
  { username: "player526", password: "Snehitha" },
  { username: "player572", password: "Bhavani" },
];

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (username, password) => {
    const isValidUser = users.some(user => user.username === username && user.password === password);
    
    if (isValidUser) {
      setIsAuthenticated(true);
      setError(""); // Clear errors on successful login
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <LoginPage onLogin={handleLogin} error={error} />} />

        {/* Home Page (after login) */}
        <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/" />} />

        {/* Level 1 Instructions */}
        <Route path="/level1-instructions" element={isAuthenticated ? <Level1Instructions /> : <Navigate to="/" />} />

        {/* Redirect any unknown path to login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;

// src/LoginPage.jsx
import React, { useState } from "react";
import "./LoginPage.css";
import { Square, Circle, Triangle } from "lucide-react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add login validation or logic here.
    alert(`Logging in as ${username}`);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">
          <Circle size={75} />
          <Triangle size={75} />
          <Square size={75} />
        </div>
        <h1>Login to Squid Game</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useState } from "react";
import LoginPage from "./LoginPage.jsx";
import HomePage from "./HomePage.jsx";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (username, password) => {
    if ((username === "player531" && password === "Pramod") ||(username === "player526" && password === "Snehitha") ||(username === "player572" && password === "Bhavani")){
      setIsAuthenticated(true);
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      {isAuthenticated ? <HomePage /> : <LoginPage onLogin={handleLogin} />}
    </div>
  );
};

export default App;

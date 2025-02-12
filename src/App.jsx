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
      {/* <h6 className="text-black">Squid Game</h6>    */}
    </div>
  );
};

export default App;

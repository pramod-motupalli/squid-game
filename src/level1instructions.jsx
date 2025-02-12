import React from "react";
import { useNavigate } from "react-router-dom";

const Level1Instructions = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Level 1: Red Light, Green Light (Debugging Battle)</h1>
      <p>Welcome to the first level of the competition! Follow the instructions carefully:</p>
      <ul>
        <li>Participants will compete in pairs from the start.</li>
        <li>Each pair starts with 100 won.</li>
        <li>A buggy code will be given along with an editor to fix it.</li>
        <li>Debugging is only allowed during the green light.</li>
        <li>If they write during the red light, 5 won is deducted.</li>
        <li>Pairs with less than 75 won are eliminated.</li>
      </ul>
      <button onClick={() => navigate("/level1/game")}>
        Start Level 1
      </button>
    </div>
  );
};

export default Level1Instructions;

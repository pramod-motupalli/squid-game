import React, { useState } from "react";
import { Square, Circle, Triangle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log(data);
      const handleLogin = async (username, password) => {
        try {
          const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
          });

          const data = await response.json();

          if (data) {
            localStorage.setItem("username", username); // Store username in localStorage
            console.log("Login successful:", data);
            
          } else {
            console.error("Login failed:", data.message);
          }
        } catch (error) {
          console.error("Request failed:", error);
        }
      };

      if (data) {
        setMessage(`✅ Welcome, ${data.user.username}!`);
        localStorage.setItem("username", data.user.username);
        console.log(data.user.level2);
        handleLogin(username, password);
        if (data.user.eliminated) {
          navigate("/TugOfWarDisqualified");
        } else {
          if (data.user.level2) {
            navigate("/TugOfWar");
          } else {
            if (data.user.level1) {
              navigate("/level1/game");
            }
            else{
              navigate("/HomePage");
            }
          }
        }
       
        // onLogin(data.user); // Pass user data to parent component if needed
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage("❌ Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen w-full bg-cover bg-center bg-no-repeat px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        backgroundImage: "url('/images/squid game landscape(pramod).png')",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-10 z-0"></div>

      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: showForm ? "0%" : "100%", opacity: showForm ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="relative p-6 sm:p-8 rounded-lg w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl text-center z-10"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div className="flex justify-center mb-5 space-x-2">
          <Circle size={50} className="text-white" />
          <Triangle size={50} className="text-white" />
          <Square size={50} className="text-white" />
        </div>
        <h1 className="text-cyan-700 font-bold text-2xl sm:text-3xl mb-5">
          Login to Squid Game
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-left">
            <label className="block mb-1 text-emerald-50 text-3xl">Email</label>
            <input
              type="text"
              placeholder="Enter E-mail"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white focus:outline-none focus:border-red-600"
            />
          </div>
          <div className="mb-4 text-left">
            <label className="block mb-1 text-emerald-50 text-3xl">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white focus:outline-none focus:border-red-600"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-400 text-black font-roboto text-lg rounded cursor-pointer hover:bg-blue-500 active:bg-blue-400"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && <p className="mt-4 text-white">{message}</p>}
      </motion.div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="absolute bottom-10 bg-blue-400 text-black font-bold px-4 py-2 rounded cursor-pointer hover:bg-blue-500 z-10"
      >
        {showForm ? "Hide Login" : "Show Login"}
      </button>
    </div>
  );
};

export default LoginPage;

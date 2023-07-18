import React, { useState } from "react";
import "./Join.css";
import logo from "../Images/logo2.png";
import { Link } from "react-router-dom";

let user;

const Join = () => {
  const [name, setName] = useState("");

  const handleLogin = (e) => {
    if (!name) {
      e.preventDefault();
      alert("Please enter your name");
    }
  };

  const sendUser = () => {
    user = document.getElementById("joinInput").value;
    document.getElementById("joinInput").value = "";
  };

  return (
    <>
      <div className="join-page">
        <div className="join-container">
          <img src={logo} alt="logo" className="chatlogo" />
          <h1 className="title">Live Chat</h1>
          <div className="btn-container">
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              id="joinInput"
              placeholder="Enter your name"
            />
            <Link to="/chat" onClick={handleLogin}>
              <button className="join-btn" onClick={sendUser}>
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Join;
export { user };

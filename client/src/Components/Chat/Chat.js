import React, { useEffect, useState } from "react";
import socketIo from "socket.io-client";
import "./Chat.css";
import sendLogo from "../Images/send.png";
import { user } from "../Join/Join";

let socket;
const ENDPOINT = "http://localhost:5000";

const Chat = () => {
  const [id, setId] = useState("");

  const sendMessage = () => {
    const message = document.getElementById("chatInput").value;
    socket.emit("message", { message, id });
    document.getElementById("chatInput").value = "";
  };

  useEffect(() => {
    socket = socketIo(ENDPOINT, { transports: ["websocket"] });

    socket.on("connect", () => {
      alert("connected");
      setId(socket.id);
    });

    console.log(socket);
    socket.emit("joined", { user });

    socket.on("welcome", (data) => {
      console.log(data.user, data.message);
    });
    socket.on("userJoined", (data) => {
      console.log(data.user, data.message);
    });
    socket.on("leave", (data) => {
      console.log(data.user, data.message);
    });

    return () => {
      socket.disconnect("disconnect");
      socket.off();
    };
  }, []);

  useEffect(() => {
    socket.on("sendMessage", (data) => {
      console.log(data.user, data.message, data.id);
    });
    return () => {};
  }, []);

  return (
    <>
      <div className="chat-page">
        <div className="chat-container">
          <div className="header"></div>
          <div className="chat-box"></div>
          <div className="input-box">
            <input type="text" id="chatInput" />
            <button className="send-btn" onClick={sendMessage}>
              <img src={sendLogo} className="send-logo" alt="sendLogo" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;

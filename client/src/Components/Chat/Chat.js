import React, { useEffect, useState } from "react";
import socketIo from "socket.io-client";
import "./Chat.css";
import sendLogo from "../Images/send.png";
import { user } from "../Join/Join";
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import closeIcon from "../Images/close.png";
import logo from "../Images/logo2.png";

let socket;
const ENDPOINT = "http://localhost:5000";

const Chat = () => {
  const [id, setId] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    const message = document.getElementById("chatInput").value;
    socket.emit("message", { message, id });
    document.getElementById("chatInput").value = "";
  };
  console.log(messages);
  useEffect(() => {
    socket = socketIo(ENDPOINT, { transports: ["websocket"] });

    socket.on("connect", () => {
      setId(socket.id);
    });

    console.log(socket);
    socket.emit("joined", { user });

    socket.on("welcome", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message);
    });
    socket.on("userJoined", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message);
    });
    socket.on("leave", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message);
    });

    return () => {
      socket.disconnect("disconnect");
      socket.off();
    };
  }, []);

  useEffect(() => {
    socket.on("sendMessage", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message, data.id);
    });
    return () => {
      socket.off();
    };
  }, [messages]);

  return (
    <>
      <div className="chat-page">
        <div className="chat-container">
          <div className="header">
            <div className="logo-container">
              <img className="chatLogo" src={logo} alt="logo" />
              <h2 className="chat-head">Live Chat</h2>
            </div>
            <a href="/">
              <img className="close-icon" src={closeIcon} alt="closeIcon" />
            </a>
          </div>
          <ReactScrollToBottom className="chat-box">
            {messages.map((item, i) => (
              <Message
                message={item.message}
                classs={item.id === id ? "right" : "left"}
                user={item.id === id ? "" : item.user}
              />
            ))}
          </ReactScrollToBottom>
          <div className="input-box">
            <input
              type="text"
              id="chatInput"
              placeholder="Message"
              onKeyPress={(event) =>
                event.key === "Enter" ? sendMessage() : null
              }
            />
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

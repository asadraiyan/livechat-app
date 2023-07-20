import React from "react";
import "./Message.css";

const Message = ({ user, message, classs, time }) => {
  console.log("time in message =", time);
  if (user) {
    return (
      <div className={`message-box ${classs}`}>
        <div className="message-text">{`${user}: ${message}`}</div>
        <time>{time}</time>
      </div>
    );
  } else {
    return (
      <div className={`message-box ${classs}`}>
        <div className="message-text">{`You: ${message}`}</div>
        <time>{time}</time>
      </div>
    );
  }
};

export default Message;

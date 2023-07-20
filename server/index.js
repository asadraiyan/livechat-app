const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const users = [{}];

app.use(cors());

const server = http.createServer(app);

function getCurrentTime() {
  const now = new Date();
  const options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "Asia/Kolkata", // IST timezone
  };

  return now.toLocaleString("en-US", options);
}

console.log(getCurrentTime()); // Output example: "10:30 PM"

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("New connection");

  socket.on("joined", ({ user }) => {
    // console.log(user);
    users[socket.id] = user;
    // console.log(users);
    console.log(`${user} has joined`);
    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: `${users[socket.id]} has joined`,
      time: getCurrentTime(),
    });
    socket.emit("welcome", {
      user: "Admin",
      message: `Welcome to the chat, ${users[socket.id]}`,
      time: getCurrentTime(),
    });

    socket.on("message", ({ message, id }) => {
      io.emit("sendMessage", {
        user: users[id],
        message,
        id,
        time: getCurrentTime(),
      });
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", {
      user: "Admin",
      message: `${users[socket.id]} has left`,
      time: getCurrentTime(),
    });
    console.log("User has left");
  });
});

app.get("/", (req, res) => {
  res.send("This is the server running");
});

server.listen(5000, () => {
  console.log("server running");
});

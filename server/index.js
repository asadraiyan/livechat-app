const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const users = [{}];

app.use(cors());

const server = http.createServer(app);

const currentTime = () => {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const amOrPm = hours >= 12 ? "pm" : "am";

  // Convert to 12-hour format
  hours = hours % 12 || 12;

  // Add leading zero to minutes if necessary
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return `${hours}:${minutes} ${amOrPm}`;
};

console.log("current time =", currentTime());

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
      time: currentTime(),
    });
    socket.emit("welcome", {
      user: "Admin",
      message: `Welcome to the chat, ${users[socket.id]}`,
      time: currentTime(),
    });

    socket.on("message", ({ message, id }) => {
      io.emit("sendMessage", {
        user: users[id],
        message,
        id,
        time: currentTime(),
      });
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", {
      user: "Admin",
      message: `${users[socket.id]} has left`,
      time: currentTime(),
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

const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const users = [{}];

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000/",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New connection");

  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    console.log(`${user} has joined`);
    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: `${users[socket.id]} has joined`,
    });
    socket.emit("welcome", {
      user: "Admin",
      message: `Welcome to the chat, ${users[socket.id]}`,
    });

    socket.on("message", ({ message, id }) => {
      io.emit("sendMessage", { user: users[id], message, id });
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", {
      user: "Admin",
      message: `${users[socket.id]} has left`,
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

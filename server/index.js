const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", () => {
  console.log("New connection");
});

app.get("/", (req, res) => {
  res.send("This is the server running");
});

server.listen(5000, () => {
  console.log("server running");
});

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Update with your frontend URL
    methods: ["GET", "POST"],
  },
});

let messages = []; // Array to store messages

// Enable CORS for the Express app
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  // Send previous messages to the new user
  socket.emit("previous messages", messages);

  socket.on("chat message", (msg) => {
    messages.push(msg);
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const messageRoute = require("./routes/messageRoute");
const socket = require("socket.io");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use("/api/auth", userRoute);
app.use("/api/message", messageRoute);
app.use("*", (req, res, next) => {
  res.status(404).json({ status: false, massage: "Route Not Found" });
});
app.use((err, req, res, next) => {
  res.status(500).json({ status: false, massage: err.message });
  next(err);
});
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err.message);
  });
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

const io = socket(server, { cors: { origin: "*", Credential: true } });

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.message);
    }
  });
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const socket = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(` *********** server started at ${PORT}`);
});

io = socket(server);

io.on("connection", (socket) => {
  console.log(socket.id);
  var userid;
  var roomid;

  var lobbyID;
  var userName;

  // Lobby
  socket.on("lobby_join", (data) => {
    socket.join(data.code);
    console.log(data.user + " has join the lobby : " + data.code);
  });

  socket.on("join_request", (data) => {
    //console.log(data);
    socket.to(data.room).emit("peer_request", data);
    console.log("FROM : " + data.user + " sent a join request " + data.message);
  });

  socket.on("join_response", (data) => {
    socket.to(data.room).emit("peer_response", data.message);
    console.log("A response send from User to " + data.message);
  });

  socket.on("lobby_start", (data) => {});

  socket.on("lobby_dismiss", (data) => {});

  //Chatroom
  socket.on("chatRoom_join", (data) => {
    socket.join(data.code);
    userid = data.user;
    roomid = data.code;
    console.log(data.user + " joinned chatroom:" + data.code);
  });

  socket.on("send_message", (data) => {
    console.log(
      "**** " + data.content.author + " SENT " + data.content.message
    );
    socket.to(data.room).emit("receive_message", data.content);
  });

  socket.on("userTyping", (data) => {
    socket.to(roomid).emit("receive_userTyping", data);
  });

  //DC
  socket.on("disconnect", () => {
    console.log(userid + " has disconnected from " + roomid);
    socket.to(roomid).emit("dcNotice", userid + " has disconnected");
  });
});

app.use(authRoutes);

app.use(chatRoutes);

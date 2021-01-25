require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const socket = require("socket.io");
const jwt = require("jsonwebtoken");
const { response } = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const PORT = 3001;

const server = app.listen(PORT, () => {
  console.log(` *********** server started at ${PORT}`);
});

const activeSocketRoomKey = [];

io = socket(server);

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("join_room", (data) => {
    socket.join(data.code);
    console.log(data.user + " joinned room:" + data.code);
  });

  socket.on("send_message", (data) => {
    console.log(
      "**** " + data.content.author + " SENT " + data.content.message
    );
    socket.to(data.room).emit("receive_message", data.content);
  });

  socket.on("join_request", (data) => {
    //console.log(data);
    socket.to(data.room).emit("peer_request", data.message);

    console.log("A request send from User to " + data.message);
  });

  socket.on("join_response", (data) => {
    socket.to(data.room).emit("peer_response", data.message);
    console.log("A response send from User to " + data.message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const db = mysql.createConnection({
  user: "root",
  password: "password",
  host: "localhost",
  database: "db_uat",
});

app.post("/register", (req, res) => {
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "INSERT INTO users(user_name,PASSWORD) VALUES(?,?)",
    [username, password],
    (err, result) => {
      if (err) {
        console.log("err: " + err);
      } else {
        res.send({ message: "registered" });
      }
    }
  );
});

const verifiyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.sendStatus(403);
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.sendStatus(403);
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};

app.get("/isUserAuth", verifiyJWT, (req, res) => {
  res.send("YO ! you are authenticated");
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM users WHERE user_name= ? AND password=?",
    [username, password],
    (err, result) => {
      if (err) {
        console.log("err: " + err);
      } else if (result.length > 0) {
        const id = result[0].id;
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: 3000,
        });
        console.log("result: " + result);
        res.json({ auth: true, token: token, result: result });
      } else if (result.length == 0) {
        console.log("user login attempt fail");
        res.json({ auth: false, message: "Login attempt fail" });
      }
    }
  );
});

const fakeToken = "000";

const genSocketRoomKey = () => {
  return Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
};

app.post("/keygen", verifiyJWT, (req, res) => {
  activeSocketRoomKey.push({
    code: genSocketRoomKey(),
    timestamp: parseInt(`${Date.now()}`),
  });
  console.log(activeSocketRoomKey);
  console.log("Accpetd keygen request");
  res.send({
    code: activeSocketRoomKey[activeSocketRoomKey.length - 1].code,
  });
});

app.post("/chatrequest", (req, res) => {
  if (req.body.code == "555") {
    res.send({ message: "accepted" });
  }
});

function isValidKey(key) {
  const ts = activeSocketRoomKey.find(({ code }) => code === key);
  //60s expire time
  if (ts == undefined || Date.now() - ts.timestamp > 60000) {
    return false;
  } else {
    return true;
  }
}

app.post("/keyverify", (req, res) => {
  console.log("Key verification reqest on code: " + req.body.code);
  if (isValidKey(parseInt(req.body.code))) {
    res.send({ message: true });
  } else {
    res.send({ message: false });
  }
});

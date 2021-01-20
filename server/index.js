const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const socket = require("socket.io");
const { response } = require("express");
const e = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const PORT = 3001;

const server = app.listen(PORT, () => {
  console.log(` *********** server started at ${PORT}`);
});

const activeSessionKey = [
  {
    code: 555,
    timestamp: 1610629164099,
  },
  {
    code: 666,
    timestamp: 1610629164099,
  },
];

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

app.post("/login", (req, res) => {
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM users WHERE user_name= ? AND password=?",
    [username, password],
    (err, result) => {
      if (err) {
        console.log("err: " + err);
      } else if (result.length > 0) {
        console.log("result: " + result);
        res.send({ message: "tempToken" });
      } else if (result.length == 0) {
        console.log("user login attpemt fail");
        res.send({ message: "fail" });
      }
    }
  );
});

const fakeToken = "000";

const genSessionKey = () => {
  //range from 100 - 999
  return Math.floor(Math.random() * (9999 - 100 + 1) + 100);
};

app.post("/keygen", (req, res) => {
  if (req.body.token == fakeToken) {
    activeSessionKey.push({
      code: genSessionKey(),
      timestamp: parseInt(`${Date.now()}`),
    });
    console.log(activeSessionKey);
    console.log("Accpetd keygen request");
    //console.log(activeSessionKey[0].code);
    res.send({ code: activeSessionKey[activeSessionKey.length - 1].code });
  }
});

app.post("/chatrequest", (req, res) => {
  if (req.body.code == "555") {
    res.send({ message: "accepted" });
  }
});

function isValidKey(key) {
  const ts = activeSessionKey.find(({ code }) => code === key);
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

console.log(isValidKey(555)); // { name: 'cherries', quantity: 5 }

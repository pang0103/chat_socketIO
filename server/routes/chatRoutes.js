const express = require("express");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const router = express.Router();

const activeSocketRoomKey = [];

const genSocketRoomKey = () => {
  return Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
};

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

router.post("/keygen", verifiyJWT, (req, res) => {
  activeSocketRoomKey.push({
    code: genSocketRoomKey(),
    roomid: uuidv4(),
    timestamp: parseInt(`${Date.now()}`),
  });
  console.log(activeSocketRoomKey);
  res.send({
    code: activeSocketRoomKey[activeSocketRoomKey.length - 1].code,
  });
});

router.post("/chatrequest", (req, res) => {
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

router.post("/keyverify", verifiyJWT, (req, res) => {
  console.log("Key verification reqest on code: " + req.body.code);
  if (isValidKey(parseInt(req.body.code))) {
    console.log("Key verify successful, returning room id to");
    res.send({ message: true });
  } else {
    res.send({ message: "Invalid access code" });
  }
});

module.exports = router;

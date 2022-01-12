const moment = require("moment");
const express = require("express");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

const router = express.Router();

const db = mysql.createConnection({
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  host: process.env.DB_HOST || "localhost:3306",
  database: process.env.DB_DB || "socketchat",
});

router.post("/register", (req, res) => {
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

router.post("/guest", (req, res) => {
  const userName = req.body.guestname;
  //TODO create a guest that active for 30 mins
  const expireOn = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

  console.log(userName + expireOn);

  db.query(
    "INSERT INTO guests(guest_name, expire_on) VALUES(?, ?)",
    [userName, expireOn],
    (err, result) => {
      if (err) {
        console.log(err);
        res.json({ auth: false, message: "guest session start failed" });
      } else {
        // res.send({ message: "guest session started" });
        const token = jwt.sign({ userName }, process.env.JWT_SECRET, { expiresIn: 3000 });
        res.json({ auth: true, token: token, message: "guest session started" });
      }
    }
  );
});

/*app.get("/isUserAuth", verifiyJWT, (req, res) => {
    res.send("YO ! you are authenticated");
  }); */

router.post("/login", (req, res) => {
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

module.exports = router;

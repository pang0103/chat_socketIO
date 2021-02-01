const express = require("express");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

const router = express.Router();

const db = mysql.createConnection({
  user: "root",
  password: "password",
  host: "localhost",
  database: "db_uat",
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

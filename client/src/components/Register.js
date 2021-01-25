import React, { useState } from "react";
import Axios from "axios";
import { serverhost } from "../api/url";
import "../css/register.css";

export default function Register(props) {
  const [usernameReg, setusernameReg] = useState("");
  const [passwordReg, setpasswordReg] = useState("");

  const [pagemessage, setpagemessage] = useState("");

  //reigster: req to backend
  const register = (e) => {
    e.preventDefault();
    if (usernameReg && passwordReg) {
      Axios.post(`${serverhost.url}/register`, {
        username: usernameReg,
        password: passwordReg,
      }).then((response) => {
        setpagemessage("Registered !");
      });
    }
  };

  return (
    <div className="form">
      <form style={{ border: "1px solid #1eaabd" }} onSubmit={register}>
        <div className="container fillinform">
          <h1>Sign Up</h1>
          <p>Please fill in this form to create an account.</p>
          <hr />
          <label htmlFor="email">
            <b>Username</b>
          </label>
          <input
            type="text"
            placeholder="Enter username"
            onChange={(e) => {
              setusernameReg(e.target.value);
            }}
            required
          />
          <label htmlFor="pwd">
            <b>Password</b>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            onChange={(e) => {
              setpasswordReg(e.target.value);
            }}
            required
          />
          <label htmlFor="pwd-repeat">
            <b>Repeat Password</b>
          </label>
          <input type="password" placeholder="Repeat Password" required />
          <p>
            By creating an account you agree to our{" "}
            <a href="#" style={{ color: "dodgerblue" }}>
              Terms &amp; Privacy
            </a>
            .
          </p>
          <p>
            Already have a account ?<a href="/login"> Login here</a>
          </p>
          <h4>{pagemessage}</h4>
          <input className="signupbtn buttonform" type="submit"></input>
        </div>
      </form>
    </div>
  );
}

import React, { useState } from "react";
import Axios from "axios";
import { serverhost } from "../api/url";

export default function Login(props) {
  const [usernameLogin, setusernameLogin] = useState("");
  const [passwordLogin, setpasswordLogin] = useState("");

  const [status, setstatus] = useState("");

  const login = (e) => {
    e.preventDefault();
    if (usernameLogin && passwordLogin) {
      Axios.post(`${serverhost.url}/login`, {
        username: usernameLogin,
        password: passwordLogin,
      }).then((response) => {
        console.log(response.data);
        if (!response.data.auth) {
          setstatus("username/password incorrect");
          console.log("username/password incorrect");
        } else {
          props.isAuth(true, usernameLogin);
          sessionStorage.setItem("token", response.data.token);
          sessionStorage.setItem("loginState", true);
          sessionStorage.setItem("userName", usernameLogin);
        }
      });
    }
  };

  return (
    <div className="form">
      <form style={{ border: "1px solid #1eaabd" }} onSubmit={login}>
        <div className="container fillinform">
          <h1>Login</h1>
          <hr />
          <label htmlFor="email">
            <b>User name</b>
          </label>
          <input
            type="text"
            placeholder="Enter username"
            name="username"
            onChange={(e) => {
              setusernameLogin(e.target.value);
            }}
            required
          />
          <label htmlFor="psw">
            <b>Password</b>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            onChange={(e) => {
              setpasswordLogin(e.target.value);
            }}
            required
          />
          <p>
            Do not have a account ?<a href="/register"> Register here</a>
          </p>
          <h4 style={{ color: "red" }}>{status}</h4>
          <input className="signupbtn buttonform" type="submit"></input>
        </div>
      </form>
    </div>
  );
}

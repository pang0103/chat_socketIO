import React, { useState } from "react";
import Axios from "axios";
import { serverhost } from "../api/url";
import styles from "../css/signInOut.module.css";
import chat_logo from "../image/chat_logo.svg";

export default function Login(props) {
  const [usernameLogin, setusernameLogin] = useState("");
  const [passwordLogin, setpasswordLogin] = useState("");

  const [status, setstatus] = useState("");

  const login = (e) => {
    e.preventDefault();
    if (usernameLogin && passwordLogin) {
      Axios.post(`${serverhost.api_endpoint}/login`, {
        username: usernameLogin,
        password: passwordLogin,
      }).then((response) => {
        console.log(response.data);
        if (!response.data.auth) {
          setstatus("username/password incorrect");
          //console.log("username/password incorrect");
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
    <div className={styles.loginPage}>
      <div className={`${styles.wrapper} ${styles.fadeInDown}`}>
        <div className={styles.formContent}>
          {/* Tabs Titles */}
          <h2 className={styles.active}>Sign In</h2>
          {/* Icon */}
          <div className={`${styles.fadeIn} ${styles.first}`}>
            <img src={chat_logo} className={styles.icon} />
          </div>
          {/* Login Form */}
          <form onSubmit={login}>
            <input
              type="text"
              className={`${styles.input} ${styles.fadeIn} ${styles.second}`}
              placeholder="username"
              onChange={(e) => {
                setusernameLogin(e.target.value);
              }}
              required
            />
            <input
              type="password"
              className={`${styles.input} ${styles.fadeIn} ${styles.third}`}
              placeholder="password"
              name="password"
              onChange={(e) => {
                setpasswordLogin(e.target.value);
              }}
              required
            />
            <input
              type="submit"
              className={`${styles.input} ${styles.fadeIn} ${styles.fourth}`}
              defaultValue="Log In"
            />
            <h4 style={{ color: "red", marginbottom: "10px" }}>{status}</h4>
          </form>
          {/* Remind Passowrd */}
          <div className={styles.formFooter}>
            <div className={styles.footerbox}>
              <a className={styles.underlineHover} href="/register">
                Register here !
              </a>
              <a className={styles.underlineHover} href="/guest">
                Guest mode
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

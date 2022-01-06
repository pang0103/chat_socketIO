import React, { useState } from "react";
import Axios from "axios";
import { serverhost } from "../api/url";
//import "../css/register.css";
import styles from "../css/signInOut.module.css";

export default function Register(props) {
  const [usernameReg, setusernameReg] = useState("");
  const [passwordReg, setpasswordReg] = useState("");

  const [pagemessage, setpagemessage] = useState("");

  //reigster: req to backend
  const register = (e) => {
    e.preventDefault();
    if (usernameReg && passwordReg) {
      Axios.post(`${serverhost.api_endpoint}/register`, {
        username: usernameReg,
        password: passwordReg,
      }).then((response) => {
        setpagemessage("Registered !");
      });
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={`${styles.wrapper} ${styles.fadeInDown}`}>
        <div className={styles.formContent}>
          {/* Tabs Titles */}
          <h2 className={`${styles.active}`}>sign up</h2>

          {/* Register Form */}
          <form onSubmit={register}>
            <label className={styles.label} for="username">
              User name :
            </label>
            <input
              className={styles.input}
              type="text"
              placeholder="username"
              name="username"
              onChange={(e) => {
                setusernameReg(e.target.value);
              }}
              required
            />
            <label className={styles.label} for="password">
              Password :
            </label>
            <input
              className={styles.input}
              type="password"
              placeholder="password"
              name="password"
              required
              onChange={(e) => {
                setpasswordReg(e.target.value);
              }}
            />
            <label className={styles.label} for="password">
              Repeat Password :
            </label>
            <input
              className={styles.input}
              type="password"
              placeholder="Repeat Password"
              name="password"
              required
            />
            <input className={styles.input} type="submit" defaultValue="Log In" />
            <h4 style={{ color: "red", marginbottom: "10px" }}></h4>
          </form>
          {/* Remind Passowrd */}

          <div className={styles.formFooter}>
            {pagemessage === "" ? (
              <div>
                Already have a account ?{" "}
                <a className={styles.underlineHover} href="/login">
                  Login here
                </a>
              </div>
            ) : (
              <div style={{ color: "green" }}>
                <b>{pagemessage} </b>
                <a className={styles.underlineHover} href="/login">
                  Login here
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

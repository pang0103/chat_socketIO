import React, { useState } from "react";
import Axios from "axios";
import { serverhost } from "../api/url";
import styles from "../css/signInOut.module.css";
import chat_logo from "../image/chat_logo.svg";

export default function Guest(props) {
  const [guestName, setGuestName] = useState("");
  const [status, setStatus] = useState("");

  const enterGuestMode = (e) => {
    e.preventDefault();
    if (guestName) {
      Axios.post(`${serverhost.api_endpoint}/guest`, {
        guestname: guestName,
      }).then((response) => {
        console.log(response.data);
        if (!response.data.auth) {
          console.log();
          setStatus(response.data.message);
        } else {
          props.isAuth(true, guestName);
          sessionStorage.setItem("token", response.data.token);
          sessionStorage.setItem("loginState", true);
          sessionStorage.setItem("userName", guestName);
        }
      });
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={`${styles.wrapper} ${styles.fadeInDown}`}>
        <div className={styles.formContent}>
          <h2 className={styles.active}>Guest mode</h2>
          <div className={`${styles.fadeIn} ${styles.first}`}>
            <img src={chat_logo} className={styles.icon} />
          </div>
          <form onSubmit={enterGuestMode}>
            <input
              type="text"
              className={`${styles.input} ${styles.fadeIn} ${styles.second}`}
              placeholder="nickname"
              onChange={(e) => {
                setGuestName(e.target.value);
              }}
              required
            ></input>
            <input type="submit" className={`${styles.input} ${styles.fadeIn} ${styles.fourth}`} />
            <h4 style={{ color: "red", marginbottom: "10px" }}>{status}</h4>
          </form>
        </div>
      </div>
    </div>
  );
}

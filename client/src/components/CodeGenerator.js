import React, { useState, useEffect } from "react";
import Axios from "axios";
import { serverhost } from "../api/url";
import styles from "../css/dashboard.module.css";
import styles2 from "../css/signInOut.module.css";

export default function CodeGenerator(props) {
  const [expireCounter, setexpireCounter] = useState(0);
  const [getKeyMessage, setgetKeyMessage] = useState("");

  useEffect(() => {
    let unmounted = false;

    expireCounter > 0 &&
      setTimeout(() => {
        if (!unmounted) {
          setexpireCounter(expireCounter - 1);
        }
      }, 1000);
    return () => {
      unmounted = true;
    };
  }, [expireCounter]);

  const startTimer = () => {
    setexpireCounter(60);
  };

  const getKey = () => {
    Axios.post(`${serverhost.url}/keygen`, null, {
      headers: {
        "x-access-token": sessionStorage.getItem("token"),
      },
    })
      .then((response) => {
        console.log(response.data.code);
        props.setaccessCode(response.data.code);
        startTimer();
      })
      .catch((error) => {
        switch (error.response.status) {
          case 403:
            setgetKeyMessage("Oops, something went wrong");
          default:
            break;
        }
      });
  };

  return (
    <div>
      <div
        className={`${styles2.wrapper} ${styles2.fadeInDown} ${styles.first}`}
      >
        <div className={styles2.formContent}>
          <form>
            <div>
              <div style={{ letterSpacing: "10px" }}>
                <h1 style={expireCounter === 0 ? { color: "#DCDCDC" } : null}>
                  {props.accessCode}
                </h1>
              </div>
              {expireCounter > 0 ? (
                <h5>After {expireCounter} second, the code will expire</h5>
              ) : (
                <h5>Code expired, please get a new code</h5>
              )}
            </div>
            {getKeyMessage}
          </form>

          <button
            className={styles2.button}
            style={
              expireCounter !== 0
                ? {
                    backgroundColor: "grey",
                  }
                : null
            }
            onClick={getKey}
            disabled={expireCounter !== 0}
          >
            Get a new key
          </button>
        </div>
      </div>
      <div className={styles.codeGeneratorCard}></div>
    </div>
  );
}

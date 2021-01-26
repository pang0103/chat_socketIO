import React, { useState, useEffect } from "react";
import Axios from "axios";
import { serverhost } from "../api/url";

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
      <div className="form">
        <form style={{ border: "1px solid #1eaabd" }}>
          <div className="container">
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
        {expireCounter == 0 ? (
          <button className="buttonform" onClick={getKey}>
            Get a new key
          </button>
        ) : null}
      </div>
    </div>
  );
}

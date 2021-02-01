import React, { useState, useEffect } from "react";
import styles from "../css/signInOut.module.css";

export default function CodeSubmitForm(props) {
  const [request_status_message, setrequest_status_message] = useState("");

  return (
    <div>
      <div className={`${styles.wrapper} ${styles.fadeInDown} ${styles.third}`}>
        <div className={styles.formContent}>
          <form>
            <div className="container">
              <label htmlFor="Code"></label>
              <h4 style={{ marginBottom: "20px", marginTop: "20px" }}>
                Access your peers chat channel
              </h4>
              <input
                className={styles.input}
                type="text"
                style={{
                  textAlign: "center",
                  letterSpacing: "10px",
                  margin: "10px",
                }}
                maxLength="4"
                placeholder="your peers code"
                onChange={(e) => {
                  if (e.target.value.length == 4) {
                    props.setJoin_accessCode(e.target.value);
                    console.log("AccessKey: " + e.target.value);
                  }
                }}
              />
            </div>
          </form>
          <button className={styles.button} onClick={props.request}>
            {" "}
            Join !{" "}
          </button>
          <h2>{request_status_message}</h2>
        </div>
      </div>
    </div>
  );
}

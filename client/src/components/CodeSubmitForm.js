import React, { useState, useEffect } from "react";

export default function CodeSubmitForm(props) {
  const [request_status_message, setrequest_status_message] = useState("");

  return (
    <div>
      <div className="form">
        <form style={{ border: "1px solid #1eaabd" }}>
          <div className="container">
            <label htmlFor="Code"></label>
            <h4>Access your peers chat channel</h4>
            <input
              type="text"
              style={{ textAlign: "center", letterSpacing: "10px" }}
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
        <button className="buttonform " onClick={props.request}>
          {" "}
          Join !{" "}
        </button>
        <h2>{request_status_message}</h2>
      </div>
    </div>
  );
}

import React from "react";
import "../css/navbar.css";

export default function Navbar(props) {
  return (
    <div>
      <ul>
        <li>
          <a className="active" href="/chat">
            Chat
          </a>
        </li>
        <li>
          <a href="/profile">Profile</a>
        </li>
        {!props.isAuth ? (
          <li style={{ float: "right" }}>
            <a href="/register">Register</a>
          </li>
        ) : null}
        <li style={{ float: "right" }}>
          <a style={{ float: "right" }}> {props.userName}</a>
        </li>
      </ul>
    </div>
  );
}

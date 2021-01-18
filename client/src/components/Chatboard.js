import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { serverhost } from "../api/url";
import io from "socket.io-client";
import "../css/chatboard.css";
import e from "cors";

let socket;

export default function Chatboard(props) {
  const [message, setmessage] = useState("");
  const [messageList, setmessageList] = useState([]);

  const channel = props.channel;
  const username = props.userName;

  const scroll = () => {
    let chat = document.getElementById("msger-chat");
    chat.scrollTop += 500;
  };

  useEffect(() => {
    socket = io(serverhost.url);
  }, [serverhost]);

  useEffect(() => {
    //socket.emit("join_room", props.channel);
    console.log("join_rom" + { user: props.userName, code: channel });
    socket.emit("join_room", { user: props.userName, code: channel });
  }, [channel]);

  useEffect(() => {
    console.log("received message");
    socket.on("receive_message", (data) => {
      setmessageList([...messageList, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  });

  useEffect(() => {
    scroll();
  }, [messageList]);
  const sendMessage = async (e) => {
    //prevent page refresh
    e.preventDefault();
    let messageContent = {
      room: channel,
      content: {
        author: username,
        message: message,
        timestamp: `${new Date()}`,
        //timestamp: `${Date.now()}`,
      },
    };

    await socket.emit("send_message", messageContent);
    setmessageList([...messageList, messageContent.content]);
    setmessage("");
    e.target.reset();
  };

  const displayTime = (stamp) => {
    var date = new Date(stamp);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();
    var formattedTime =
      hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

    return formattedTime;
  };

  //useEffect() to join room first.

  return (
    <div className="board-body">
      <section className="msger">
        <header className="msger-header">
          <div className="msger-header-title">
            <i className="fas fa-comment-alt" /> room ID: {channel}
          </div>
          <div className="msger-header-options">
            <span>
              <i className="fas fa-cog" />
            </span>
          </div>
        </header>
        <main id="msger-chat" className="msger-chat">
          {messageList.map((val, key) => {
            return (
              <div
                className={
                  val.author == username ? "msg right-msg" : "msg left-msg"
                }
              >
                <div className="msg-bubble">
                  <div className="msg-info">
                    <div className="msg-info-name">{val.author}</div>
                    <div className="msg-info-time">
                      {displayTime(val.timestamp)}
                    </div>
                  </div>
                  <div className="msg-text">{val.message}</div>
                </div>
              </div>
            );
          })}
        </main>
        <form onSubmit={sendMessage} className="msger-inputarea">
          <input
            type="text"
            className="msger-input"
            placeholder="Enter your message..."
            onChange={(e) => {
              setmessage(e.target.value);
            }}
          />
          <button className="msger-send-btn">Send</button>
        </form>
      </section>
    </div>
  );
}

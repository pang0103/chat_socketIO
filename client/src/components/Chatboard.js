import React, { useState, useEffect, useRef } from "react";
import { serverhost } from "../api/url";
import io from "socket.io-client";
import "../css/chatboard.css";
import "../css/typingDot.css";

let socket;

export default function Chatboard(props) {
  const [message, setmessage] = useState("");
  const [messageList, setmessageList] = useState([]);
  const [connetionStatus, setconnetionStatus] = useState("");
  const [userTyping, setuserTyping] = useState(false);

  const channel = props.channel;
  const username = props.userName;

  useEffect(() => {
    socket = io(serverhost.server_end_point, {
      path: "/socketio",
    });
  }, [serverhost]);

  useEffect(() => {
    window.addEventListener("beforeunload", (ev) => {
      ev.returnValue = "Are you sure ?";
    });
  }, [serverhost]);

  useEffect(() => {
    //socket.emit("join_room", props.channel);
    console.log("chatRoom_join" + { user: props.userName, code: channel });
    socket.emit("chatRoom_join", { user: props.userName, code: channel });
  }, [channel]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setmessageList([...messageList, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  });

  useEffect(() => {
    socket.on("dcNotice", (data) => {
      setconnetionStatus(data);
    });

    return () => {
      socket.off("dcNotice");
    };
  });

  useEffect(() => {
    socket.on("receive_userTyping", (data) => {
      //console.log("eff" + data);
      setuserTyping(true);
    });

    const interval = setInterval(() => {
      setuserTyping(false);
    }, 2000);

    return () => {
      socket.off("receive_userTyping");
      //console.log("*********************************************");
      clearInterval(interval);
    };
  });

  const scroll = () => {
    let chat = document.getElementById("msger-chat");
    chat.scrollTop += 500;
  };

  useEffect(() => {
    scroll();
  }, [messageList]);

  const sendMessage = async (e) => {
    //prevent page refresh
    e.preventDefault();
    //console.log(e.target.value);
    if (message !== "") {
      let messageContent = {
        room: channel,
        content: {
          author: username,
          message: message,
          timestamp: `${new Date()}`,
        },
      };

      await socket.emit("send_message", messageContent);
      setmessageList([...messageList, messageContent.content]);
      setmessage("");
      e.target.reset();
    }
  };

  const sendTypingStatus = async () => {
    //console.log("typing");
    await socket.emit("userTyping", "is typing");
  };

  const displayTime = (stamp) => {
    var date = new Date(stamp);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();
    var formattedTime = hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

    return formattedTime;
  };

  return (
    <div className="board-body">
      <section className="msger">
        <header className="msger-header">
          <div className="msger-header-title">
            <i className="fas fa-comment-alt" />

            <div>Room ID: {channel}</div>
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
              <div className={val.author == username ? "msg right-msg" : "msg left-msg"}>
                <div className="msg-bubble">
                  <div className="msg-info">
                    <div className="msg-info-name">{val.author}</div>
                    <div className="msg-info-time">{displayTime(val.timestamp)}</div>
                  </div>
                  <div className="msg-text">{val.message}</div>
                </div>
              </div>
            );
          })}
          {userTyping ? (
            <div className="msg-bubble-typing">
              <div style={{ margin: "auto" }} className="dot-pulse"></div>
            </div>
          ) : null}
          {connetionStatus == "" ? null : (
            <div className="msg-bubble-announcement" style={{ color: "red" }}>
              {connetionStatus}
            </div>
          )}
        </main>
        <form onSubmit={sendMessage} className="msger-inputarea">
          <input
            type="text"
            className="msger-input"
            placeholder="Enter your message..."
            onChange={(e) => {
              setmessage(e.target.value);
              sendTypingStatus();
            }}
            disabled={connetionStatus == "" ? "" : "disabled"}
          />
          <button className="msger-send-btn" disabled={connetionStatus == "" ? "" : "disabled"}>
            Send
          </button>
        </form>
      </section>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import Axios from "axios";
import { serverhost } from "../api/url";
import io from "socket.io-client";
import Modal from "react-modal";
import axios from "axios";

let socket;

export default function AccessKey(props) {
  const [accessID, setaccessID] = useState("");
  const [accessCode, setaccessCode] = useState("----");

  const [expireCounter, setexpireCounter] = useState(0);

  const [join_accessCode, setjoin_accessCode] = useState("");

  const [peerJoinrequest, setpeerJoinrequest] = useState(false);

  const [request_status_message, setrequest_status_message] = useState("");
  const [receivedRequest, setreceivedRequest] = useState(false);

  const fakeToken = "000";

  // TO DO:
  // move the socket instance to chatboard
  // JOIN ! btn to check backend code valid, YES: set props.isJOin true and redirect to /Chatboard NO: false mesage
  // and pass joincode to chatboard
  // If

  useEffect(() => {
    socket = io(serverhost.url);
  }, [serverhost]);

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

  //Join the socket room with access code
  useEffect(() => {
    console.log("Access Code chagned");
    socket.emit("join_room", { user: props.userName, code: accessCode });
  }, [accessCode]);

  //listen to peer request
  useEffect(() => {
    socket.on("peer_request", (data) => {
      console.log(" There is a request from user " + data);
      setreceivedRequest(true);
    });
  });

  //listen to peer response
  useEffect(() => {
    // Received 3 times here
    // BUG: When onChange, it call  the App.js setState function. it will render
    // this component again.
    socket.on("peer_response", (data) => {
      console.log(" There is a response from user :" + data);
      if (data == "accepted") {
        props.chatStarted(join_accessCode);
      } else {
        console.log("Not a request");
      }
    });
  });

  //send request to target
  const requestToChannel = () => {
    //props.chatStarted(true);

    if (validateKey(join_accessCode)) {
      console.log("join ");
      socket.emit("join_room", { user: props.userName, code: join_accessCode });
      socket.emit("join_request", {
        room: `${join_accessCode}`,
        message: "request",
      });
    } else {
      setrequest_status_message("Invalid access code");
    }
  };

  //response to the requestor
  const accpetRequest = () => {
    console.log("send accpet  reponse" + accessCode);
    socket.emit("join_response", {
      room: `${accessCode}`,
      message: "accepted",
    });
    console.log("acceptRequest  ****************");
    props.chatStarted(accessCode);
  };

  const declineRequest = () => {};

  //Validate key from backend
  const validateKey = (join_accessCode) => {
    Axios.post(`${serverhost.url}/keyverify`, {
      code: join_accessCode,
    }).then((response) => {
      console.log("valid");
      console.log(response.data);
      if (response.data.message != true) {
        console.log("returned false");
      } else {
        console.log("returned true");
      }
    });
    return true;
  };

  //Gen random code from backend
  const getKey = () => {
    Axios.post(`${serverhost.url}/keygen`, {
      token: sessionStorage.getItem("token"),
    }).then((response) => {
      console.log(response.data.code);
      setaccessCode(response.data.code);
      startTimer();
    });
  };

  const startTimer = () => {
    setexpireCounter(60);
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  function closeModal() {
    setreceivedRequest(false);
  }
  var subtitle;

  return (
    <div className="formContainer">
      <div className="form">
        <form style={{ border: "1px solid #1eaabd" }}>
          <div className="container">
            <p>{accessID}</p>
            <div style={{ letterSpacing: "10px" }}>
              <h1 style={expireCounter === 0 ? { color: "#DCDCDC" } : null}>
                {accessCode}
              </h1>
            </div>
            {expireCounter > 0 ? (
              <h5>After {expireCounter} second, the code will expire</h5>
            ) : (
              <h5>Code expired, please get a new code</h5>
            )}
          </div>
        </form>
        {expireCounter == 0 ? (
          <button className="buttonform" onClick={getKey}>
            Get a new key
          </button>
        ) : null}
      </div>
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
                  setjoin_accessCode(e.target.value);
                  console.log("AccessKey: " + e.target.value);
                }
              }}
            />
          </div>
        </form>
        <button className="buttonform " onClick={requestToChannel}>
          {" "}
          Join !{" "}
        </button>
        <h2>{request_status_message}</h2>
      </div>
      {receivedRequest ? (
        <Modal
          isOpen={receivedRequest}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2>You have received a chat request !</h2>
          <button onClick={accpetRequest}>Accept</button>
          <button onClick={closeModal}>Not now</button>
        </Modal>
      ) : null}
    </div>
  );
}

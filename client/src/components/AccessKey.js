import React, { useEffect, useState } from "react";
import Axios from "axios";
import { serverhost } from "../api/url";
import io from "socket.io-client";
import Modal from "react-modal";
import { Redirect } from "react-router-dom";
import CodeGenerator from "./CodeGenerator";

import loading_icon from "../image/loading.gif";

let socket;

export default function AccessKey(props) {
  const [accessCode, setaccessCode] = useState("----");

  const [join_accessCode, setjoin_accessCode] = useState("");

  const [request_status_message, setrequest_status_message] = useState("");
  const [receivedRequest, setreceivedRequest] = useState(false);

  const [sendedRequest, setsendedRequest] = useState(false);

  useEffect(() => {
    socket = io(serverhost.url);
  }, [serverhost]);

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

  //Validate key from backend
  const validateKey = (join_accessCode) => {
    Axios.post(`${serverhost.url}/keyverify`, {
      code: join_accessCode,
    })
      .then((response) => {
        console.log("valid");
        console.log(response.data);
        if (response.data.message != true) {
          console.log("returned false");
        } else {
          console.log("returned true");
        }
      })
      .catch((error) => {
        console.log(error);
        switch (error.response.status) {
          case 403:
            console.log("403 : ");
          default:
            break;
        }
      });
    return true;
  };

  //send request to target
  const requestToChannel = () => {
    setsendedRequest(true);
    console.log("setsendedRequest");
    if (validateKey(join_accessCode)) {
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
  const accpetRequest = (e) => {
    console.log(e.currentTarget.value);
    console.log("send accpet  reponse" + accessCode);
    socket.emit("join_response", {
      room: `${accessCode}`,
      message: "accepted",
    });
    console.log("acceptRequest  ****************");
    props.chatStarted(accessCode);
  };

  const setAccessCode = (code) => {
    setaccessCode(code);
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
    setsendedRequest(false);
  }

  return (
    <div className="formContainer">
      <CodeGenerator setaccessCode={setAccessCode} accessCode={accessCode} />
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
          <button value="Accpeted" onClick={accpetRequest}>
            Accept
          </button>
          <button value="Deny" onClick={closeModal}>
            Not now
          </button>
        </Modal>
      ) : null}
      {sendedRequest ? (
        <Modal
          isOpen={sendedRequest}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2>You have sent a chat request !</h2>
          <img
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            src={loading_icon}
          />
          <button value="Cancel" onClick={closeModal}>
            Cancel
          </button>
        </Modal>
      ) : null}
    </div>
  );
}

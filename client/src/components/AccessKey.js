import React, { useEffect, useState } from "react";
import Axios from "axios";
import { serverhost } from "../api/url";
import io from "socket.io-client";
import Modal from "react-modal";
import { Redirect } from "react-router-dom";
import CodeGenerator from "./CodeGenerator";
import CodeSubmitForm from "./CodeSubmitForm";
import ReqSenderMsgBox from "./Modal/ReqSenderMsgBox";
import ReqReceiverMsgBox from "./Modal/ReqReceiverMsgBox";

let socket;

export default function AccessKey(props) {
  const [accessCode, setaccessCode] = useState("----");

  const [join_accessCode, setjoin_accessCode] = useState("");

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
      console.log("************" + join_accessCode);
      if (data == "accepted") {
        props.chatStarted(join_accessCode);
      } else {
        console.log("Not a request");
      }
    });
    return () => {
      socket.off("peer_response");
    };
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
      console.log("Invalid access code");
      //setrequest_status_message("Invalid access code");
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

  const setJoin_accessCode = (code) => {
    setjoin_accessCode(code);
  };

  function closeModal() {
    setreceivedRequest(false);
    setsendedRequest(false);
  }

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

  return (
    <div className="formContainer">
      <CodeGenerator setaccessCode={setAccessCode} accessCode={accessCode} />
      <CodeSubmitForm
        setJoin_accessCode={setJoin_accessCode}
        request={requestToChannel}
      />
      <ReqReceiverMsgBox
        active={receivedRequest}
        close={closeModal}
        response={accpetRequest}
      />
      <ReqSenderMsgBox active={sendedRequest} close={closeModal} />
    </div>
  );
}

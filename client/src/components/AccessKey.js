import React, { useEffect, useState } from "react";
import Axios from "axios";
import { serverhost } from "../api/url";
import io from "socket.io-client";
import CodeGenerator from "./CodeGenerator";
import CodeSubmitForm from "./CodeSubmitForm";
import ReqSenderMsgBox from "./Modal/ReqSenderMsgBox";
import ReqReceiverMsgBox from "./Modal/ReqReceiverMsgBox";
import ReqErrorMsgBox from "./Modal/ReqErrorMsgBox";

let socket;

export default function AccessKey(props) {
  const [accessCode, setaccessCode] = useState("----");
  const [join_accessCode, setjoin_accessCode] = useState("");
  //control modal box
  const [receivedRequest, setreceivedRequest] = useState(false);
  const [sendedRequest, setsendedRequest] = useState(false);
  const [IsRequestErr, setIsRequestErr] = useState(false);
  const [RequestErrMsg, setRequestErrMsg] = useState("");
  //peer reponse
  const [peerReponse, setpeerReponse] = useState(false);

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
    return () => {
      socket.off("peer_request");
    };
  });

  //listen to peer response
  useEffect(() => {
    socket.on("peer_response", (data) => {
      console.log(" There is a response from user :" + data);
      console.log("************" + join_accessCode);
      if (data == "Accepted") {
        props.chatStarted(join_accessCode);
      } else {
        console.log("Request Denied");
        setpeerReponse(true);
      }
    });
    return () => {
      socket.off("peer_response");
    };
  });

  const requestToChannel2 = () => {
    //ValidateAccessCode
    Axios.post(
      `${serverhost.url}/keyverify`,
      {
        code: join_accessCode,
      },
      {
        headers: {
          "x-access-token": sessionStorage.getItem("token"),
        },
      }
    ).then((response) => {
      if (response.data.message != true) {
        setIsRequestErr(true);
        setRequestErrMsg(response.data.message);
      } else {
        setsendedRequest(true);
        socket.emit("join_room", {
          user: props.userName,
          code: join_accessCode,
        });
        socket.emit("join_request", {
          room: `${join_accessCode}`,
          message: "request",
        });
      }
    });
  };

  //response to the requestor
  const accpetRequest = (e) => {
    console.log("e. " + e.currentTarget.value);
    console.log("send accpet  reponse" + accessCode);
    socket.emit("join_response", {
      room: `${accessCode}`,
      message: e.currentTarget.value,
    });
    console.log("acceptRequest  ****************");
    if (e.currentTarget.value === "Accepted") {
      props.chatStarted(accessCode);
    }
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
    setIsRequestErr(false);
  }

  return (
    <div className="formContainer">
      <CodeGenerator setaccessCode={setAccessCode} accessCode={accessCode} />
      <CodeSubmitForm
        setJoin_accessCode={setJoin_accessCode}
        request={requestToChannel2}
      />
      <ReqReceiverMsgBox
        active={receivedRequest}
        close={closeModal}
        response={accpetRequest}
      />
      <ReqSenderMsgBox
        active={sendedRequest}
        close={closeModal}
        response={peerReponse}
      />
      <ReqErrorMsgBox
        active={IsRequestErr}
        close={closeModal}
        message={RequestErrMsg}
      />
    </div>
  );
}

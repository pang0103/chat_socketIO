import React, { useEffect } from "react";
import Modal from "react-modal";

export default function ReqReceiverMsgBox(props) {
  useEffect(() => {
    Modal.setAppElement("body");
  });

  const rejectReq = () => {};

  return (
    <div>
      <Modal
        isOpen={props.active}
        onRequestClose={props.close}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2>You have received a chat request !</h2>
        <button value="Accepted" onClick={props.response}>
          Accept
        </button>
        <button value="Denied" onClick={props.response}>
          Not now
        </button>
      </Modal>
    </div>
  );
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

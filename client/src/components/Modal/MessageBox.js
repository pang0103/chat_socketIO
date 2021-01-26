import React from "react";
import Modal from "react-modal";

export default function MessageBox(props) {
  return (
    <Modal
      isOpen={receivedRequest}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <h2>You have received a chat request !</h2>
      <button value="Accpeted">Accept</button>
      <button value="Deny" onClick={closeModal}>
        Not now
      </button>
    </Modal>
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

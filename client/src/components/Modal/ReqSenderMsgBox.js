import React from "react";
import Modal from "react-modal";
import loading_icon from "../../image/loading.gif";

export default function MessageBox(props) {
  return (
    <Modal
      isOpen={props.active}
      onRequestClose={props.close}
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
      <button value="Cancel" onClick={props.close}>
        Cancel
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

import React, { useEffect } from "react";
import Modal from "react-modal";

export default function ReqErrorMsgBox(props) {
  useEffect(() => {
    Modal.setAppElement("body");
  });

  return (
    <div>
      <Modal
        isOpen={props.active}
        onRequestClose={props.close}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2>Oops...</h2>
        <h3>{props.message}</h3>
        <button value="Cancel" onClick={props.close}>
          Cancel
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

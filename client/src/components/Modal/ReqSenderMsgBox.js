import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import loading_icon from "../../image/loading.gif";

export default function MessageBox(props) {
  const [reponse, setreponse] = useState(false);

  useEffect(() => {
    Modal.setAppElement("body");
    setreponse(props.response);
  }, [props.response]);

  return (
    <Modal
      isOpen={props.active}
      onRequestClose={props.close}
      style={customStyles}
      contentLabel="Example Modal"
    >
      {!reponse ? (
        <div>
          <h2>You have sent a chat request !</h2>
          <img
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            src={loading_icon}
          />
        </div>
      ) : (
        <h2>Request denied</h2>
      )}

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

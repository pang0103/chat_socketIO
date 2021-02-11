import React, { useEffect } from "react";
import Modal from "react-modal";
import Lobby from "./Lobby";
import styles from "../../css/modalmsg.module.css";

export default function ReqReceiverMsgBox(props) {
  useEffect(() => {
    Modal.setAppElement("body");
  });

  return (
    <div className={styles.mainModal}>
      <Modal
        isOpen={props.active}
        onRequestClose={props.close}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 className={styles.Noticebar}>You have received a chat request !</h2>
        <hr></hr>
        <Lobby userlist={props.userList} />
        <hr></hr>
        <div className={styles.btnplace}>
          <button
            className={styles.acceptebtn}
            value="Accepted"
            onClick={props.response}
          >
            Accept
          </button>
          <button
            className={styles.denybtn}
            value="Denied"
            onClick={props.response}
          >
            Not now
          </button>
        </div>
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

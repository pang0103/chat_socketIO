import React, { useState, useEffect, useRef } from "react";
import styles from "../../css/lobby.module.css";

export default function Lobby(props) {
  const [userAccpted_list, setuserAccpted_list] = useState([]);
  const [userPending_list, setuserPending_list] = useState([]);

  const addAccpted = (e) => {
    var x = e.target.value;
    console.log(x);

    //Add the selected user to the accpted list
    setuserAccpted_list([
      ...userAccpted_list,
      ...userPending_list.filter((user) => user.userid === x),
    ]);

    //Remove user from the pending list
    setuserPending_list([
      ...userPending_list.filter((user) => user.userid != x),
    ]);
  };

  // START chat : send request to server, boardcast the private room id to lobby member that accpeted
  useEffect(() => {
    console.log(props.userlist);
  });

  return (
    <div>
      <div>
        <h2 className={styles.title}> Lobby:</h2>
        <table className={styles.lobbytable}>
          <tr>
            <th>userID</th>
            <th>userName</th>
          </tr>
          {props.userlist.map((val, key) => {
            return (
              <tr>
                <td>{val.userid}</td>
                <td>{val.username}</td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
}

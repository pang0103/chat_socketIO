import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import ProtectedRoute from "./ProtectedRoute";
import AccessKey from "./components/AccessKey";
import Chatboard from "./components/Chatboard";
import "./App.css";

function App() {
  const [isAuth, setIsAuth] = useState(
    sessionStorage.getItem("loginState") || false
  );

  const [userName, setuserName] = useState(
    sessionStorage.getItem("userName") || ""
  );

  const [chatStarted, setchatStart] = useState(false);
  const [chatChannel, setchatChannel] = useState("");

  const confirmAuth = (authed, username) => {
    if (authed) {
      setIsAuth(true);
      setuserName(username);
      console.log("appjs");
    }
  };

  const confirmLogout = () => {
    sessionStorage.removeItem("loginState");
    setIsAuth(false);
  };

  const confirmJoinedroom = (channelCode) => {
    console.log("props.confirmJoinedroom" + channelCode);
    setchatStart(true);
    setchatChannel(channelCode);
  };

  return (
    <div className="App">
      <Router>
        <Navbar
          userName={userName}
          isAuth={isAuth}
          confirmlogout={confirmLogout}
        />
        <Route path="/" exact>
          {!isAuth ? <Login isAuth={confirmAuth} /> : null}
        </Route>

        <Route path="/chat" exact>
          {!isAuth ? (
            <Redirect to="/" />
          ) : !chatStarted ? (
            <AccessKey chatStarted={confirmJoinedroom} userName={userName} />
          ) : (
            <Chatboard channel={chatChannel} userName={userName} />
          )}
        </Route>
        <Route path="/login" exact>
          {!isAuth ? <Login isAuth={confirmAuth} /> : <Redirect to="/" />}
        </Route>
        <Route path="/register" exact>
          <Register />
        </Route>
        <ProtectedRoute
          path="/profile"
          isProtected={isAuth}
          component={Profile}
        />
      </Router>
    </div>
  );
}

export default App;

import React from "react";
import { Route, Redirect } from "react-router-dom";

//props: isAuth:boolean, component: component
function ProtectedRoute({
  isProtected: isProtected,
  component: Component,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isProtected) {
          return <Component />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location },
              }}
            />
          );
        }
      }}
    ></Route>
  );
  //</div>/return <Route component={props.component}></Route>;
  //return <Profile value={props.isAuth ? "1" : "2"} />;
}

export default ProtectedRoute;

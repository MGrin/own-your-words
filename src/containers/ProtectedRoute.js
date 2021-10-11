import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useWeb3 } from "../hooks/useWeb3";

const ProtectedRoute = ({ component: Component, ...routerProps }) => {
  const { connected } = useWeb3();

  return (
    <Route
      {...routerProps}
      render={(props) =>
        connected ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default ProtectedRoute;

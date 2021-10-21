import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import RouteWithNavbar from "../route-navbar/RouteWithNavbar";
import ProtectedNavbar from "../../shared/navbar/protected_navbar/ProtectedNavbar";

const ProtectedRoute = ({ component: Component, user, ...rest }) => {
  const [isAuth, setAuth] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const isAuthenticated = await axios.get("/auth");

        if (isAuthenticated.status === 200) {
          setAuth(true);
          setLoading(false);
        } else {
          throw new Error({
            code: 401,
            message: "Not Authorized to access this resource!",
          });
        }
      } catch (err) {
        setLoading(false);
      }
    })();
  }, []);

  const redirect = () => {
    if (isLoading) {
      return null;
    } else if (isAuth) {
      return rest.children;
    } else
      return (
        <Redirect
          to={{
            pathname: "/error",
            state: {
              from: rest.path,
              type: "401",
            },
          }}
        />
      );
  };

  return (
    <RouteWithNavbar navbar={ProtectedNavbar} {...rest}>
      {redirect()}
    </RouteWithNavbar>
  );
};

export default ProtectedRoute;

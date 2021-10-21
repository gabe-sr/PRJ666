import React from "react";
import RouteWithNavbar from "../route-navbar/RouteWithNavbar";
import MainNavbar from "../../shared/navbar/main_navbar/MainNavbar";

const PublicRoute = ({ component: Component, user, ...rest }) => {
  return (
    <RouteWithNavbar navbar={MainNavbar} {...rest}>
      {rest.children}
    </RouteWithNavbar>
  );
};

export default PublicRoute;

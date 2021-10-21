import React from "react";
import { Route } from "react-router-dom";
import MainNavbar from "../../shared/navbar/main_navbar/MainNavbar";

const RouteWithNavbar = ({
  exact,
  path,
  component: Component,
  navbar: Navbar,
  ...rest
}) => {
  return (
    <Route exact={exact} path={path} {...rest}>
      {/* <MainNavbar /> */}
      {/* <Component /> */}
      {rest.children}
    </Route>
  );
};

export default RouteWithNavbar;

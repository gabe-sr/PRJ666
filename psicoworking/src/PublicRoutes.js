import React from "react";
import { Switch, Route } from "react-router-dom";

// Routes
import MainPage from "./Components/main_page/MainPage";
import SignUp from "./Components/sign_up/SignUp";
import Error from "./Components/error-pages/Error";

const PublicRoutes = ({ match }) => {
  return (
    <>
      <Route exact path={`${match.url}`}>
        <MainPage />
      </Route>
      <Route exact path={`${match.url}contact`}>
        <h2 className="m-4 text-secondary">Contact us</h2>
      </Route>
      <Route exact path={`${match.url}about`}>
        <h2 className="m-4 text-secondary">About us</h2>
      </Route>
      <Route exact path={`${match.url}pricing`}>
        <h2 className="m-4 text-secondary">Pricing</h2>
      </Route>
      <Route exact path={`${match.url}signup`}>
        <SignUp />
      </Route>
      <Route path="/*">
        <div>PUBLIC ERROR</div>
        <Error />
      </Route>
    </>
  );
};

export default PublicRoutes;

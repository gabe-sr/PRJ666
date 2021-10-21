import React from "react";
import { Route, Switch, Link } from "react-router-dom";

import Dashboard from "./Components/dashboard/Dashboard";
import Scheduler from "./Components/scheduler/Scheduler";
import UserAuthorization from "./Components/user_authorization/UserAuthorization";
import Error from "./Components/error-pages/Error";
import useAuthentication from "./useAuthentication";

const ProtectedRoutes = ({ match }) => {
  const { isAuth, isLoading, data } = useAuthentication();

  if (isLoading) return null;

  if (!isAuth) {
    return <Error type="401" />;
  } else {
    return (
      <>
        <Switch>
          <Route exact path={`${match.url}`}>
            <div>USER DASHBOARD</div>
            <Link to={`${match.url}/user/${data._id}`}>User Profile</Link>
            <br />
            <Link to={`${match.url}/scheduler`}>Scheduler</Link>
            <br />
            <Link to={`${match.url}/authorization`}>User Authorization</Link>
          </Route>

          <Route exact path={`${match.url}/user/:id`}>
            <Dashboard />
          </Route>

          <Route exact path={`${match.url}/scheduler`}>
            <Scheduler />
          </Route>

          <Route exact path={`${match.url}/authorization`}>
            <UserAuthorization />
          </Route>

          <Route exact path={`${match.url}/*`}>
            <div>PROTECTED ERROR 404</div>
            <Error type="404" />
          </Route>
        </Switch>
      </>
    );
  }
};

export default ProtectedRoutes;

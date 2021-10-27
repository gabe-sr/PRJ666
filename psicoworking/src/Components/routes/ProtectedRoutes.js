import React from "react";
import { Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import Scheduler from "../scheduler/Scheduler";
import UserAuthorization from "../user_authorization/UserAuthorization";
import Error from "../error-pages/Error";
import useAuthentication from "../shared/hook/useAuthentication";
import Sidebar from "../dashboard/sidebar/Sidebar";
import UserProfile from "../dashboard/user_profile/UserProfile";
import axios from "axios";

const ProtectedRoutes = ({ match }) => {
  // custom authentication hook:
  // isAuth: check in the server if user is authenticated
  // isLoading: waiting for server response
  // data: return user object
  const { isAuth, isLoading, data } = useAuthentication();

  // waiting for server response...
  if (isLoading) {
    return null;
  }

  // If user is not authenticated, return error page
  // Otherwise, load protected routes
  if (!isAuth) {
    return <Error type="401" />;
  } else if (!data.active) {
    return <div>User not activated!</div>;
  } else {
    //
    return (
      <>
        <div className="sidebar">
          <Sidebar id={data._id} isAdmin={data.isAdmin} />
        </div>
        <div className="content">
          <Switch>
            <Route exact path={`${match.url}`}>
              <Dashboard userData={data} />
            </Route>

            <Route
              exact
              path={`${match.url}/user/:id`}
              render={(props) => (
                <UserProfile id={props.match.params.id} user={data} />
              )}
            />

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
        </div>
      </>
    );
  }
};

export default ProtectedRoutes;
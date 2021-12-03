import { useState } from "react";
import { Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import Scheduler from "../scheduler/Scheduler";
import UserAuthorization from "../user_authorization/UserAuthorization";
import Error from "../error-pages/Error";
import useAuthentication from "../shared/hook/useAuthentication";
import Sidebar from "../dashboard/sidebar/Sidebar";
import UserProfile from "../dashboard/user_profile/UserProfile";
import ChangePasswordForm from "../dashboard/change_pw/ChangePasswordForm";
import UserReport from "../reports/user-report/UserReport";
import Reports from "../reports/Reports";
import Booking from "../scheduler/Booking";
import BookingList from "../dashboard/bookings/BookingList";
import MonthlyTotalReport from "../reports/monthly-total/MonthlyTotalReport";
import MonthlyUserReport from "../reports/monthly-user/MonthlyUserReport";
import Maintenance from "../scheduler/Maintenance";

const ProtectedRoutes = ({ match }) => {
  // custom authentication hook:
  // isAuth: check in the server if user is authenticated
  // isLoading: waiting for server response
  // data: return user object
  const { isAuth, isLoading, data } = useAuthentication();
  const [resizeContent, setResizeContent] = useState(true);

  const handleResize = (arg) => {
    setResizeContent(arg);
  };

  // waiting for server response...
  if (isLoading) {
    return null;
  }

  // If user is not authenticated, return login page
  // Otherwise, load protected routes
  if (!isAuth) {
    return <Error type="401" />;
  }

  if (isAuth) {
    return (
      <>
        <div className="sidebar">
          <Sidebar id={data._id} isAdmin={data.isAdmin} resize={handleResize} />
        </div>
        <div className={resizeContent ? "content-resize" : "content"}>
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

            <Route
              exact
              path={`${match.url}/user/:id/changePassword`}
              render={(props) => (
                <ChangePasswordForm id={props.match.params.id} user={data} />
              )}
            />

            <Route
              exact
              path={`${match.url}/book`}
              render={(props) => (
                <Booking
                  userid={data._id}
                  isAdmin={data.isAdmin}
                  roomid={props.match.params.roomid}
                />
              )}
            />

            <Route
              exact
              path={`${match.url}/:userid/:roomid/book`}
              render={(props) => (
                <Scheduler
                  userid={data._id}
                  roomid={props.match.params.roomid}
                />
              )}
            />

            {/* <Route
              exact
              path={`${match.url}/:userid/:roomid/maintenance`}
              render={(props) => (
                <Maintenance
                  userid={data._id}
                  roomid={props.match.params.roomid}
                />
              )}
            /> */}

            <Route
              exact
              path={`${match.url}/:userid/:roomid/maintenance`}
              render={(props) => (
                <Maintenance
                  userid={data._id}
                  roomid={props.match.params.roomid}
                />
              )}
            />

            <Route exact path={`${match.url}/:id/authorization`}>
              <UserAuthorization />
            </Route>

            <Route exact path={`${match.url}/report/`}>
              <Reports 
                user={data}
              />
            </Route>

            <Route exact path={`${match.url}/report/booking`}>
              <UserReport 
                user={data}
              />
            </Route>

            <Route exact path={`${match.url}/report/month_total`}>
              <MonthlyTotalReport />
            </Route>
            <Route exact path={`${match.url}/report/month_user`}>
              <MonthlyUserReport />
            </Route>

            <Route
              exact
              path={`${match.url}/bookinglist`}
              render={(props) => (
                <BookingList
                  // userid={data._id}
                  user={data}
                />
              )}
            ></Route>

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

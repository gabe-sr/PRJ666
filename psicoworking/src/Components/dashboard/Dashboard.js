import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import UserProfile from "./UserProfile";
import axios from "axios";
import WithLoadingSpinner from "../HOC/loading-spinner/WithLoadingSpinner";

const Dashboard = (props) => {
  //destructuring props
  // id is from props.match.params.id ;  setLoading is from the HOC loading
  const { setLoading, id } = props;

  //useState hook: "setState" sets the "state" variable
  // by default, user is empty obj and loading true
  const [state, setState] = useState({});

  // hook from react-router-dom: tracks the routing information and provides redirect methods
  const history = useHistory();

  // Here, similar to componentDidMount, will be triggered when it mounts
  useEffect(() => {
    // async function to fetch a User
    const fetchUser = async () => {
      try {
        // using axios instead of fetch
        const response = await axios.get(`/users/test/${id}`);

        // redirects to error page
        if (response.data.error) {
          history.push({
            pathname: "/Error",
            state: { redirectTo: response.data.redirectTo.url },
          });
        }

        // If everything is ok, user _id exists, so setState to retrieved "user" and setLoading as false
        if (response.data._id) {
          setState(response.data);
          setLoading(false);
        }

        // errors including response.status != 200 to 299
      } catch (error) {
        console.log(error);
        history.push({
          pathname: "/Error",
          state: { redirectTo: "/" },
        });
      }
    };

    // call above function here
    fetchUser();
  }, [id, history, setLoading]);

  if (state._id) {
    return (
      <div>
        <div className="container rounded bg-white mt-5 mb-5">
          <div className="row">
            <div className="col-md-3 border-right">
              <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                Navbar
              </div>
            </div>
            <div className="col-md-9 border-right">
              <UserProfile user={state} />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

// WithLoadingSpinner: HOC for the loading spinner
export default WithLoadingSpinner(Dashboard, "Retrieving user information");

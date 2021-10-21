import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import UserProfile from "./UserProfile";
import axios from "axios";
import WithLoadingSpinner from "../HOC/loading-spinner/WithLoadingSpinner";

const Dashboard = (props) => {
  // destructuring props properties
  // setLoadingSpinner is from the HOC loading; id is from params.id from react-router;
  const { setLoadingSpinner } = props;
  const { id } = useParams();

  //useState hook: "setState" sets the "state" variable
  // by default, user is empty obj, so state = {}
  const [state, setState] = useState({});

  // hook from react-router-dom: tracks the routing information and provides redirect methods
  const history = useHistory();

  // Here, similar to componentDidMount, will be triggered when it mounts
  useEffect(() => {
    // async function to fetch a User
    const fetchUser = async () => {
      try {
        // using axios instead of fetch (throws error if response.status = 400..., 500... etc)
        const response = await axios.get(`/users/${id}`);

        // redirects to error page
        if (response.data.error) {
          history.push({
            pathname: "/dashboard/error",
            state: { from: response.data.redirectTo.url },
          });
        }

        // If everything is ok, user _id exists, so setState to retrieved "user" and setLoading as false
        if (response.data._id) {
          setState(response.data);
          setLoadingSpinner(false);
        }

        // errors including response.status != 200 to 299
      } catch (error) {
        history.push({
          pathname: "/dashboard/error",
          state: { from: "/", type: error.response.status },
        });
      }
    };

    fetchUser(); // call above function here
  }, [id, history, setLoadingSpinner]);

  if (!state._id) {
    return null; // this means data is not ready yet => will show the Loading Spinner
  } else {
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
  }
};

// WithLoadingSpinner: HOC for the loading spinner
export default WithLoadingSpinner(Dashboard, "Retrieving user information");

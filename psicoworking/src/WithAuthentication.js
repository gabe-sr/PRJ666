import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

const WithAuthentication = (WrappedComponent, loadingMessage) => {
  const HOC = (props) => {
    const [isAuth, setAuth] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const history = withRouter();

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
      console.log(history);
      if (isLoading) {
        return null;
      } else if (isAuth) {
        return <WrappedComponent {...props} />;
      } else return null;
    };

    return redirect();
  };

  return HOC;
};

export default withRouter(WithAuthentication);

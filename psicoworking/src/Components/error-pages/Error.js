import React, { useState, useEffect, useCallback } from "react";
import { Button, Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const Error = (props) => {
  const [message, setMessage] = useState();
  const [header, setHeader] = useState();

  const history = useHistory();
  const state = history.location.state;

  const errorType = useCallback(() => {
    if (!state || !props) {
      setHeader("404 - Page not found");
      setMessage("We're sorry, we couldn't find the page you requested.");
    } else if (
      (state && (state.type === 401 || state.type === "401")) ||
      (props && props.type === "401")
    ) {
      setHeader("401 - Not Authorized");
      setMessage(
        "You don't have authorization to access this resource. Please, log in into your account."
      );
    } else if (
      (state && (state.type === 403 || state.type === "403")) ||
      (props && props.type === "403")
    ) {
      setHeader("403 - Forbidden");
      setMessage("You don't have permissions to access this resource.");
    }
  }, [state, props]);

  useEffect(() => {
    errorType();
  }, [errorType]);

  return (
    <Container className="m-4">
      <h2>{header}</h2>
      <p>{message}</p>
      {/* <Button
        className="m-4"
        onClick={() => history.push(history.location.state.from)}
        variant="secondary"
      >
        Return
      </Button> */}
    </Container>
  );
};

export default Error;

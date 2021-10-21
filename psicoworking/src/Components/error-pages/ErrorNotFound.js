import React from "react";
import { Button, Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const Error = () => {
  const history = useHistory();
  console.log(history);

  return (
    <Container className="m-4">
      <h2>You don't have permission to access this resource</h2>
      <Button
        className="m-4"
        onClick={() => history.push(history.location.state.from)}
        variant="secondary"
      >
        Return
      </Button>
    </Container>
  );
};

export default Error;

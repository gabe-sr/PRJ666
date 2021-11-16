import React, { useState, useEffect, useCallback } from "react";
import { Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import LoginModal from "../login/LoginModal"

const Error = (props) => {
  const [message, setMessage] = useState();
  const [header, setHeader] = useState();

  const history = useHistory();
  const state = history.location.state;

  const [showModal, setShowModal] = useState(false);
  
  const handleLoginModal = () => {
    setShowModal(!showModal);
  };



  const errorType = useCallback(() => {
    if (props) {
      if (props.type === "404") {
        setHeader("404 - Page not found");
        setMessage("We're sorry, we couldn't find the page you requested.");
      } else if (props.type === "401") {
        console.log("401")
        setShowModal(true)
        // handleLoginModal()
        setHeader("401 - Not Authorized");
        setMessage(
          "You don't have authorization to access this resource. Please, log in into your account."
        );
      } else if (props.type === "403") {
        setHeader("403 - Forbidden");
        setMessage("You don't have permissions to access this resource.");
      }
    } else if (state) {
      if (state.type === "404") {
        setHeader("404 - Page not found");
        setMessage("We're sorry, we couldn't find the page you requested.");
      } else if (state.type === "401") {
        setHeader("401 - Not Authorized");
        setMessage(
          "You don't have authorization to access this resource. Please, log in into your account."
        );
      } else if (state.type === "403") {
        setHeader("403 - Forbidden");
        setMessage("You don't have permissions to access this resource.");
      }
    } else {
      setHeader("404 - Page not found");
      setMessage("We're sorry, we couldn't find the page you requested.");
    }

    // if (!state || !props) {
    //   setHeader("404 - Page not found");
    //   setMessage("We're sorry, we couldn't find the page you requested.");
    // } else if (
    //   (state && (state.type === 401 || state.type === "401")) ||
    //   (props && props.type === "401")
    // ) {
    //   setHeader("401 - Not Authorized");
    //   setMessage(
    //     "You don't have authorization to access this resource. Please, log in into your account."
    //   );
    // } else if (
    //   (state && (state.type === 403 || state.type === "403")) ||
    //   (props && props.type === "403")
    // ) {
    //   setHeader("403 - Forbidden");
    //   setMessage("You don't have permissions to access this resource.");
    // }
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
      
      
      <LoginModal showmodal={showModal} handlemodal={handleLoginModal} redirectTo={history.location.pathname}/>
    </Container>
  );
};

export default Error;

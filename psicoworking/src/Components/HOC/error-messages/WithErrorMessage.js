import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const WithErrorMessage = (WrappedComponent) => {
  const HOC = (props) => {
    const [showError, setShowError] = useState(false);
    const [message, setMessage] = useState();
    const [redirectUrl, setRedirect] = useState();

    const history = useHistory();

    const setErrorMessage = (isError, message, redirect) => {
      setShowError(isError);
      setMessage(message);
      setRedirect(redirect);
    };

    const ErrorModal = () => {
      if (showError) {
        return (
          <Modal
            size="lg"
            show={showError}
            fullscreen={"lg-down"}
            backdrop="static"
            keyboard={false}
            centered
          >
            <Modal.Header>
              <Modal.Title className="text-secondary">
                Something went wrong
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer className="justify-content-center">
              <Button
                variant="secondary"
                onClick={
                  redirectUrl
                    ? () => history.push(redirectUrl)
                    : () => setShowError(false)
                }
              >
                Continue
              </Button>
            </Modal.Footer>
          </Modal>
        );
      }
    };

    return (
      <>
        {showError && <ErrorModal />}
        <WrappedComponent {...props} setErrorMessage={setErrorMessage} />
      </>
    );
  };
  return HOC;
};

export default WithErrorMessage;

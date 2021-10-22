import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const WithErrorMessage = (WrappedComponent) => {
  const HOC = (props) => {
    const [showError, setShowError] = useState(false);
    const [message, setMessage] = useState();
    const [redirectUrl, setRedirect] = useState();
    const [callBack, setCallBack] = useState();

    const history = useHistory();

    const setErrorMessage = (isError, message, redirect, callback) => {
      setShowError(isError);
      setMessage(message);
      setRedirect(redirect);
      setCallBack(callback);
    };

    const ErrorModal = () => {
      const handleButton = () => {
        if (callBack) {
          if (redirectUrl) {
            history.push(redirectUrl);
          }
          callBack.callBack();
        } else if (redirectUrl) {
          history.push(redirectUrl);
        } else {
          setShowError(false);
        }
      };

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
              <Button variant="secondary" onClick={handleButton}>
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

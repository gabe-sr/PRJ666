import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const WithMessage = (WrappedComponent) => {
  const HOC = (props) => {
    const [showMessage, setShowMessage] = useState(false);
    const [messageHeader, setMessageHeader] = useState();
    const [messageBody, setMessageBody] = useState();
    const [redirectUrl, setRedirect] = useState();
    const [callBack, setCallBack] = useState();

    const history = useHistory();

    const setModalMessage = (
      showMessage,
      header,
      message,
      redirect,
      callback
    ) => {
      setShowMessage(showMessage);
      setMessageHeader(header);
      setMessageBody(message);
      setRedirect(redirect);
      setCallBack(callback);
    };

    const MessageModal = () => {
      const handleButton = () => {
        if (callBack) {
          if (redirectUrl) {
            history.push(redirectUrl);
          }
          callBack.callBack();
        } else if (redirectUrl) {
          history.push(redirectUrl);
        } else {
          setShowMessage(false);
        }
      };

      if (showMessage) {
        return (
          <Modal
            size="lg"
            show={showMessage}
            fullscreen={"lg-down"}
            backdrop="static"
            keyboard={false}
            centered
          >
            <Modal.Header>
              <Modal.Title className="text-secondary">
                {messageHeader}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>{messageBody}</Modal.Body>
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
        {showMessage && <MessageModal />}
        <WrappedComponent {...props} setModalMessage={setModalMessage} />
      </>
    );
  };
  return HOC;
};

export default WithMessage;

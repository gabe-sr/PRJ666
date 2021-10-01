import React from "react";
import SignUpForm from "./sign_up-form/SignUpForm";
import { Modal, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useHistory, withRouter } from "react-router-dom";

const SignUpModal = (props) => {
  // passed from SignUp component (onClick button)
  const { isOpen, closeModal } = props;

  // tracks state of modal (shown, not shown)
  const [show, setShow] = useState(false);

  // to display message
  const [displayMessage, setDisplayMessage] = useState(false);

  // enables the use of history object
  const history = useHistory();

  // this closes the modal, triggered by clicking outside, or "x" button
  const handleModal = () => {
    setShow(false);
    setDisplayMessage(false);
    closeModal();
  };

  // Used when user is redirected to /signup after form submission
  // tracks changes to history.location, closes the signup modal, and opens the confirmation/error modal
  useEffect(() => {
    if (history.location.state && history.location.state.display) {
      setShow(false);
      closeModal();
      setDisplayMessage(true);
    }
  }, [history.location, closeModal]);

  // it checks every change to props.isOpen (button is clicked) and updates the modal state
  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  return (
    <>
      {/*Form Modal*/}
      <Modal
        size="lg"
        show={show}
        fullscreen={"lg-down"}
        onHide={handleModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Enter your information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SignUpForm />
        </Modal.Body>
      </Modal>

      {/*Confirmation/errors Modal*/}
      {history.location.state ? (
        <Modal
          size="lg"
          show={displayMessage}
          fullscreen={"lg-down"}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header>
            <Modal.Title className="text-secondary">
              {history.location.state.message}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {history.location.state.success ? (
              <p>
                You have registered in Psicoworking. You should receive a
                confirmation email in the next few minutes. We are reviewing
                your application and you should expect our feedback within 48
                hours.
              </p>
            ) : (
              <p>
                We could not proccess your registration this time. Please, try
                again or contact us for more information.
              </p>
            )}
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button variant="secondary" onClick={() => history.push("/")}>
              Continue
            </Button>
          </Modal.Footer>
        </Modal>
      ) : null}
    </>
  );
};

export default withRouter(SignUpModal);

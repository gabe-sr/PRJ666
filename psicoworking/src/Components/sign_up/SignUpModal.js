import React from "react";
import SignUpForm from "./sign_up-form/SignUpForm";
import { Modal, Button } from "react-bootstrap";
import { useState } from "react";

function SignUpModal() {
  //const values = [true, "sm-down", "md-down", "lg-down", "xl-down", "xxl-down"];
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);

  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

  return (
    <>
      <Button
        className="btn btn-secondary"
        onClick={() => handleShow("lg-down")}
      >
        Proceed to Sign Up
      </Button>

      <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SignUpForm />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default SignUpModal;

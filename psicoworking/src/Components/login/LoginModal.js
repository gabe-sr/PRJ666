import React from "react";
import { Modal } from "react-bootstrap";
import LoginForm from "./LoginForm";

const LoginModal = (props) => {
  return (
    <Modal
      size="sm"
      show={props.showmodal}
      fullscreen={"sm-down"}
      className="text-left text-secondary"
      onHide={props.handlemodal}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <LoginForm
          showmodal={props.showmodal}
          handlemodal={props.handlemodal}
          handleAuthState={props.handleAuthState}
          redirectTo={props.redirectTo}
        />
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;

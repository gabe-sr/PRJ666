import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "./ModalMessage.css";

const ModalMessage = (props) => {
  const [show, setShow] = useState(true);
  const { closeModalMessage, user } = props;

  const handleClose = () => {
    setShow(false);
    closeModalMessage();
  };

  return (
    <Modal
      className={"modal-message"}
      onHide={handleClose}
      show={show}
      // fullscreen={"lg-down"}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        {`User ${user.user.first_name} ${user.user.last_name} access was changed to:`}
        <p>{`${user.active ? "AUTHORIZED" : "NON-AUTHORIZED"}.`}</p>
      </Modal.Body>
    </Modal>
  );
};

export default ModalMessage;

import React from "react";
import { Spinner, Modal } from "react-bootstrap";
import "./SpinnerLoading.css";

const SpinnerLoading = () => {
  return (
    <Modal
      className={"data-loading-modal"}
      show={true}
      // fullscreen={"lg-down"}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Body>
        <p>Loading data...</p>
        <Spinner animation="border" className="data-loading-spinner" />
      </Modal.Body>
    </Modal>
  );
};

export default SpinnerLoading;

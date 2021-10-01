import React, { useState } from "react";
import { Navbar, Nav, Modal } from "react-bootstrap";
import "./MainNavbar.css";
import LoginForm from "../../../login/LoginForm";

const MainNavbar = () => {
  // tracks the state of the modal (open/closed)
  const [showModal, setShowModal] = useState(false);

  // this callback is sent to Child component, so when modal is closed there
  // it calls this function and set the modal status back to closed
  // so the modal is ready to be opened again
  const handleLoginModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <Navbar className="nav-template" variant="dark" sticky="top" expand="lg">
        <Navbar.Brand className="logo" href={"/"}>
          Psicoworking
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Nav.Link
              key={"Contact"}
              href={"#"}
              className="nav-template-link md-auto customColor"
            >
              Contact
            </Nav.Link>
            <Nav.Link
              key={"About us"}
              href={"#"}
              className="nav-template-link md-auto customColor"
            >
              About us
            </Nav.Link>
            <Nav.Link
              key={"Pricing"}
              href={"/pricing"}
              className="nav-template-link md-auto customColor"
            >
              Pricing
            </Nav.Link>
            <Nav.Link
              key={"Sign Up"}
              href={"/signup"}
              className="nav-template-link md-auto customColor"
            >
              Sign Up
            </Nav.Link>
            <Nav.Link
              key={"Login"}
              href={"#"}
              className="nav-template-link md-auto customColor"
              onClick={handleLoginModal}
            >
              Login
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Modal
        size="sm"
        show={showModal}
        fullscreen={"sm-down"}
        className="text-left text-secondary"
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoginForm />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MainNavbar;

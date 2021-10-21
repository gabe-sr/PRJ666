import React, { useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import "./ProtectedNavbar.css";
import LoginModal from "../../../login/LoginModal";

const ProtectedNavbar = () => {
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

      <LoginModal showmodal={showModal} handlemodal={handleLoginModal} />
    </>
  );
};

export default ProtectedNavbar;

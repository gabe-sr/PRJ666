import React, { useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link, NavLink, useHistory } from "react-router-dom";
import "./MainNavbar.css";
import LoginModal from "../../../login/LoginModal";
import useAuthentication from "../../hook/useAuthentication";
import axios from "axios";
import WithLoadingSpinner from "../../../HOC/loading-spinner/WithLoadingSpinner";

const MainNavbar = (props) => {
  // tracks the state of the modal (open/closed)
  const [showModal, setShowModal] = useState(false);

  const handleLoginModal = () => {
    setShowModal(!showModal);
  };

  const history = useHistory();

  // custom hook to check if user is/not authenticated (render different navbar links)
  const { isAuth, isLoading } = useAuthentication();

  const handleLogout = async () => {
    props.setLoadingSpinner(true, "Logging out...");
    try {
      const logout = await axios.get("/authentication/logout");
      if (logout.status === 200) {
        history.push("/");
        history.go("/");
        console.log("LOGOUT");
      }
    } catch (err) {
      console.log(err);
    } finally {
      props.setLoadingSpinner(false);
    }
  };

  const ProtectedNavbar = () => {
    return (
      <>
        <Navbar
          className="nav-template"
          variant="dark"
          sticky="top"
          expand="lg"
        >
          <Navbar.Brand className="logo" as={Link} to="/">
            Psicoworking{" "}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              {/* <Nav.Link
                key={"Home"}
                as={NavLink}
                to="/"
                className="nav-template pb-0 customColor"
              >
                {!isLoading ? `Home` : null}
              </Nav.Link> */}
              <Nav.Link
                key={"Dashboard"}
                as={NavLink}
                to="/dashboard"
                className="nav-template-link md-auto customColor"
              >
                {!isLoading ? `Dashboard` : null}
              </Nav.Link>

              <Nav.Link
                key={"Contact"}
                as={NavLink}
                to="/contact"
                className="nav-template-link md-auto customColor"
              >
                Contact
              </Nav.Link>
              <Nav.Link
                key={"About us"}
                as={NavLink}
                to="/about"
                className="nav-template-link md-auto customColor"
              >
                About us
              </Nav.Link>
              <Nav.Link
                key={"Pricing"}
                as={NavLink}
                to="/pricing"
                className="nav-template-link md-auto customColor"
              >
                Pricing
              </Nav.Link>

              <Nav.Link
                key={"Logout"}
                className="nav-template-link pb-0 customColor"
                onClick={handleLogout}
              >
                Sign Out
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <LoginModal showmodal={showModal} handlemodal={handleLogout} />
      </>
    );
  };

  const PublicNavbar = () => {
    return (
      <>
        <Navbar
          className="nav-template"
          variant="dark"
          sticky="top"
          expand="lg"
        >
          <Navbar.Brand className="logo" as={Link} to="/">
            Psicoworking
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <Nav.Link
                key={"Contact"}
                as={NavLink}
                to="/contact"
                className="nav-template-link md-auto customColor"
              >
                Contact
              </Nav.Link>
              <Nav.Link
                key={"About us"}
                as={NavLink}
                to="/about"
                className="nav-template-link md-auto customColor"
              >
                About us
              </Nav.Link>
              <Nav.Link
                key={"Pricing"}
                as={NavLink}
                to="/pricing"
                className="nav-template-link md-auto customColor"
              >
                Pricing
              </Nav.Link>
              <Nav.Link
                key={"Sign Up"}
                as={NavLink}
                to="/signup"
                className="nav-template-link md-auto customColor"
              >
                Sign up
              </Nav.Link>
              <Nav.Link
                key={"Login"}
                className="nav-template-link md-auto customColor"
                onClick={handleLoginModal}
              >
                Log in
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <LoginModal showmodal={showModal} handlemodal={handleLoginModal} />
      </>
    );
  };

  const EmptyNavbar = () => {
    return (
      <>
        <Navbar
          className="nav-template"
          variant="dark"
          sticky="top"
          expand="lg"
        >
          <Navbar.Brand className="logo" as={Link} to="/">
            Psicoworking
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Nav></Nav>
          </Navbar.Collapse>
        </Navbar>
      </>
    );
  };

  if (isLoading) {
    return <EmptyNavbar />;
  } else {
    return <>{isAuth ? <ProtectedNavbar /> : <PublicNavbar />}</>;
  }
};

export default WithLoadingSpinner(MainNavbar);

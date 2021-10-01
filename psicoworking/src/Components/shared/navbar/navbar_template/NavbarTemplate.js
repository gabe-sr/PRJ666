import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import "./NavbarTemplate.css";

const NavbarTemplate = (props) => {
  return (
    <Navbar className="nav-template" variant="dark" sticky="top" expand="lg">
      <Navbar.Brand className="logo" href={"/"}>
        Psicoworking
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse className="justify-content-end">
        <Nav>
          {props.navData.map(({ item, href, dropdown }) => {
            return dropdown.length > 0 ? (
              <NavDropdown key={item} id="basic-nav-dropdown" title={item}>
                {dropdown.map(({ item, href }) => (
                  <NavDropdown.Item key={item} href={href}>
                    {item}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            ) : (
              <Nav.Link
                key={item}
                className="nav-template-link md-auto customColor"
                href={href}
                onClick={() => console.log(item)}
              >
                {item}
              </Nav.Link>
            );
          })}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarTemplate;

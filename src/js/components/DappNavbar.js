import React from "react";

import { Nav, Navbar, Container } from "react-bootstrap";

function DappNavar(props) {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>LNP-Token Farm</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link>
            <span>Your're account: {props.account}</span>
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default DappNavar;

import React from "react";
import { Container } from "react-bootstrap";

const DashboardHome = (props) => {
  const { first_name, last_name } = props.userData;
  return (
    <div className="text-secondary">
      <h2>{`Welcome ${first_name} ${last_name}`}</h2>
      <hr />
      <Container className="text-left">
        <h4>Messages</h4>
        <p>You have no new messages.</p>
      </Container>
      <br />
      <hr />
      <Container className="text-left">
        <h4>Latest Bookings</h4>
        <p>You have no bookings.</p>
      </Container>
    </div>
  );
};

export default DashboardHome;

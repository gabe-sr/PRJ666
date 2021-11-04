import React from "react";
import { useHistory } from "react-router-dom";
import { Container, Accordion, Button } from "react-bootstrap";
import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";
import "./Reports.css";

const Reports = () => {
  const history = useHistory();

  return (
    <Container className="w-75 ">
      <div>
        <h2 className="text-secondary mb-4">Select a report type</h2>
        <br />
      </div>
      <Accordion flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header className="acc-header">
            <AiIcons.AiOutlineUser />
            <span>Users</span>
          </Accordion.Header>
          <Accordion.Body className="text-left">
            <span className="mr-4">Generate reports based on Users</span>
            <Button
              className="acc-btn"
              size="sm"
              onClick={() => history.push("/dashboard/report/user")}
            >
              Get user report
            </Button>
          </Accordion.Body>
          <br />
        </Accordion.Item>
        <br />
        <Accordion.Item eventKey="1">
          <Accordion.Header className="acc-header">
            <BsIcons.BsCalendar3 />
            <span>Bookings</span>
          </Accordion.Header>
          <Accordion.Body className="text-left">
            <span className="mr-4">Generate reports based on Bookings</span>
            <Button
              className="acc-btn"
              size="sm"
              onClick={() => history.push("/dashboard/")}
            >
              Get booking report
            </Button>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default Reports;

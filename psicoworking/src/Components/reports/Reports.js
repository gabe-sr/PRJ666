import React from "react";
import { useHistory } from "react-router-dom";
import { Container, Accordion, Button } from "react-bootstrap";
import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";
import * as HiIcons from "react-icons/hi";
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
            <HiIcons.HiOutlineDocumentReport />
            <span>Monthly Report : Total</span>
          </Accordion.Header>
          <Accordion.Body className="text-left">
            <span className="mr-4">
              Generate an overall report with totals for a selected month.
            </span>
            <Button
              className="acc-btn"
              size="sm"
              onClick={() => history.push("/dashboard/report/month_total")}
            >
              Click here
            </Button>
          </Accordion.Body>
          <br />
        </Accordion.Item>
        <br />
        <Accordion.Item eventKey="1">
          <Accordion.Header className="acc-header">
            <AiIcons.AiOutlineUser />
            <span>Monthly Report: by User</span>
          </Accordion.Header>
          <Accordion.Body className="text-left">
            <span className="mr-4">
              Generate a detailed report of bookings, by user, for a selected
              month.
            </span>
            <Button
              className="acc-btn"
              size="sm"
              onClick={() => history.push("/dashboard/report/month_user")}
            >
              Click here
            </Button>
          </Accordion.Body>
          <br />
        </Accordion.Item>
        <br />
        <Accordion.Item eventKey="2">
          <Accordion.Header className="acc-header">
            <BsIcons.BsCalendar3 />
            <span>Bookings</span>
          </Accordion.Header>
          <Accordion.Body className="text-left">
            <span className="mr-4">
              Generate detailed booking reports for all users, for a selected
              time.
            </span>
            <Button
              className="acc-btn"
              size="sm"
              onClick={() => history.push("/dashboard/report/booking")}
            >
              Click here
            </Button>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default Reports;

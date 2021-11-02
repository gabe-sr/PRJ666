import React from "react";
import { useHistory } from "react-router-dom";
import { Card, Button, Row } from "react-bootstrap";
import Room1Img from "../../images/room.png";
import Room2Img from "../../images/room2.jpeg";
import Room3Img from "../../images/room3.jpeg";
import "./Booking.css";

const Booking = () => {
  const history = useHistory();

  const handleRoom = (room_id) => {
    history.push({ pathname: `/dashboard/${room_id}/book` });
  };

  return (
    <>
      <h2 className="text-secondary">Select one of our available rooms</h2>
      <Row>
        <Card style={{ width: "18rem" }} className="m-3">
          <Card.Img
            variant="top"
            style={{ width: "15rem", height: "15rem" }}
            src={Room1Img}
          />
          <Card.Body>
            <Card.Title>Room 1</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
            <Row>
              <Button className="col-md-4 mr-3" variant="secondary">
                Details
              </Button>
              <Button
                className="booking-btn col-md-7"
                onClick={() => handleRoom("616610f8838d67d1fab083e9")}
              >
                Book this room
              </Button>
            </Row>
          </Card.Body>
        </Card>

        <Card style={{ width: "18rem" }} className="m-3">
          <Card.Img
            variant="top"
            style={{ width: "15rem", height: "15rem" }}
            src={Room2Img}
          />
          <Card.Body>
            <Card.Title>Room 2</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
            <Row>
              <Button className="col-md-4 mr-3" variant="secondary">
                Details
              </Button>
              <Button
                className="booking-btn col-md-7"
                onClick={() => handleRoom("6166134d4eca734cbfd3a412")}
              >
                Book this room
              </Button>
            </Row>
          </Card.Body>
        </Card>

        <Card style={{ width: "18rem" }} className="m-3">
          <Card.Img
            variant="top"
            style={{ width: "15rem", height: "15rem" }}
            src={Room3Img}
          />
          <Card.Body>
            <Card.Title>Room 3</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
            <Row>
              <Button className="col-md-4 mr-3" variant="secondary">
                Details
              </Button>
              <Button
                className="booking-btn col-md-7"
                onClick={() => handleRoom("6166136e4eca734cbfd3a415")}
              >
                Book this room
              </Button>
            </Row>
          </Card.Body>
        </Card>
      </Row>
    </>
  );
};

export default Booking;

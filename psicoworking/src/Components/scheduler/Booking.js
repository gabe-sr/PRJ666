import React from "react";
import { useHistory } from "react-router-dom";
import { Modal, Card, Button, Row } from "react-bootstrap";
import images from "../shared/hook/imagesDataSource";
import "./Booking.css";
import useFetchRoom from "../shared/hook/useFetchRoom";
import SpinnerLoading from "../shared/spinner/SpinnerLoading";
import Error from "../error-pages/Error";
import Carousel from 'react-bootstrap/Carousel'

const Booking = (props) => {
  const history = useHistory();

  const handleRoom = (rid) => {
    history.push({ pathname: `/dashboard/${props.userid}/${rid}/book` });
  };

  const handleMaintenance = (rid)=>{
    history.push({ pathname: `/dashboard/${props.userid}/${rid}/maintenance`});
  };

  const [modalShow, setModalShow] = React.useState(false);
  const [modalId, setModalId] = React.useState("");


  function RoomModal(props) {
    const { fetchedRoom, isLoading, error } = useFetchRoom(props.id);
    if (isLoading) {
      return <SpinnerLoading message="Loading room..." />;
    }
    if (error.status === true) {
      return <Error type={error.type} />;
    }

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {fetchedRoom.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Description</h4>
          <p>
            {fetchedRoom.description}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <>
      <h2 className="text-secondary">Select one of our available rooms</h2>
      <Row className="justify-content-center">
        <Card style={{ width: "18rem" }} className="m-3">
          <Carousel interval={null}>
            <Carousel.Item >
              <Card.Img
                variant="top"
                style={{ width: "15rem", height: "15rem", padding: "5px 0 0 0" }}
                src={images.roomBeige1}
              />
            </Carousel.Item>
            <Carousel.Item>
              <Card.Img
                variant="top"
                style={{ width: "15rem", height: "15rem", padding: "5px 0 0 0" }}
                src={images.roomBeige2}
              /></Carousel.Item>
          </Carousel>
          <Card.Body>
            <Card.Title>Room 1</Card.Title>
            <Card.Text>
            Sala espaçosa, com sofá de 3 lugares e poltrona. Ideal para atendimento individuais, de casais ou de família.<br/><br/><br/>
            </Card.Text>
            <Row>
              <Button className="col-md-4 mr-3" variant="secondary" onClick={() => {
                setModalId("616610f8838d67d1fab083e9")
                setModalShow(true);
              }}>
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
          <Card.Footer>
            {props.isAdmin &&
              <Button className="mr-3" variant="secondary" onClick={() => handleMaintenance("616610f8838d67d1fab083e9")}>
                Book Maintenance
              </Button>
            }
          </Card.Footer>
        </Card>

        <Card style={{ width: "18rem" }} className="m-3">
          <Carousel interval={null}>
            <Carousel.Item>
              <Card.Img
                variant="top"
                style={{ width: "15rem", height: "15rem", padding: "5px 0 0 0" }}
                src={images.roomBlue1}
              />
            </Carousel.Item>
            <Carousel.Item>
              <Card.Img
                variant="top"
                style={{ width: "15rem", height: "15rem", padding: "5px 0 0 0" }}
                src={images.roomBlue2}
              />
            </Carousel.Item>
          </Carousel>
          <Card.Body>
            <Card.Title>Room 2</Card.Title>
            <Card.Text>
            Sala espaçosa, com janelas amplas e linda vista. Equipada com duas poltronas confortáveis e uma mesa, ideal para aplicação de testes e atendimentos online. 
            </Card.Text>
            <Row>
              <Button className="col-md-4 mr-3" variant="secondary" onClick={() => {
                setModalId("6166134d4eca734cbfd3a412")
                setModalShow(true);
              }}>
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
          <Card.Footer>
            {props.isAdmin &&
              <Button className="mr-3" variant="secondary" onClick={() => handleMaintenance("6166134d4eca734cbfd3a412")}>
                Book Maintenance
              </Button>
            }
          </Card.Footer>
        </Card>

        <Card style={{ width: "18rem" }} className="m-3">
          <Carousel interval={null}>
            <Carousel.Item>
              <Card.Img
                variant="top"
                style={{ width: "15rem", height: "15rem", padding: "5px 0 0 0" }}
                src={images.roomGreen1}
              />
            </Carousel.Item>
            <Carousel.Item>
              <Card.Img
                variant="top"
                style={{ width: "15rem", height: "15rem", padding: "5px 0 0 0" }}
                src={images.roomGreen2}
              />
            </Carousel.Item>
          </Carousel>
          <Card.Body>
            <Card.Title>Room 3</Card.Title>
            <Card.Text>
            Sala com linda vista, duas poltronas amplas e confortáveis e divã moderno. <br/><br/><br/><br/>
            </Card.Text>
            <Row>
              <Button className="col-md-4 mr-3" variant="secondary" onClick={() => {
                setModalId("6166136e4eca734cbfd3a415")
                setModalShow(true);
              }}>
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
          <Card.Footer>
            {props.isAdmin &&
              <Button className="mr-3" variant="secondary" onClick={() => handleMaintenance("6166136e4eca734cbfd3a415")}>
                Book Maintenance
              </Button>
            }
          </Card.Footer>
        </Card>
        {modalShow &&
          <RoomModal
            show={modalShow}
            id={modalId}
            onHide={() => setModalShow(false)}
          />
        }
      </Row>
    </>
  );
};

export default Booking;

// IN PROGRES....

import React, { useEffect, useState } from "react";
import {
  Table,
  Container,
  Spinner,
  Nav,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import axios from "axios";

const FetchData = (props) => {
  const [values, setValues] = useState();
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchData = async () => {
    try {
      const data = await axios.get("http://localhost:8080/users");
      setValues(data.data);
      setIsLoaded(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!values) {
      fetchData();
    }
  }, [values]);

  return (
    <Container className="mt-4">
      <Row>
        <Col xs={2} className="border text-left">
          <Nav defaultActiveKey="/home" className="flex-column">
            <Nav.Link href="/home">Edit Profile</Nav.Link>
            <Nav.Link eventKey="link-1">Authorize (5)</Nav.Link>
            <Nav.Link eventKey="link-2">Rooms</Nav.Link>
            <Nav.Link eventKey="link-3">Reports</Nav.Link>
          </Nav>
        </Col>

        <Col>
          <Container className="">
            {isLoaded ? (
              <Table bordered hover size="sm" responsive="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>CRP Number</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {console.log(values)}
                  {values.map((user, index) => (
                    <>
                      <tr key={user._id}>
                        <td>{index}</td>
                        <td>{`${user.first_name} ${user.last_name}`}</td>
                        <td>{user.crp_no}</td>
                        <td>{user.email}</td>
                        <td>
                          <Button size="sm" variant="success">
                            Approve
                          </Button>{" "}
                        </td>
                        <td>
                          <Button size="sm" variant="secondary">
                            Delete
                          </Button>{" "}
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Container className="mt-4">
                <Spinner animation="border" variant="secondary" size="sm" />
                <Spinner animation="border" variant="secondary" />
                <Spinner animation="border" variant="secondary" size="sm" />
              </Container>
            )}
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default FetchData;

import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";

const UserQueryForm = ({ values, ...props }) => {
  // Yup validation schema
  const validationSchema = Yup.object().shape({
    startDate: Yup.date().max(
      new Date(),
      "Start date must be today's date or earlier"
    ),
    endDate: Yup.date()
      .min(Yup.ref("startDate"), "Date must be equal or after start date")
      .max(new Date(), "End date must be today's date or earlier"),
  });

  const handleSubmit = (values) => {
    const { name, room, startDate, endDate, sort } = values;
    let query = `name=${name}&room=${room}&startDate=${startDate}&endDate=${endDate}&sort=${sort}`;
    props.setQuery(query);
  };

  return (
    <>
      <Formik
        initialValues={{
          name: "",
          room: "",
          startDate: "",
          endDate: "",
          sort: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleSubmit, handleChange, errors, touched, isValid }) => (
          <>
            <Form noValidate onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Form.Group as={Col} xs={5} controlId="queryName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    name="name"
                    value={values.name}
                    type="text"
                    size="sm"
                    placeholder="Filter by name"
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group as={Col} xs={3} controlId="queryRoom">
                  <Form.Label>Room</Form.Label>
                  <Form.Select
                    aria-label="Room select"
                    size="sm"
                    name="room"
                    onChange={handleChange}
                  >
                    <option>Choose...</option>
                    <option value="616610f8838d67d1fab083e9">One</option>
                    <option value="6166134d4eca734cbfd3a412">Two</option>
                    <option value="6166136e4eca734cbfd3a415">Three</option>
                  </Form.Select>
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} xs={4} controlId="queryStartDate">
                  <Form.Label>Start date</Form.Label>
                  <Form.Control
                    name="startDate"
                    type="date"
                    size="sm"
                    value={values.startDate}
                    onChange={handleChange}
                    isInvalid={!!errors.startDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.startDate}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} xs={4} controlId="queryEndDate">
                  <Form.Label>End date</Form.Label>
                  <Form.Control
                    type="date"
                    size="sm"
                    name="endDate"
                    value={values.endDate}
                    onChange={handleChange}
                    isInvalid={!!errors.endDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.endDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>

              <Row>
                <Form.Label>Sort by</Form.Label>
                <Form.Group as={Col} xs={4} controlId="querySortBy" key="radio">
                  <Form.Check
                    inline
                    label="Name"
                    name="sort"
                    type="radio"
                    id="byName"
                    value="byName"
                    onChange={handleChange}
                  />
                  <Form.Check
                    inline
                    label="Date"
                    name="sort"
                    type="radio"
                    id="byDate"
                    value="byDate"
                    onChange={handleChange}
                  />
                  <Form.Check
                    inline
                    label="Room"
                    name="sort"
                    type="radio"
                    id="byRoom"
                    value="byRoom"
                    onChange={handleChange}
                  />
                </Form.Group>
              </Row>

              <Button
                type="submit"
                className="mt-4 mb-4"
                variant="secondary"
                size="sm"
              >
                Get report
              </Button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default UserQueryForm;

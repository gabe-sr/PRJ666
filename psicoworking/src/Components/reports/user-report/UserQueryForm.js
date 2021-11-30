import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { Timeslots } from "./Timeslots.js";

const UserQueryForm = ({ values, ...props }) => {
  // Yup validation schema
  const validationSchema = Yup.object().shape({
    startDate: Yup.date(),
    endDate: Yup.date().min(
      Yup.ref("startDate"),
      "Date must be equal or after start date"
    ),
    startTime: Yup.number(),
    endTime: Yup.number().min(
      Yup.ref("startTime"),
      "End must be equal or after start time"
    ),
  });

  const handleSubmit = (values) => {
    const { name, room, startDate, startTime, endDate, endTime, sort } = values;
    let query = `name=${name}&room=${room}&startDate=${startDate}&startTime=${startTime}&endDate=${endDate}&endTime=${endTime}&sort=${sort}`;
    props.setQuery(query);
  };

  return (
    <>
      <Formik
        initialValues={{
          name: "",
          room: 0,
          startDate: "",
          endDate: "",
          sort: "byName",
          startTime: 8,
          endTime: 19,
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
                    <option value={0}>All rooms</option>
                    <option value="616610f8838d67d1fab083e9">Room One</option>
                    <option value="6166134d4eca734cbfd3a412">Room Two</option>
                    <option value="6166136e4eca734cbfd3a415">Room Three</option>
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

                <Form.Group as={Col} xs={4} controlId="queryStartTime">
                  <Form.Label>Start time</Form.Label>
                  <Form.Select
                    aria-label="Start time select"
                    size="sm"
                    name="startTime"
                    onChange={handleChange}
                    isInvalid={!!errors.startTime}
                  >
                    <option value={8}>Select...</option>
                    {Timeslots.map((t, index) => {
                      return (
                        <option key={index} value={t.time}>
                          {t.text}
                        </option>
                      );
                    })}
                  </Form.Select>

                  <Form.Control.Feedback type="invalid">
                    {errors.startTime}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>

              <Row className="mb-3">
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

                <Form.Group as={Col} xs={4} controlId="queryEndTime">
                  <Form.Label>End time</Form.Label>
                  <Form.Select
                    aria-label="End time select"
                    size="sm"
                    name="endTime"
                    onChange={handleChange}
                    isInvalid={!!errors.endTime}
                  >
                    <option value={19}>Select...</option>
                    {Timeslots.map((t, index) => {
                      return (
                        <option key={index} value={t.time}>
                          {t.text}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.endTime}
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
                    defaultChecked={true}
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
                </Form.Group>
              </Row>

              <Row className="row">
                <Form.Group as={Col} xs={2} className="text-left">
                  <Button
                    type="submit"
                    className="mt-4 mb-4"
                    variant="secondary"
                    size="sm"
                  >
                    Get report
                  </Button>
                </Form.Group>
                <Form.Group as={Col} xs={2} className="text-left">
                  {props.children}
                </Form.Group>
              </Row>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default UserQueryForm;

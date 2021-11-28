import { useState, useEffect, useRef } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  eachMonthOfInterval,
  eachYearOfInterval,
  format,
  getMonth,
  getYear,
  startOfYear,
  endOfYear,
  set,
} from "date-fns";
import axios from "axios";
import "./QueryForm.css";

const QueryForm = ({ ...props }) => {
  //
  // -------------------- HELPERS --------------------- //

  // helper to get a list of months within the year passed as argument
  const getSelectMonths = (year) => {
    let months = [];
    let day;

    if (year === "-1") {
      return months;
    }
    if (year < getYear(new Date())) {
      day = endOfYear(set(new Date(), { year: year }));
    } else {
      day = set(new Date(), { year: year });
    }

    let monthArray = eachMonthOfInterval({
      start: startOfYear(day),
      end: day,
    });
    monthArray.forEach((mon) => {
      months.push({ name: format(mon, "MMMM"), value: getMonth(mon) });
    });

    return months;
  };

  // helper to get a list of years, up to current year
  const getSelectYears = () => {
    let years = [];
    let yearArray = eachYearOfInterval({
      start: new Date(2021, 1, 1),
      end: new Date(),
    });
    yearArray.forEach((y) => {
      years.push(format(y, "y"));
    });

    return years.sort((a, b) => b - a);
  };

  // -------------------- STATE --------------------- //
  const [monthsList, setMonthsList] = useState([]);
  const [yearChanged, setYearChanged] = useState(false);

  const yearsList = getSelectYears(); // set list of years based on current year
  const formRef = useRef(); // a reference to the formik form context

  // when a year is selected, it handles the list of months
  useEffect(() => {
    if (yearChanged) {
      setMonthsList(getSelectMonths(formRef.current.values.year));
      setYearChanged((prev) => !prev);
    }
  }, [yearChanged]);

  // -------------------- NAME SUGGESTIONS --------------------- //
  const [suggestions, setSuggestions] = useState([]);

  // set the suggestion's list based on the input field (3 or more letters)
  const handleSuggestions = async (e) => {
    let value = e.target.value;

    if (suggestions.length === 0 && value.length >= 3) {
      try {
        const response = await axios.get(`/users?name=${value}`);

        if (response.data) {
          const suggestions = [];
          response.data.forEach((name) => {
            suggestions.push(`${name.first_name} ${name.last_name}`);
          });

          if (suggestions.length > 0) {
            setSuggestions(suggestions);
          }
        }
      } catch (err) {
        console.log(err);
      }
    } else if (suggestions.length > 0 && value.length < 3) {
      setSuggestions([]);
    }
  };

  // Set the formik form = the selected name from the list
  const handleNameClick = (sug) => {
    formRef.current.setFieldValue("name", sug);
    setSuggestions([]);
  };

  // -------------------- Form Validation --------------------- //
  // Yup validation schema
  const validationSchema = Yup.object().shape({
    year: Yup.number().required("Required").min(0, "Please, select a year"),
    month: Yup.number().required("Required").min(0, "Please, select a month"),
  });

  const handleSubmit = (values) => {
    const { name, year, month, sort, show_cancel } = values;
    let query = `name=${name}&year=${year}&month=${month}&sort=${sort}&show_cancel=${show_cancel}&id=`;
    props.setQuery(query);
  };

  return (
    <>
      <Formik
        initialValues={{
          name: "",
          room: 0,
          year: -1,
          month: -1,
          sort: "asc",
          show_cancel: false,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        innerRef={formRef}
      >
        {({ values, handleSubmit, handleChange, errors, touched }) => (
          <>
            <Form className="query-form" onSubmit={handleSubmit}>
              <Row className="row mb-4 text-left">
                <Form.Group as={Col} xs={4} controlId="queryName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    className="name-input"
                    name="name"
                    value={values.name}
                    type="text"
                    size="sm"
                    autoComplete="off"
                    placeholder="Type user name"
                    onBlur={() => setTimeout(() => setSuggestions([]), 500)}
                    onChange={(e) => {
                      handleChange(e);
                      handleSuggestions(e);
                    }}
                  />
                  {suggestions.length > 0 ? (
                    <div className="suggestions">
                      {suggestions.map((sug, idx) => {
                        return (
                          <li
                            className="suggestions-item"
                            type="button"
                            onClick={() => handleNameClick(sug)}
                            key={idx}
                          >
                            {sug}
                          </li>
                        );
                      })}
                    </div>
                  ) : null}
                </Form.Group>

                <Form.Group as={Col} xs={2} controlId="queryYear">
                  <Form.Label>Year</Form.Label>
                  <Form.Select
                    aria-label="Select Year"
                    size="sm"
                    name="year"
                    onChange={(e) => {
                      handleChange(e);
                      setYearChanged(true);
                    }}
                    isInvalid={touched.year && !!errors.year}
                  >
                    <option value={-1}>Select...</option>
                    {yearsList.map((y) => {
                      return (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.year}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} xs={2} controlId="queryMonth">
                  <Form.Label>Month</Form.Label>
                  <Form.Select
                    aria-label="Select Month"
                    size="sm"
                    name="month"
                    onChange={handleChange}
                    isInvalid={touched.month && !!errors.month}
                  >
                    <option value={-1}>Select...</option>
                    {monthsList.map((mon) => {
                      return (
                        <option key={mon.value} value={mon.value}>
                          {mon.name}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.month}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>

              <Row className="row text-left">
                <Form.Label as={Col} xs={{ span: 1, offset: 2 }}>
                  Sort
                </Form.Label>
                <Form.Group
                  as={Col}
                  xs={{ span: 3, offset: 0 }}
                  controlId="querySortBy"
                  key="radio"
                >
                  <Form.Check
                    inline
                    label="Oldest date"
                    name="sort"
                    type="radio"
                    id="asc"
                    value="asc"
                    onChange={handleChange}
                    defaultChecked={true}
                  />
                  <Form.Check
                    inline
                    label="Newest date"
                    name="sort"
                    type="radio"
                    id="desc"
                    value="desc"
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group
                  as={Col}
                  // xs={{ span: 0, offset: 5 }}
                  controlId="queryShowCancel"
                  key="checkbox"
                >
                  <Form.Check
                    inline
                    label="Show cancelled bookings"
                    name="show_cancel"
                    id="show_cancel"
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

export default QueryForm;

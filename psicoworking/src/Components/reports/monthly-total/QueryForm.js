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

  // -------------------- Form Validation --------------------- //
  // Yup validation schema
  const validationSchema = Yup.object().shape({
    year: Yup.number().required("Required").min(0, "Please, select a year"),
    month: Yup.number().required("Required").min(0, "Please, select a month"),
  });

  const handleSubmit = (values) => {
    const { name, year, month, sort } = values;
    let query = `name=${name}&year=${year}&month=${month}&sort=${sort}&show_cancel=false`;
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
          sort: "byName",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        innerRef={formRef}
      >
        {({
          values,
          handleSubmit,
          handleChange,
          handleBlur,
          errors,
          touched,
          isValid,
        }) => (
          <>
            <Form className="query-form" onSubmit={handleSubmit}>
              <Row className="row mb-4 text-left">
                <Form.Group as={Col} xs={3} controlId="queryYear">
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

                <Form.Group as={Col} xs={3} controlId="queryMonth">
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
                <Form.Label as={Col} xs={{ span: 1, offset: 3 }}>
                  Sort
                </Form.Label>
                <Form.Group
                  as={Col}
                  xs={{ span: 6, offset: 0 }}
                  controlId="querySortBy"
                  key="radio"
                >
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
                    label="Total Amount"
                    name="sort"
                    type="radio"
                    id="byAmount"
                    value="byAmount"
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

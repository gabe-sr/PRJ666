import React from "react";
import { TextField } from "./form-components/TextField";
import { DropdownField } from "./form-components/DropdownField";
import { state_data } from "./form_state_data";
import "./Signupform.css";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const SignUpForm = () => {
  // Yup validation schema
  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .max(20, "First Name must be 20 characters or less")
      .required("Required"),
    lastName: Yup.string()
      .max(20, "Last Name must be 20 characters or less")
      .required("Required"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 charaters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Password must match")
      .required("Confirm password is required"),
    city: Yup.string().required(),
    state: Yup.string().required(),
    zip: Yup.string().required(),
  });

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        city: "",
        state: "",
        zip: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {(formik) => (
        <div className="signup-container">
          <Form>
            <TextField label="First Name" name="firstName" type="text" />
            <TextField label="Last Name" name="lastName" type="text" />
            <TextField
              label="Email"
              name="email"
              type="email"
              placeholder="example@email.com"
            />
            <TextField label="Password" name="password" type="password" />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
            />
            <DropdownField label="State" data={state_data} name="state" />
            <button className="btn btn-dark mt-3" type="submit">
              Sign Up
            </button>
            <button className="btn btn-danger mt-3 ml-3" type="reset">
              Reset Form
            </button>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default SignUpForm;

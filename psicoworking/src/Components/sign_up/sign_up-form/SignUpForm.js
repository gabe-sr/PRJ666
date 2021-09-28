import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { TextField } from "./form-components/TextField";
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
    crp_no: Yup.string()
      .min(8, "Invalid CRP format")
      .required("CRP number is required"),
    phone: Yup.string()
      .min(12, "Phone number is invalid")
      .required("Phone number is required"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 charaters")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Password must match")
      .required("You must confirm your password"),
    dob: Yup.date().required("Required"),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    zip: Yup.string().required("Required"),
    address1: Yup.string().required("Required"),
    address2: Yup.string().required("Required"),
  });

  const defaultValues = {
    zip: "",
    city: "",
    state: state_data[0],
    address1: "",
  };

  const [address, setAddress] = useState(defaultValues);

  const handleChangeZip = (e, formik) => {
    const cep = e.target.value;
    setAddress({ ...address, zip: cep });
    if (cep.length >= 8) {
      console.log("ZIP CHANGED");
      axios.get(`https://viacep.com.br/ws/${cep}/json/ `).then((res) => {
        let state_uf = state_data.find(
          (uf) => uf.substring(0, 2).search(res.data.uf) >= 0
        );

        formik.setFieldValue("zip", cep);
        formik.setFieldValue("city", res.data.localidade);
        formik.setFieldValue("state", state_uf);
        formik.setFieldValue("address1", res.data.logradouro);
        // setAddress({
        //   zip: cep,
        //   city: res.data.localidade,
        //   state: state_uf,
        //   address1: res.data.logradouro,
        // });
      });
    }
  };

  // const handleChangeAddress = (e) => {
  //   const name = e.target.name;
  //   const value = e.target.value;
  //   setAddress({ ...address, [name]: value });
  // };

  const resetForm = () => {
    setAddress(defaultValues);
  };

  let history = useHistory();

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        crp_no: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        dob: "",
        zip: "",
        city: "",
        state: "",
        address1: "",
        address2: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log(values);
        history.push("/");
      }}
    >
      {(formik) => (
        <div className="signup-container">
          <Form>
            <TextField label="First Name" name="firstName" type="text" />
            <TextField label="Last Name" name="lastName" type="text" />
            <TextField
              label="CRP (region/number)"
              name="crp_no"
              type="text"
              maxLength="8"
              placeholder="00/00000"
            />
            <TextField
              label="Phone"
              name="phone"
              type="text"
              maxLength="13"
              placeholder="00-00000-0000"
            />
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
            <TextField label="Date of Birth" name="dob" type="date" />
            <div className="form-row">
              <div className="form-group col-md-3">
                <TextField
                  label="Zip"
                  type="text"
                  maxLength="8"
                  name="zip"
                  onKeyUp={(e) => handleChangeZip(e, formik)}
                />
              </div>

              <div className="form-group col-md-5">
                <TextField
                  label="City"
                  type="text"
                  maxLength="30"
                  name="city"
                />
              </div>

              <div className="form-group col-md-4">
                <label htmlFor="inputState">State</label>
                <select id="inputState" className="form-control" name="state">
                  {state_data.map((opt, idx) => {
                    return <option key={idx}>{opt}</option>;
                  })}
                </select>
              </div>
            </div>

            <TextField
              label="Address"
              name="address1"
              type="text"
              placeholder="Main St"
            />
            <TextField
              label="Address 2"
              name="address2"
              type="text"
              placeholder="Number, Apartment, studio, or floor"
            />

            <button
              className="btn btn-outline-primary mt-3 mr-4 mb-4"
              type="submit"
            >
              Sign Up
            </button>
            <button
              className="btn btn-outline-danger mt-3 ml-3 mb-4"
              type="reset"
              onClick={resetForm}
            >
              Reset Form
            </button>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default SignUpForm;

import { useHistory } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FormField } from "../../shared/form-components/FormField";
import { state_uf_data } from "./state_uf_data";
import "./Signupform.css";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import WithLoadingSpinner from "../../HOC/loading-spinner/WithLoadingSpinner";

const SignUpForm = (props) => {
  // --- This will handle the autocomplete delimiters in form ---/
  const [crpDelimiter, setCrpDelimiter] = useState(false);
  const [phoneDelimiter, setPhoneDelimiter] = useState(false);

  const crpDelimiterHandle = () => {
    const { crp_no } = formRef.current.values;
    if (crp_no.length > 1) {
      if (!crpDelimiter) {
        formRef.current.setFieldValue("crp_no", crp_no + "/");
        setCrpDelimiter(true);
      }
    } else {
      setCrpDelimiter(false);
    }
  };

  const phoneDelimiterHandle = () => {
    const { phone } = formRef.current.values;
    if (phone.length === 2 && !phoneDelimiter) {
      formRef.current.setFieldValue("phone", phone + "-");
      setPhoneDelimiter(true);
    } else if (phone.length === 8 && !phoneDelimiter) {
      formRef.current.setFieldValue("phone", phone + "-");
      setPhoneDelimiter(true);
    } else {
      setPhoneDelimiter(false);
    }
  };

  //--- *Yup* validation schema ---/
  const validationSchema = Yup.object().shape({
    first_name: Yup.string()
      .max(20, "First Name must be 20 characters or less")
      .required("Required"),
    last_name: Yup.string()
      .max(20, "Last Name must be 20 characters or less")
      .required("Required"),
    crp_no: Yup.string()
      .min(8, "Invalid CRP format")
      .required("CRP number is required")
      .matches(/^[0-9]{2}\/[0-9]{5}$/, "Invalid CRP format"),
    phone: Yup.string()
      .min(12, "Phone number is invalid")
      .required("Phone number is required")
      .matches(/^[0-9]{2}-[0-9]{5}-[0-9]{4}$/, "Invalid phone format"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 charaters")
      .required("Required")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
        "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, and 1 number."
      ),
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

  //---- This will handle address auto-complete when Zip is entered ----/
  // It fetches address data from an external API
  // then it saves fetched data into respective formik field values
  const handleFetchZip = async () => {
    const cep = formRef.current.values.zip;
    if (cep.length >= 8) {
      try {
        axios.get(`https://viacep.com.br/ws/${cep}/json/ `).then((res) => {
          if (!res.data.erro) {
            let state_uf = state_uf_data.find(
              (uf) => uf.substring(0, 2).search(res.data.uf) >= 0
            );

            formRef.current.setFieldValue("city", res.data.localidade);
            formRef.current.setFieldValue("state", state_uf);
            formRef.current.setFieldValue("address1", res.data.logradouro);
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  // --- Redirects --- //
  // enables history object: allows redirection after POST
  let history = useHistory();

  // --- Handle error response from backend POST --- //
  // uses useRef to scrool up to the field with problems (email, crp, etc...)
  const [apiError, setApiError] = useState(false);
  const errorRef = useRef(null);
  const formRef = useRef();

  // scrolls up to the email field
  const executeScroll = () => {
    errorRef.current && errorRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // tracks changes to apiError, if true call function to scroll up
  useEffect(() => {
    if (apiError) {
      executeScroll();
      setApiError(false);
    }
  }, [apiError]);

  // ---- Handle form submit ---- //
  const { setLoadingSpinner } = props;

  const handleSubmitForm = async (values, { setFieldError }) => {
    // Fetch data from API
    try {
      setLoadingSpinner(true, "Submitting user information...");
      const response = await axios({
        method: "post",
        url: "/users",
        data: values,
      });

      // include display property and set to false
      response.data = { ...response.data, display: false };

      // destructuring the response data from API
      const { success, message, redirectURL, type } = response.data;
      console.log(response.data);

      setLoadingSpinner(false);

      // if response is not success
      // in case of an "email" error, it setApiError to true, which will call the scroll up function
      // if any other error, it redirects to "redirectURL", using history.push()
      if (!success) {
        if (type === "email") {
          setApiError(true);
          setFieldError(type, message);
        } else {
          history.push({
            pathname: redirectURL,
            state: { ...response.data, display: true },
          });
        }

        // if success is true, redirects and display a success message
      } else {
        history.push({
          pathname: redirectURL,
          state: { ...response.data, display: true },
        });
      }

      // if API call fails, shows an error message and redirects to /signup
    } catch (e) {
      setLoadingSpinner(false);
      history.push({
        pathname: "/signup",
        state: {
          message: "Something went wrong",
          display: true,
        },
      });
    }
  };

  return (
    <Formik
      innerRef={formRef}
      initialValues={{
        first_name: "",
        last_name: "",
        crp_no: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        dob: "",
        zip: "",
        city: "",
        state: state_uf_data[0], // 'Choose...'
        address1: "",
        address2: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmitForm}
    >
      {(formik) => (
        <div className="signup-container">
          <Form>
            <FormField
              formType="input"
              label="First Name"
              name="first_name"
              type="text"
            />
            <FormField
              formType="input"
              label="Last Name"
              name="last_name"
              type="text"
            />
            <FormField
              formType="input"
              label="CRP (region/number)"
              name="crp_no"
              type="text"
              maxLength="8"
              placeholder="00/00000"
              onKeyUp={() => crpDelimiterHandle()}
            />
            <FormField
              formType="input"
              label="Phone"
              name="phone"
              type="text"
              maxLength="13"
              placeholder="00-00000-0000"
              onKeyUp={() => phoneDelimiterHandle()}
            />
            <FormField
              formType="input"
              label="Email"
              name="email"
              type="email"
              placeholder="example@email.com"
              myref={errorRef}
            />
            <FormField
              formType="input"
              label="Password"
              name="password"
              type="password"
            />
            <FormField
              formType="input"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
            />
            <FormField
              formType="input"
              label="Date of Birth"
              name="dob"
              type="date"
            />
            <div className="form-row">
              <div className="form-group col-md-3">
                <FormField
                  formType="input"
                  label="Zip"
                  type="text"
                  maxLength="8"
                  name="zip"
                  onKeyUp={(e) => handleFetchZip()}
                />
              </div>

              <div className="form-group col-md-5">
                <FormField
                  formType="input"
                  label="City"
                  type="text"
                  maxLength="30"
                  name="city"
                />
              </div>

              <div className="form-group col-md-4">
                <FormField
                  label="State"
                  formType="select"
                  formData={state_uf_data}
                  id="inputState"
                  className="form-control"
                  name="state"
                />
              </div>
            </div>

            <FormField
              formType="input"
              label="Address"
              name="address1"
              type="text"
              placeholder="Main St"
            />
            <FormField
              formType="input"
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
            >
              Reset Form
            </button>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default WithLoadingSpinner(SignUpForm);

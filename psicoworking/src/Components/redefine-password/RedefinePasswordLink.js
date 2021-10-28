import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { FormField } from "../shared/form-components/FormField";
import axios from "axios";
import WithMessage from "../HOC/modal-messages/WithMessage";
import WithLoadingSpinner from "../HOC/loading-spinner/WithLoadingSpinner";
import "./RedefinePassword.css";
import Error from "../error-pages/Error";

const RedefinePasswordLink = (props) => {
  const [state, setState] = useState();

  // GET SPINNER AND MODAL MESSAGE from props
  const { linkId, setLoadingSpinner, setModalMessage } = props;

  useEffect(() => {
    setLoadingSpinner(false);
    const getLink = async (link) => {
      try {
        const response = await axios.get(`/authentication/redefine/${link}`);
        console.log(response.data);
        setState(response.data.email);
      } catch (err) {
        console.log(err);
      }
    };

    getLink(linkId);
  }, [linkId, setLoadingSpinner]);

  // YUP VALIDATION SCHEMA
  const validationSchema = Yup.object().shape({
    // email: Yup.string().email("Email is invalid").required("Email is required"),
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
  });

  // HANDLE SUBMIT
  const handleSubmit = async (values) => {
    setLoadingSpinner(true, "Processing...");

    try {
      values.email = state;
      const response = await axios.patch(`/users/redefine_password`, {
        values,
      });

      const { success } = response.data;

      setLoadingSpinner(false);

      // if submission response is successfull
      if (success) {
        setModalMessage(
          true,
          "Success",
          "Your password has been redefined. Please, log in into your account using your new password",
          "/"
        );

        // If login response is successfull and user IS ACTIVATED
      } else {
        setModalMessage(
          true,
          "Something went wrong",
          "We couldn't process your request at this time. Please, try again later."
        );
      }
    } catch (e) {
      setLoadingSpinner(false);
      setModalMessage(
        true,
        "Something went wrong",
        "We couldn't process your request at this time. Please, try again later."
      );
    }
  };

  if (!state) {
    return <Error type="404" />;
  }

  return (
    <Formik
      initialValues={{
        //email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <div className="container-fluid w-75">
          <h3 className="display-6 mb-3 text-secondary">Reset your password</h3>
          <p className="mr-4 ml-2 mb-4 ">Please, choose your new password</p>
          <Container className="pt-2">
            <Form className="reset-pass-form">
              <FormField
                formType="input"
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your new password"
              />
              <FormField
                formType="input"
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
              />
              <button
                className="login-form-btn btn btn-block btn-outline-primary mt-3 mb-3 "
                type="submit"
              >
                Submit
              </button>
            </Form>
          </Container>
        </div>
      )}
    </Formik>
  );
};

export default WithLoadingSpinner(WithMessage(RedefinePasswordLink));

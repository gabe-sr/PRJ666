import { useEffect } from "react";
import { Container } from "react-bootstrap";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { FormField } from "../shared/form-components/FormField";
import axios from "axios";
import WithMessage from "../HOC/modal-messages/WithMessage";
import WithLoadingSpinner from "../HOC/loading-spinner/WithLoadingSpinner";
import "./RedefinePassword.css";

const RedefinePassword = (props) => {
  // YUP VALIDATION SCHEMA
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email is invalid").required("Email is required"),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // GET SPINNER AND MODAL MESSAGE from props
  const { setLoadingSpinner, setModalMessage } = props;

  // HANDLE SUBMIT
  const handleSubmit = async (values) => {
    setLoadingSpinner(true, "Processing...");

    try {
      const response = await axios.post("/authentication/redefine", values);

      const { success } = response.data;

      setLoadingSpinner(false);

      // if submission response is successfull
      if (success) {
        setModalMessage(
          true,
          "Check your email",
          "We have sent a password recover instructions to your email. Please check your inbox.",
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

  return (
    <Formik
      initialValues={{
        email: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <div className="container-fluid w-75">
          <h3 className="display-6 mb-3 text-secondary">
            Redefine your password
          </h3>
          <p className="mr-4 ml-2 mb-4 ">
            Enter the email associated with your account and we'll send an email
            with instructions to redefine your password.
          </p>
          <Container className="pt-2">
            <Form className="reset-pass-form">
              <FormField
                formType="input"
                label="Email"
                name="email"
                type="email"
                placeholder="example@email.com"
              />
              <button
                className="login-form-btn btn btn-block btn-outline-primary mt-3 mb-3 "
                type="submit"
              >
                Send instructions
              </button>
            </Form>
          </Container>
        </div>
      )}
    </Formik>
  );
};

export default WithLoadingSpinner(WithMessage(RedefinePassword));

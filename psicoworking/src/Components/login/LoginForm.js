import React from "react";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { FormField } from "../shared/form-components/FormField";
import "./LoginForm.css";
import axios from "axios";

const LoginForm = (props) => {
  //--- *Yup* validation schema ---//;
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 charaters")
      .required("Required"),
  });

  // ------- HANDLE LOGIN SUBMIT ------ //

  const history = useHistory();

  const handleLoginSubmit = async (values, { setFieldError }) => {
    try {
      const response = await axios.post("/users/login", values);

      response.data = { ...response.data, display: false };
      const { success, message, type } = response.data;
      console.log(response);

      // If login response is successfull
      if (success) {
        props.handlemodal();
        history.push({
          pathname: `/user/${response.data.id}`,
          state: { ...response.data, display: true },
        });

        // If login response is NOT successfull
      } else {
        // if is a email/password problem...
        if (type === "form") {
          // setApiError(true);
          setFieldError("password", message);
          setFieldError("email", " ");

          // any other error...
        } else {
          props.handleModal();
          history.push({
            pathname: `/`,
            state: { ...response.data, display: true },
          });
        }
      }
    } catch (e) {
      props.handlemodal();
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
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleLoginSubmit}
    >
      {(formik) => (
        <div className="login-container">
          <Form>
            <FormField
              formType="input"
              label="Email"
              name="email"
              type="email"
              placeholder="example@email.com"
            />
            <FormField
              formType="input"
              label="Password"
              name="password"
              type="password"
            />
            <div className="login-forgotPassword">
              <a href="/">Forgot password?</a>
            </div>

            <button
              className="login-form-btn btn btn-block btn-outline-primary mt-3 mb-3"
              type="submit"
            >
              Continue
            </button>

            <hr />
            <div className="login-form-footer">
              <p className="text-right">
                Don't have an account?{" "}
                <span className="login-form-signup-link">
                  <a href="/signup">Sign up</a>
                </span>
              </p>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default LoginForm;

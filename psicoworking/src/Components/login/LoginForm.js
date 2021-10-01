import React from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { FormField } from "../shared/form-components/FormField";
import "./LoginForm.css";

const LoginForm = (props) => {
  //--- *Yup* validation schema ---//;
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 charaters")
      .required("Required"),
  });

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={validationSchema}
      onSubmit={() => console.log("submitted!")}
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

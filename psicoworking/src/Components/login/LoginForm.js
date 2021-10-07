import React from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { FormField } from "../shared/form-components/FormField";
import "./LoginForm.css";
//import axios from "axios";

const LoginForm = (props) => {
  //--- *Yup* validation schema ---//;
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 charaters")
      .required("Required"),
  });

  // ---- Handle login submit ---- //
  //const handleLoginSubmit = async (values, { setFieldError }) => {
    // try {
    //   const response = await axios({
    //     method: "post",
    //     url: "http://localhost:8080/users",
    //     data: values,
    //   });
    //   response.data = { ...response.data, display: false };
    //   const { success, message, redirectURL, type } = response.data;
    //   console.log(response.data);
    //   if (!success) {
    //     if (type === "email") {
    //       setApiError(true);
    //       setFieldError(type, message);
    //     } else {
    //       history.push({
    //         pathname: redirectURL,
    //         state: { ...response.data, display: true },
    //       });
    //     }
    //   } else {
    //     history.push({
    //       pathname: redirectURL,
    //       state: { ...response.data, display: true },
    //     });
    //   }
    // } catch (e) {
    //   history.push({
    //     pathname: "/signup",
    //     state: {
    //       message: "Something went wrong",
    //       display: true,
    //     },
    //   });
    // }
  //};

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

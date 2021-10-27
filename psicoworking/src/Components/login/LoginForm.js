import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { FormField } from "../shared/form-components/FormField";
import "./LoginForm.css";
import axios from "axios";
import WithMessage from "../HOC/modal-messages/WithMessage";
import WithLoadingSpinner from "../HOC/loading-spinner/WithLoadingSpinner";

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

  const { setLoadingSpinner, setModalMessage } = props;

  const handleLoginSubmit = async (values, { setFieldError }) => {
    setLoadingSpinner(true, "Logging in...");

    try {
      const response = await axios.post("/authentication/login", values);

      response.data = { ...response.data, display: false };
      const { success, message, type, active } = response.data;

      setLoadingSpinner(false);

      // if login response is successfull but user is NOT activated
      if (!active && success) {
        setModalMessage(
          true,
          "User is not Activated",
          "Your application is currently under review by our team. This process may take up to 48 hours to be concluded. Please, try again later.",
          "/",
          { callBack: () => props.handlemodal() }
        );

        // If login response is successfull and user IS ACTIVATED
      } else if (success) {
        props.handlemodal();

        history.push({
          pathname: `/dashboard`,
          state: { ...response.data, display: true },
        });
        history.go(`/dashboard`);

        // If login response is NOT successfull
      } else {
        // if is a email/password problem...
        if (type === "form") {
          setFieldError("password", message);
          setFieldError("email", " ");

          // any other error...
        } else {
          setModalMessage(
            true,
            "Something went wrong",
            "Could not log in at this time. Please try again in a few minutes.",
            "/",
            { callBack: () => props.handlemodal() }
          );
        }
      }
    } catch (e) {
      setLoadingSpinner(false);
      setModalMessage(
        true,
        "Something went wrong",
        "Could not log in at this time. Please try again in a few minutes.",
        "/pricing",
        { callBack: () => props.handlemodal() }
      );
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

export default WithLoadingSpinner(WithMessage(LoginForm));

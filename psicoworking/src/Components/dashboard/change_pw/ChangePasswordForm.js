import { useRef } from "react";
import axios from "axios";
import { FormField } from "../../shared/form-components/FormField";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import useFetchUser from "../../shared/hook/useFetchUser";
import SpinnerLoading from "../../shared/spinner/SpinnerLoading";
import Error from "../../error-pages/Error";
import WithMessage from "../../HOC/modal-messages/WithMessage";

const ChangePasswordForm = (props) => {
    const { fetchedUser, isLoading, error } = useFetchUser(props.id);

      //--- *Yup* validation schema ---/
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 charaters")
      .required("Required")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
        "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, and 1 number."
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Password must match")
      .required("You must confirm your password")
  });
  // --- Handle error response from backend POST --- //
  // uses useRef to scrool up to the field with problems (email, crp, etc...)
  const formRef = useRef();

  // --- Redirects --- //
  // enables history object: allows redirection after POST
  let history = useHistory();

  const { setModalMessage } = props;
  // ---- Handle form submit ---- //
  const handleSubmitForm = async (values, { resetForm }) => {
    // Fetch data from API
    try {
      const response = await axios({
        method: "put",
        url: `/authentication/${values._id}/changePassword`,
        data: values,
      });

      // include display property and set to false
      response.data = { ...response.data, display: false };

      // destructuring the response data from API
      const { success, redirectURL } = response.data;

      if (success) {
        setModalMessage(true, "Success", "User password successfully updated.");
        //window.scrollTo(0, 0);
        resetForm();
      } else {
        history.push({
          pathname: redirectURL,
          state: { ...response.data, display: true },
        });
      }

      // if API call fails, shows an error message and redirects
    } catch (e) {
      history.push({
        pathname: `dashboard/user/${values._id}/changePassword`,
        state: {
          message: "Something went wrong",
          display: true,
        },
      });
    }
  };

  if (isLoading) {
    return <SpinnerLoading message="Loading profile..." />;
  }
  if (error.status === true) {
    return <Error type={error.type} />;
  }

  const handleAdminDisabled = () => {
    if (fetchedUser._id === props.user._id) {
      return false;
    } else if (props.user.isAdmin && fetchedUser._id === props.user._id) {
      return false;
    } else {
      return true;
    }
  };
  return (
    <div className="p-3 py-5">
      <div className="d-flex justify-content-between mb-3">
        <h4>
          {fetchedUser.first_name} {fetchedUser.last_name}
        </h4>
      </div>

      <div className="row mt-2">
        <Formik
          innerRef={formRef}
          initialValues={{
            _id: fetchedUser._id,
            password: "",
            confirmPassword: ""
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmitForm}
        >
          {(formik) => (
            <div className="signup-container">
              <Form>
              <FormField
              formType="input"
              label="New Password"
              name="password"
              type="password"
            />
            <FormField
              formType="input"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
            />

                {handleAdminDisabled() === true ? null : (
                  <>
                    <button
                      className="btn btn-outline-primary mt-3 mr-4 mb-4"
                      type="submit"
                    >
                      Save Changes
                    </button>
                    <button
                      className="btn btn-outline-danger mt-3 ml-3 mb-4"
                      type="reset"
                    >
                      Reset Form
                    </button>
                  </>
                )}
              </Form>
            </div>
          )}
        </Formik>
      </div>
    </div>
  );


};
export default WithMessage(ChangePasswordForm);
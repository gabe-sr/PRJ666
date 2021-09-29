//import { useHistory } from "react-router-dom";
import axios from "axios";
import { FormField } from "./form-components/FormField";
import { state_uf_data } from "./state_uf_data";
import "./Signupform.css";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const SignUpForm = () => {
  // Yup validation schema
  const validationSchema = Yup.object().shape({
    first_name: Yup.string()
      .max(20, "First Name must be 20 characters or less")
      .required("Required"),
    last_name: Yup.string()
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

  // This will handle address auto-complete when Zip is entered
  // It fetches address data from an external API
  // then it saves fetched data into respective formik field values
  const handleFetchZip = async (e, formik) => {
    const cep = e.target.value;
    if (cep.length >= 8) {
      try {
        axios.get(`https://viacep.com.br/ws/${cep}/json/ `).then((res) => {
          if (!res.data.erro) {
            let state_uf = state_uf_data.find(
              (uf) => uf.substring(0, 2).search(res.data.uf) >= 0
            );

            formik.setFieldValue("city", res.data.localidade);
            formik.setFieldValue("state", state_uf);
            formik.setFieldValue("address1", res.data.logradouro);
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  // for redirection after POST
  // let history = useHistory();

  return (
    <Formik
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
        state: state_uf_data[0],
        address1: "",
        address2: "",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        console.log(values);
        try {
          // const response = await axios({ ...
          await axios({
            method: "post",
            url: "http://localhost:8080/users",
            data: values,
          });
        } catch (e) {
          console.log(e);
        }

        //history.push("/");
      }}
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
            />
            <FormField
              formType="input"
              label="Phone"
              name="phone"
              type="text"
              maxLength="13"
              placeholder="00-00000-0000"
            />
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
                  onKeyUp={(e) => handleFetchZip(e, formik)}
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

export default SignUpForm;

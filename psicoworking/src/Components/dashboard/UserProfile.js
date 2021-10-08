import React, { useState, useRef } from "react";
import axios from "axios";
import { FormField } from "../shared/form-components/FormField";
import { state_uf_data } from "../sign_up/sign_up-form/state_uf_data";
import {Formik, Form } from "formik";
import * as Yup from "yup";
import "./UserProfile.css";
import { useHistory } from "react-router-dom";

const UserProfile = (props) => {
  // --- This will handle the autocomplete delimiters in form ---/
  const [phoneDelimiter, setPhoneDelimiter] = useState(false);
  const [user, setUser] = React.useState({...props.user});
  
  React.useEffect(() => {
    setUser(props.user);
    }, [props.user])


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
    phone: Yup.string()
      .min(12, "Phone number is invalid")
      .required("Phone number is required")
      .matches(/^[0-9]{2}-[0-9]{5}-[0-9]{4}$/, "Invalid phone format"),
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

  // --- Handle error response from backend POST --- //
  // uses useRef to scrool up to the field with problems (email, crp, etc...)
  const formRef = useRef();

  // --- Redirects --- //
  // enables history object: allows redirection after POST
  let history = useHistory();

    // ---- Handle form submit ---- //
    const handleSubmitForm = async (values) => {
      // Fetch data from API
      try {
        const response = await axios({
          method: "post",
          url: `http://localhost:8080/users/edit/${values._id}`,
          data: values,
        });
  
        // include display property and set to false
      response.data = { ...response.data, display: false };

      // destructuring the response data from API
      const { success,redirectURL } = response.data;
      console.log(response.data);
      if (success) {
          history.push({
            pathname: redirectURL,
            state: { ...response.data, display: true },
          });
      } else {
        history.push({
          pathname: redirectURL,
          state: { ...response.data, display: true },
        });
      }
  
        // if API call fails, shows an error message and redirects
      } catch (e) {
        history.push({
          pathname: `/user/${values._id}`,
          state: {
            message: "Something went wrong",
            display: true,
          },
        });
      }
    };
  return (     
    <div className="p-3 py-5">
        <div className="d-flex justify-content-between mb-3">
                    <h4>{user.first_name} {user.last_name}</h4>
                    {user.active && <div>Account Status: <span className="badge badge-pill badge-success ml-2">Active</span></div>}
                    {!user.active && <div>Account Status: <span className="badge badge-pill bg-danger ml-2">Inactive</span></div>}
        </div>
        
        <div className="row mt-2">
                <Formik
                innerRef={formRef}
                initialValues={{
                _id: user._id,
                crp_no: user.crp_no,
                phone: user.phone,
                email: user.email,
                dob: user.dob,
                zip: user.zip,
                city: user.city,
                state: user.state, 
                address1: user.address1,
                address2: user.address2,
                cpf_no: user.cpf_no
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmitForm}
            >
            {(formik) => (
                <div className="signup-container">
                <Form>
                    <FormField
                    formType="input"
                    label="CRP (region/number)"
                    name="crp_no"
                    type="text"
                    maxLength="8"
                    placeholder="00/00000"
                    disabled
                    />
                    <FormField
                    formType="input"
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    disabled
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
                    Save Changes
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
        </div>
    </div>
  );
};

export default UserProfile;

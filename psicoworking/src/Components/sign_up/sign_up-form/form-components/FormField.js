import React from "react";
import { ErrorMessage, useField } from "formik";

// Custom Form component (currently, works for input and select)
// Implements form validation through Formik
export const FormField = ({ label, formType, formData, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="mb-3">
      <label htmlFor={field.name}>{label}</label>
      {formType === "input" ? (
        <input
          className={`form-control shadow-none ${
            meta.touched && meta.error && "is-invalid"
          }`}
          {...field}
          {...props}
          autoComplete="off"
        />
      ) : (
        <select
          className={`form-control shadow-none ${
            meta.touched && meta.error && "is-invalid"
          }`}
          {...field}
          {...props}
          autoComplete="off"
        >
          {formData.map((opt, idx) => {
            return <option key={idx}>{opt}</option>;
          })}
        </select>
      )}
      <ErrorMessage
        component="div"
        name={field.name}
        className="error small text-danger "
      />
    </div>
  );
};

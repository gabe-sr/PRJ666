// import React from "react";
// import { ErrorMessage, useField } from "formik";

// export const DropdownField = ({ label, data, ...props }) => {
//   const [field, meta] = useField(props);
//   return (
//     <div className="mb-2 w-25">
//       <label htmlFor={field.name}>{label}</label>
//       <select
//         className={`form-select shadow-none ${
//           meta.touched && meta.error && "is-invalid"
//         }`}
//         {...field}
//         {...props}
//         autoComplete="off"
//       >
//         <option></option>
//         {data.map((opt, idx) => {
//           return <option key={idx}>{opt}</option>;
//         })}
//       </select>
//       <ErrorMessage component="div" name={field.name} className="error" />
//     </div>
//   );
// };

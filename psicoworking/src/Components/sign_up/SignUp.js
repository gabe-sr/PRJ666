import React from "react";
import SignUpModal from "./SignUpModal";

const SignUp = () => {
  return (
    <div className="container-fluid">
      <h3 className="display-6 mb-3 text-secondary">
        Thank you for choosing us!
      </h3>
      <p className="mr-4 ml-2 mb-4 ">
        In order to provide the best experience to Psicoworking clients, our
        registration takes two steps. First, you need to complete our sign up
        form. We will then evaluate all your information. You should receive an
        email within 48 hours with details about your registration approval.{" "}
      </p>
      <SignUpModal />
    </div>
  );
};

export default SignUp;

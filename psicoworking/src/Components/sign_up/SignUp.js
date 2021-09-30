import React, { useState } from "react";
import SignUpModal from "./SignUpModal";
import { Button } from "react-bootstrap";

const SignUp = () => {
  // tracks the state of the modal (open/closed)
  const [modal, setModal] = useState(false);

  // this callback is sent to Child component, so when modal is closed there
  // it calls this function and set the modal status back to closed
  // so the modal is ready to be opened again
  const closeModal = () => {
    setModal(false);
  };

  return (
    <>
      <div className="container-fluid">
        <h3 className="display-6 mb-3 text-secondary">
          Thank you for choosing us!
        </h3>
        <p className="mr-4 ml-2 mb-4 ">
          In order to provide the best experience to Psicoworking clients, our
          registration takes two steps. First, you need to complete our sign up
          form. We will then evaluate all your information. You should receive
          an email within 48 hours with details about your registration
          approval.{" "}
        </p>
        <Button className="btn btn-secondary" onClick={() => setModal(true)}>
          Proceed to Sign Up
        </Button>
        <SignUpModal isOpen={modal} closeModal={closeModal} />
      </div>
    </>
  );
};

export default SignUp;

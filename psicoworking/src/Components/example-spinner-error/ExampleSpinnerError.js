import React, { useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import WithErrorMessage from "../HOC/error-messages/WithErrorMessage";
import WithLoadingSpinner from "../HOC/loading-spinner/WithLoadingSpinner";

const ExampleSpinnerError = (props) => {
  const { setErrorMessage, setLoadingSpinner } = props;
  const isLoaded = useRef(false);

  useEffect(() => {
    if (!isLoaded.current) {
      setLoadingSpinner(false);
      isLoaded.current = true;
    }
  }, [setLoadingSpinner]);

  const handleSpinner = () => {
    setLoadingSpinner(true);
    setTimeout(() => setLoadingSpinner(false), 2500);
  };

  return (
    <div className="m-4">
      <Button className="mx-2" onClick={handleSpinner}>
        Loading Spinner
      </Button>
      <Button
        className="mx-2 btn-success"
        onClick={() =>
          setErrorMessage(
            true,
            "Error fetching bookings. Click on Continue to try again."
          )
        }
      >
        Error message 1
      </Button>
      <Button
        className="mx-2 btn-warning"
        onClick={() => setErrorMessage(true, "Sample error message 2", "/")}
      >
        Error message 2
      </Button>
    </div>
  );
};

export default WithLoadingSpinner(
  WithErrorMessage(ExampleSpinnerError),
  "STILL LOADING..."
);

//export default WithLoadingSpinner(About);

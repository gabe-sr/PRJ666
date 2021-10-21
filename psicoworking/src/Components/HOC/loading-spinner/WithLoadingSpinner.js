import React, { useState } from "react";
import SpinnerLoading from "../../shared/spinner/SpinnerLoading";

const WithLoadingSpinner = (WrappedComponent, loadingMessage) => {
  const HOC = (props) => {
    const [isLoading, setLoading] = useState(false);
    const [message, setMessage] = useState();

    const setLoadingState = (isComponentLoading, message) => {
      setLoading(isComponentLoading);
      if (message) {
        setMessage(message);
      }
    };

    return (
      <>
        {isLoading && (
          <SpinnerLoading message={message ? message : loadingMessage} />
        )}
        <WrappedComponent {...props} setLoadingSpinner={setLoadingState} />
      </>
    );
  };
  return HOC;
};

export default WithLoadingSpinner;

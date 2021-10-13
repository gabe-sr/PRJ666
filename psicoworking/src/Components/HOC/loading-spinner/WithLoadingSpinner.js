import React, { useState } from "react";
import SpinnerLoading from "../../shared/spinner/SpinnerLoading";

const WithLoadingSpinner = (WrappedComponent, loadingMessage) => {
  const HOC = (props) => {
    const [isLoading, setLoading] = useState(true);

    const setLoadingState = (isComponentLoading) => {
      setLoading(isComponentLoading);
    };

    return (
      <>
        {isLoading && <SpinnerLoading message={loadingMessage} />}
        <WrappedComponent {...props} setLoading={setLoadingState} />
      </>
    );
  };
  return HOC;
};

export default WithLoadingSpinner;

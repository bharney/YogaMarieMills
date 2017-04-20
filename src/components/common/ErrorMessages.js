import React, { PropTypes } from 'react';

const ErrorMessages = ({ errorMessage }) => {
  
  function displayError(error) {
    if (errorMessage)
    return error

    return "";
  }

  return (
    <div>
      <p className="text-danger">
        {displayError(errorMessage)}
      </p>
    </div>
  );
};

ErrorMessages.propTypes = {
  errorMessage: PropTypes.string
};

export default ErrorMessages  
import React from 'react';
import PropTypes from 'prop-types';

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
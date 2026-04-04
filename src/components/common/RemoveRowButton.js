import React from 'react';
import PropTypes from 'prop-types';

const RemoveRowButton = ({ name, onClick }) => {
  return (
    <button
      type="button"
      name={name}
      className="btn btn-danger btn-circle pull-right"
      onClick={onClick}>
      <i aria-hidden="true" className="glyphicon glyphicon-minus"></i>
    </button>
  );
};

RemoveRowButton.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default RemoveRowButton;

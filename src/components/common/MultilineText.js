import React from 'react';
import PropTypes from 'prop-types';

const MultilineText = ({ multilineText }) => {
  return (
    <React.Fragment>
      {multilineText.split("\\n").map((lineText, index) => (
        <React.Fragment key={`multiline-${index}`}>
          <span className="dark-color">{lineText}&nbsp;</span>
          {index < multilineText.split("\\n").length - 1 ? <br /> : null}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};

MultilineText.propTypes = {
  multilineText: PropTypes.string.isRequired,

};

export default MultilineText;

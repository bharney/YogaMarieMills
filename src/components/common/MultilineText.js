import React, { PropTypes } from 'react';

const MultilineText = ({multilineText}) => {

  return (
    <div>
      {multilineText.split("\\n").map(lineText => {
        return <p className="dark-color">{lineText}&nbsp;</p>;
      })}
    </div>
  );
};

MultilineText.propTypes = {
  multilineText: PropTypes.string.isRequired,

};

export default MultilineText;

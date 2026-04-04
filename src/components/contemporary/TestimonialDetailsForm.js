import React from 'react';
import PropTypes from 'prop-types';
import TextInput from '../common/TextInput';
import TextAreaInput from '../common/TextAreaInput';
import RemoveRowButton from '../common/RemoveRowButton';

const TestimonialDetailsForm = ({ updateQuoteState, updateNameState, removeRow, testimonial }) => {


  return (
    <div>
      {testimonial.testimonial_details.map((testimonial_details, index) =>
        <div className="mdl-card mdl-shadow--4dp p-20 m-t-1-em tile-masonry bg-color-white">
          <ul className="mdl-list">
            <li>
              <TextAreaInput
                className="p-t-0 p-b-0"
                name={index}
                label="Testimonial"
                placeholder="Testimonial"
                rows="5"
                value={testimonial_details.testimonial}
                onChange={updateQuoteState} />
              <TextInput
                className="p-t-0 p-b-0"
                name={index}
                label="Name"
                placeholder="Name"
                value={testimonial_details.name}
                onChange={updateNameState} />
            </li>
          </ul>
          <RemoveRowButton
            name={index}
            onClick={removeRow} />
        </div>
      )}
    </div>
  );
};

TestimonialDetailsForm.propTypes = {
  testimonial: PropTypes.object.isRequired,
  updateTestimonialState: PropTypes.object.isRequired,
  saving: PropTypes.object.isRequired,
  saveTestimonial: PropTypes.func.isRequired,
  errors: PropTypes.object
};

export default TestimonialDetailsForm;
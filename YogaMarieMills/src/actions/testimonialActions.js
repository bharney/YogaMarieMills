import testimonialApi from '../API/mockTestimonialApi';

export function loadTestimonialSuccess(testimonials) {
    return { type: 'LOAD_TESTIMONIAL_SUCCESS', testimonials};
}

export function createTestimonialSuccess(testimonial) {
  return { type: 'CREATE_TESTIMONIAL_SUCCESS', testimonial };
}

export function updateTestimonialSuccess(testimonial) {
  return { type: 'UPDATE_TESTIMONIAL_SUCCESS', testimonial };
}

export function deleteTestimonialSuccess() {
  return { type: 'DELETE_TESTIMONIAL_SUCCESS' };
}

export function loadTestimonial() {
    return function (dispatch) {
        return testimonialApi.getAllItems().then(testimonials => {
            dispatch(loadTestimonialSuccess(testimonials));
    }).catch(error => {
      throw(error);
    });
  };
}

export function deleteTestimonial(testimonial) {
  return function (dispatch) {
    return testimonialApi.deleteTestimonial(testimonial).then(() => {
      dispatch(deleteTestimonialSuccess());
      return testimonialApi.getAllTestimonials().then(testimonials => {
        dispatch(loadTestimonialSuccess(testimonials));
      });
    }).catch(error => {
      throw (error);
    });
  };
}

export function saveTestimonial(testimonial) {
  return function (dispatch) {
    return testimonialApi.saveTestimonial(testimonial).then(savedTestimonial => {
      testimonial.id ? dispatch(updateTestimonialSuccess(savedTestimonial)) :
        dispatch(createTestimonialSuccess(savedTestimonial));
    }).catch(error => {
      throw (error);
    });
  };
}

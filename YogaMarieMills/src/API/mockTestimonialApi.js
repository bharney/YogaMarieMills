import 'whatwg-fetch'
import { getToken } from '../actions/authTokenActions';

class TestimonialApi {
  static getAllItems() {
    return new Promise((resolve) => {
      fetch('http://localhost:3000/api/testimonials').then(function (response) {
        return response.json();
      }).then(function (testimonials) {
        resolve(Object.assign([], testimonials));
      });
    });
  }

  static saveTestimonial(testimonial) {
    testimonial = Object.assign({}, testimonial);
    return new Promise((resolve) => {
        fetch('http://localhost:3000/api/testimonials', {
          method: 'put',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
          },
          body: JSON.stringify(testimonial)
        }).then(function (response) {
          return response.json();
        }).then(function (testimonial) {
          resolve(testimonial)
        }).catch(function (error) {
          console.log('Request failed', error);
        });
    });
  }

  static deleteTestimonial(testimonialId) {
    return new Promise((resolve) => {
      if (confirm("Are you sure you want to delete this testimonial forever?")) {
        if (testimonialId) {
          fetch('http://localhost:3000/api/testimonials/' + testimonialId, {
            method: 'delete',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + getToken()
            }
          }).then(function () {
            resolve(console.log("testimonial deleted."));
          }).catch(function (error) {
            console.log('Delete failed', error);
          });
        }
      }
    });
  }
}

export default TestimonialApi;

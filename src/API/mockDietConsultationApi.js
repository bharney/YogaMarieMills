import { getToken } from '../actions/authTokenActions';

class DietConsultationApi {
  static getAllItems() {
    return new Promise((resolve) => {
      fetch('http://localhost:3000/api/consultations').then(function (response) {
        return response.json();
      }).then(function (consultations) {
        resolve(Object.assign([], consultations));
      });
    });
  }

  static saveDietConsultation(consultation) {
    consultation = Object.assign({}, consultation);
    return new Promise((resolve) => {
        fetch('http://localhost:3000/api/consultations', {
          method: 'put',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
          },
          body: JSON.stringify(consultation)
        }).then(function (response) {
          return response.json();
        }).then(function (consultation) {
          resolve(consultation)
        }).catch(function (error) {
          console.log('Request failed', error);
        });
    });
  }

  static deleteDietConsultation(consultationId) {
    return new Promise((resolve) => {
      if (confirm("Are you sure you want to delete this consultation forever?")) {
        if (consultationId) {
          fetch('http://localhost:3000/api/consultations/' + consultationId, {
            method: 'delete',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + getToken()
            }
          }).then(function () {
            resolve(console.log("consultation deleted."));
          }).catch(function (error) {
            console.log('Delete failed', error);
          });
        }
      }
    });
  }
}


export default DietConsultationApi;

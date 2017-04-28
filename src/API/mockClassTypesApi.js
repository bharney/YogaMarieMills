import { getToken } from '../actions/authTokenActions';

class ClassTypesApi {
  static getAllClassTypes() {
    return new Promise((resolve) => {
      fetch('http://localhost:3000/api/classTypes').then(function (response) {
        return response.json();
      }).then(function (classTypes) {
        resolve(Object.assign([], classTypes));
      });
    });
  }

  static saveClassType(classType) {
    classType = Object.assign({}, classType);
    return new Promise((resolve) => {
      if (classType.id) {
        fetch('http://localhost:3000/api/classTypes', {
          method: 'put',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
          },
          body: JSON.stringify(classType)
        }).then(function (response) {
          return response.json();
        }).then(function (classType) {
          resolve(classType)
        }).catch(function (error) {
          console.log('Request failed', error);
        });
      } else {
        fetch('http://localhost:3000/api/classTypes', {
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
          },
          body: JSON.stringify(classType)
        }).then(function (response) {
          return response.json();
        }).then(function (classType) {
          resolve(classType)
        }).catch(function (error) {
          console.log('Request failed', error);
        });
      }
    });
  }

  static deleteClassType(classTypeId) {
    return new Promise((resolve) => {
      if (confirm("Are you sure you want to delete this classType forever?")) {
        if (classTypeId) {
          fetch('http://localhost:3000/api/classTypes/' + classTypeId, {
            method: 'delete',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + getToken()
            }
          }).then(function () {
            resolve(console.log("classType deleted."));
          }).catch(function (error) {
            console.log('Delete failed', error);
          });
        }
      }
    });
  }
}

export default ClassTypesApi;

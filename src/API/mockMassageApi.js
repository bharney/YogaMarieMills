import { getToken } from '../actions/authTokenActions';

class MassageApi {
  static getAllItems() {
    return new Promise((resolve) => {
      fetch('/api/massages').then(function (response) {
        return response.json();
      }).then(function (massageTypes) {
        resolve(Object.assign([], massageTypes));
      });
    });
  }

  static saveMassage(massage) {
    massage = Object.assign({}, massage);
    return new Promise((resolve) => {
      if (massage.id) {
        fetch('/api/massages', {
          method: 'put',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
          },
          body: JSON.stringify(massage)
        }).then(function (response) {
          return response.json();
        }).then(function (massage) {
          resolve(massage)
        }).catch(function (error) {
          console.log('Request failed', error);
        });
      } else {
        fetch('/api/massages', {
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
          },
          body: JSON.stringify(massage)
        }).then(function (response) {
          return response.json();
        }).then(function (massage) {
          resolve(massage)
        }).catch(function (error) {
          console.log('Request failed', error);
        });
      }
    });
  }

  static deleteMassage(massageId) {
    return new Promise((resolve) => {
      if (confirm("Are you sure you want to delete this massage forever?")) {
        if (massageId) {
          fetch('/api/massages/' + massageId, {
            method: 'delete',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + getToken()
            }
          }).then(function () {
            resolve(console.log("massage deleted."));
          }).catch(function (error) {
            console.log('Delete failed', error);
          });
        }
      }
    });
  }
}

export default MassageApi;

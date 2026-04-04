import { getToken } from '../actions/authTokenActions';

class EventApi {
  static getAllItems() {
    return new Promise((resolve) => {
      fetch('/api/events').then(function (response) {
        return response.json();
      }).then(function (eventTypes) {

        resolve(Object.assign([], eventTypes));
      });
    });
  }

  static saveEvent(eventType) {
    eventType = Object.assign({}, eventType);
    return new Promise((resolve) => {
      if (eventType.id) {
        fetch('/api/events', {
          method: 'put',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
          },
          body: JSON.stringify(eventType)
        }).then(function (response) {
          return response.json();
        }).then(function (eventType) {
          resolve(eventType)
        }).catch(function (error) {
          console.log('Request failed', error);
        });
      } else {
        fetch('/api/events', {
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
          },
          body: JSON.stringify(eventType)
        }).then(function (response) {
          return response.json();
        }).then(function (eventType) {
          resolve(eventType)
        }).catch(function (error) {
          console.log('Request failed', error);
        });
      }
    });
  }

  static deleteEvent(eventType) {
    return new Promise((resolve) => {
      if (confirm("Are you sure you want to delete this event forever?")) {
        if (eventType.id && eventType.type) {
          fetch('/api/events/', {
            method: 'delete',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify(eventType)
          }).then(function () {
            resolve(console.log("event deleted."));
          }).catch(function (error) {
            console.log('Delete failed', error);
          });
        }
      }
    });
  }
}

export default EventApi;

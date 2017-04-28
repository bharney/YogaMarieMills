import { getToken } from '../actions/authTokenActions';

class ScheduleApi {
  static getAllItems() {
    return new Promise((resolve) => {
      fetch('http://localhost:3000/api/schedules').then(function (response) {
        return response.json();
      }).then(function (schedules) {
        resolve(Object.assign([], schedules));
      });
    });
  }

  static getItem(scheduleId) {
    return new Promise((resolve) => {
      if (scheduleId) {
        fetch('http://localhost:3000/api/schedules/' + scheduleId).then(function (response) {
          return response.json();
        }).then(function (schedules) {
          resolve(Object.assign([], schedules));
        });
      }
    });
  }

  static saveSchedule(schedule) {
    schedule = Object.assign({}, schedule);
    return new Promise((resolve) => {
      if (schedule.id) {
        fetch('http://localhost:3000/api/schedules', {
          method: 'put',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
          },
          body: JSON.stringify(schedule)
        }).then(function (response) {
          return response.json();
        }).then(function (schedule) {
          resolve(schedule)
        }).catch(function (error) {
          console.log('Request failed', error);
        });
      } else {
        fetch('http://localhost:3000/api/schedules', {
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
          },
          body: JSON.stringify(schedule)
        }).then(function (response) {
          return response.json();
        }).then(function (schedule) {
          resolve(schedule)
        }).catch(function (error) {
          console.log('Request failed', error);
        });
      }
    });
  }

  static deleteSchedule(scheduleId) {
    return new Promise((resolve) => {
      if (confirm("Are you sure you want to delete this schedule forever?")) {
        if (scheduleId) {
          fetch('http://localhost:3000/api/schedules/' + scheduleId, {
            method: 'delete',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + getToken()
            }
          }).then(function () {
            resolve(console.log("schedule deleted."));
          }).catch(function (error) {
            console.log('Delete failed', error);
          });
        }
      }
    });
  }
}

export default ScheduleApi;

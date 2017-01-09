import scheduleApi from '../API/mockScheduleApi';

export function loadScheduleSuccess(schedules) {
    return { type: 'LOAD_SCHEDULE_SUCCESS', schedules};
}

export function loadSchedule() {
    return function (dispatch) {
        return scheduleApi.getAllItems().then(schedules => {
            dispatch(loadScheduleSuccess(schedules));
    }).catch(error => {
      throw(error);
    });
  };
}

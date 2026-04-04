import scheduleApi from '../API/mockScheduleApi';

export function loadScheduleSuccess(schedules) {
    return { type: 'LOAD_SCHEDULE_SUCCESS', schedules };
}

export function loadScheduleByIdSuccess(schedule) {
    return { type: 'LOAD_SCHEDULE_BY_ID_SUCCESS', schedule };
}

export function createScheduleSuccess(schedule) {
    return { type: 'CREATE_SCHEDULE_SUCCESS', schedule };
}

export function updateScheduleSuccess(schedule) {
    return { type: 'UPDATE_SCHEDULE_SUCCESS', schedule };
}

export function deleteScheduleSuccess() {
    return { type: 'DELETE_SCHEDULE_SUCCESS' };
}

export function loadSchedule() {
    return function (dispatch) {
        return scheduleApi.getAllItems().then(schedules => {
            dispatch(loadScheduleSuccess(schedules));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadScheduleById(scheduleId) {
    return function (dispatch) {
        return scheduleApi.getItem(scheduleId).then(schedule => {
            dispatch(loadScheduleByIdSuccess(schedule));
        }).catch(error => {
            throw (error);
        });
    };
}

export function deleteSchedule(schedule) {
    return function (dispatch) {
        return scheduleApi.deleteSchedule(schedule).then(() => {
            return scheduleApi.getAllItems().then((schedules) => {
                dispatch(loadScheduleSuccess(schedules));
            });
        }).catch(error => {
            throw (error);
        });
    };
}

export function saveSchedule(schedule) {
    return function (dispatch) {
        return scheduleApi.saveSchedule(schedule).then(() => {
            return scheduleApi.getAllItems().then((schedules) => {
                dispatch(loadScheduleSuccess(schedules));
            });
        }).catch(error => {
            throw (error);
        });
    };
}

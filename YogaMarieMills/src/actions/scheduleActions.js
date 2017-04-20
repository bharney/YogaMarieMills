import scheduleApi from '../API/mockScheduleApi';

export function loadScheduleSuccess(schedules) {
    return { type: 'LOAD_SCHEDULE_SUCCESS', schedules };
}

export function loadScheduleByIdSuccess(scheduleId) {
    return { type: 'LOAD_SCHEDULE_BY_ID_SUCCESS', scheduleId };
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
        return scheduleApi.loadScheduleById(scheduleId).then(scheduleId => {
            dispatch(loadScheduleByIdSuccess(scheduleId));
        }).catch(error => {
            throw (error);
        });
    };
}

export function deleteSchedule(schedule) {
    return function (dispatch) {
        return scheduleApi.deleteSchedule(schedule).then(() => {
            dispatch(deleteScheduleSuccess());
            return scheduleApi.getAllSchedule().then(schedule => {
                dispatch(loadScheduleSuccess(schedule));
            });
        }).catch(error => {
            throw (error);
        });
    };
}

export function saveSchedule(schedule) {
    return function (dispatch) {
        return scheduleApi.saveSchedule(schedule).then(savedSchedule => {
            schedule.id ? dispatch(updateScheduleSuccess(savedSchedule)) :
                dispatch(createScheduleSuccess(savedSchedule));
        }).catch(error => {
            throw (error);
        });
    };
}

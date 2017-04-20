import eventApi from '../API/mockEventApi';

export function loadEventSuccess(eventTypes) {
    return { type: 'LOAD_EVENT_SUCCESS', eventTypes};
}

export function createEventSuccess(eventType) {
  return { type: 'CREATE_EVENT_SUCCESS', eventType };
}

export function updateEventSuccess(eventType) {
  return { type: 'UPDATE_EVENT_SUCCESS', eventType };
}

export function deleteEventSuccess() {
  return { type: 'DELETE_EVENT_SUCCESS' };
}

export function loadEvent() {
    return function (dispatch) {
        return eventApi.getAllItems().then(eventType => {
            dispatch(loadEventSuccess(eventType));
    }).catch(error => {
      throw(error);
    });
  };
}

export function deleteEvent(eventType) {
  return function (dispatch) {
    return eventApi.deleteEvent(eventType).then(() => {
      dispatch(deleteEventSuccess());
      return eventApi.getAllEvent().then(eventTypes => {
        dispatch(loadEventSuccess(eventTypes));
      });
    }).catch(error => {
      throw (error);
    });
  };
}

export function saveEvent(eventType) {
  return function (dispatch) {
    return eventApi.saveEvent(eventType).then(savedEvent => {
      eventType.id ? dispatch(updateEventSuccess(savedEvent)) :
        dispatch(createEventSuccess(savedEvent));
    }).catch(error => {
      throw (error);
    });
  };
}
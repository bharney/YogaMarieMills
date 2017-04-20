import dietConsultationApi from '../API/mockDietConsultationApi';

export function loadDietConsultationSuccess(dietConsultations) {
    return { type: 'LOAD_DIET_CONSULTATION_SUCCESS', dietConsultations};
}

export function createDietConsultationSuccess(dietConsultation) {
  return { type: 'CREATE_DIET_CONSULTATION_SUCCESS', dietConsultation };
}

export function updateDietConsultationSuccess(dietConsultation) {
  return { type: 'UPDATE_DIET_CONSULTATION_SUCCESS', dietConsultation };
}

export function deleteDietConsultationSuccess() {
  return { type: 'DELETE_DIET_CONSULTATION_SUCCESS' };
}

export function loadDietConsultation() {
    return function (dispatch) {
        return dietConsultationApi.getAllItems().then(dietConsultations => {
            dispatch(loadDietConsultationSuccess(dietConsultations));
    }).catch(error => {
      throw(error);
    });
  };
}

export function deleteDietConsultation(dietConsultation) {
  return function (dispatch) {
    return dietConsultationApi.deleteDietConsultation(dietConsultation).then(() => {
      dispatch(deleteDietConsultationSuccess());
      return dietConsultationApi.getAllDietConsultations().then(dietConsultations => {
        dispatch(loadDietConsultationSuccess(dietConsultations));
      });
    }).catch(error => {
      throw (error);
    });
  };
}


export function saveDietConsultation(dietConsultation) {
  return function (dispatch) {
    return dietConsultationApi.saveDietConsultation(dietConsultation).then(savedDietConsultation => {
      dietConsultation.id ? dispatch(updateDietConsultationSuccess(savedDietConsultation)) :
        dispatch(createDietConsultationSuccess(savedDietConsultation));
    }).catch(error => {
      throw (error);
    });
  };
}

import massageApi from '../API/mockMassageApi';

export function loadMassageSuccess(massageTypes) {
    return { type: 'LOAD_MASSAGE_SUCCESS', massageTypes};
}

export function createMassageSuccess(massage) {
  return { type: 'CREATE_MASSAGE_SUCCESS', massage };
}

export function updateMassageSuccess(massage) {
  return { type: 'UPDATE_MASSAGE_SUCCESS', massage };
}

export function deleteMassageSuccess() {
  return { type: 'DELETE_MASSAGE_SUCCESS' };
}

export function loadMassage() {
    return function (dispatch) {
        return massageApi.getAllItems().then(massageTypes => {
            dispatch(loadMassageSuccess(massageTypes));
    }).catch(error => {
      throw(error);
    });
  };
}

export function deleteMassage(massage) {
  return function (dispatch) {
    return massageApi.deleteMassage(massage).then(() => {
      dispatch(deleteMassageSuccess());
      return massageApi.getAllMassages().then(massages => {
        dispatch(loadMassageSuccess(massages));
      });
    }).catch(error => {
      throw (error);
    });
  };
}


export function saveMassage(massage) {
  return function (dispatch) {
    return massageApi.saveMassage(massage).then(savedMassage => {
      massage.id ? dispatch(updateMassageSuccess(savedMassage)) :
        dispatch(createMassageSuccess(savedMassage));
    }).catch(error => {
      throw (error);
    });
  };
}

import classTypesApi from '../API/mockClassTypesApi';

export function loadClassTypesSuccess(classTypes) {
  return { type: 'LOAD_CLASS_TYPES_SUCCESS', classTypes};
}

export function createClassTypesSuccess(classType) {
  return { type: 'CREATE_CLASS_TYPES_SUCCESS', classType };
}

export function updateClassTypesSuccess(classType) {
  return { type: 'UPDATE_CLASS_TYPES_SUCCESS', classType };
}

export function deleteClassTypesSuccess() {
  return { type: 'DELETE_CLASS_TYPES_SUCCESS' };
}

export function loadClassTypes() {
    return function (dispatch) {
      return classTypesApi.getAllClassTypes().then(classTypes => {
        dispatch(loadClassTypesSuccess(classTypes));
    }).catch(error => {
      throw(error);
    });
  };
}

export function deleteClassType(classType) {
  return function (dispatch) {
    return classTypesApi.deleteClassType(classType).then(() => {
      dispatch(deleteClassTypesSuccess());
      return classTypesApi.getAllClassTypes().then(classTypes => {
        dispatch(loadClassTypesSuccess(classTypes));
      });
    }).catch(error => {
      throw (error);
    });
  };
}

export function saveClassType(classType) {
  return function (dispatch) {
    return classTypesApi.saveClassType(classType).then(savedClassType => {
      classType.id ? dispatch(updateClassTypesSuccess(savedClassType)) :
        dispatch(createClassTypesSuccess(savedClassType));
    }).catch(error => {
      throw (error);
    });
  };
}

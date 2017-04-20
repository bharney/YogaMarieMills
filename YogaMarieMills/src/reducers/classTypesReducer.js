import initialState from './initialState';

export default function classTypesReducer(state = initialState.classTypes, action) {
  switch (action.type) {
    case 'LOAD_CLASS_TYPES_SUCCESS':
      return action.classTypes;

    case 'CREATE_CLASS_TYPES_SUCCESS':
      return [
        ...state,
        Object.assign({}, action.classType)
      ];

    case 'UPDATE_CLASS_TYPES_SUCCESS':
      return [
        ...state.filter(classType => classType.id !== action.classType.id),
        Object.assign({}, action.classType)
      ];

    case 'DELETE_CLASS_TYPES_SUCCESS':
      return action.classTypes;

    default:
      return state;
  }
}

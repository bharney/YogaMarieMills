<<<<<<< HEAD
import initialState from './initialState';

export default function courseReducer(state = initialState.courses, action) {
  switch (action.type) {
    case 'LOAD_COURSES_SUCCESS':
      return action.courses;

    case 'CREATE_COURSE_SUCCESS':
      return [
        ...state,
        Object.assign({}, action.course)
      ];

    case 'UPDATE_COURSE_SUCCESS':
      return [
        ...state.filter(course => course.id !== action.course.id),
        Object.assign({}, action.course)
      ];

    default:
      return state;
  }
}
=======
import initialState from './initialState';

export default function courseReducer(state = initialState.courses, action) {
  switch (action.type) {
    case 'LOAD_COURSES_SUCCESS':
      return action.courses;

    case 'CREATE_COURSE_SUCCESS':
      return [
        ...state,
        Object.assign({}, action.course)
      ];

    case 'UPDATE_COURSE_SUCCESS':
      return [
        ...state.filter(course => course.id !== action.course.id),
        Object.assign({}, action.course)
      ];

    default:
      return state;
  }
}
>>>>>>> ee298d412f7c57384fc49ab52017ec591ac91596

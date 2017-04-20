<<<<<<< HEAD
import initialState from './initialState';

export default function authorReducer(state = initialState.authors, action) {
  switch (action.type) {
    case 'LOAD_AUTHORS_SUCCESS':
      return action.authors;

    default:
      return state;
  }
}
=======
import initialState from './initialState';

export default function authorReducer(state = initialState.authors, action) {
  switch (action.type) {
    case 'LOAD_AUTHORS_SUCCESS':
      return action.authors;

    default:
      return state;
  }
}
>>>>>>> ee298d412f7c57384fc49ab52017ec591ac91596

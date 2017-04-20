import initialState from './initialState';

export default function navbarReducer(state = initialState.navbar_items, action) {
    switch (action.type) {
        case 'LOAD_NAVBAR_SUCCESS':
            return action.navbar_items;

        default:
            return state;
    }
}

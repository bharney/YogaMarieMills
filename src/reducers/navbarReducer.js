<<<<<<< HEAD
﻿import initialState from './initialState';

export default function navbarReducer(state = initialState.navbar_items, action) {
    switch (action.type) {
        case 'LOAD_NAVBAR_SUCCESS':
            return action.navbar_items;

        default:
            return state;
    }
}
=======
﻿import initialState from './initialState';

export default function navbarReducer(state = initialState.navbar_items, action) {
    switch (action.type) {
        case 'LOAD_NAVBAR_SUCCESS':
            return action.navbar_items;

        default:
            return state;
    }
}
>>>>>>> ee298d412f7c57384fc49ab52017ec591ac91596

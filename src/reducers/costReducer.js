import initialState from './initialState';

export default function costReducer(state = initialState.costs, action) {
    switch (action.type) {
        case 'LOAD_COST_SUCCESS':
            return action.costs;

        default:
            return state;
    }
}

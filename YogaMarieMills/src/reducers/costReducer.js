import initialState from './initialState';

export default function costReducer(state = initialState.costs, action) {
    switch (action.type) {
        case 'LOAD_COST_SUCCESS':
            return action.costs;

            case 'CREATE_COST_SUCCESS':
            return [
                ...state,
                Object.assign({}, action.cost)
            ];

        case 'UPDATE_COST_SUCCESS':
            return [
                ...state.filter(cost => cost.id !== action.cost.id),
                Object.assign({}, action.cost)
            ];

        case 'DELETE_COST_SUCCESS':
            return action.costs;

        default:
            return state;
    }
}

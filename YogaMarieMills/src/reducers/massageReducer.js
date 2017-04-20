import initialState from './initialState';

export default function MassageReducer(state = initialState.massageTypes, action) {
    switch (action.type) {
        case 'LOAD_MASSAGE_SUCCESS':
            return action.massageTypes;

        case 'CREATE_MASSAGE_SUCCESS':
            return [
                ...state,
                Object.assign({}, action.massage)
            ];

        case 'UPDATE_MASSAGE_SUCCESS':
            return [
                ...state.filter(massage => massage.id !== action.massage.id),
                Object.assign({}, action.massage)
            ];

        case 'DELETE_MASSAGE_SUCCESS':
            return action.massages;

        default:
            return state;
    }
}

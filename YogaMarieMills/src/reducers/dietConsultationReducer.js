import initialState from './initialState';

export default function dietConsultationReducer(state = initialState.dietConsultations, action) {
    switch (action.type) {
        case 'LOAD_DIET_CONSULTATION_SUCCESS':
            return action.dietConsultations;

        case 'CREATE_DIET_CONSULTATION_SUCCESS':
            return [
                ...state,
                Object.assign({}, action.dietConsultation)
            ];

        case 'UPDATE_DIET_CONSULTATION_SUCCESS':
            return [
                ...state.filter(dietConsultation => dietConsultation.id !== action.dietConsultation.id),
                Object.assign({}, action.dietConsultation)
            ];

        case 'DELETE_DIET_CONSULTATION_SUCCESS':
            return action.dietConsultations;

        default:
            return state;
    }
}

import initialState from './initialState';

export default function EventReducer(state = initialState.eventTypes, action) {
    switch (action.type) {
        case 'LOAD_EVENT_SUCCESS':
            return action.eventTypes;

        case 'CREATE_EVENT_SUCCESS':
            return [
                ...state,
                Object.assign({}, action.eventType)
            ];

        case 'UPDATE_EVENT_SUCCESS':
            return [
                ...state.filter(eventType => eventType.id !== action.eventType.id),
                Object.assign({}, action.eventType)
            ];

        case 'DELETE_EVENT_SUCCESS':
            return action.eventTypes;

        default:
            return state;
    }
}

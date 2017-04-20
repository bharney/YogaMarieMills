import initialState from './initialState';

export default function scheduleReducer(state = initialState.schedules, action) {
    switch (action.type) {
        case 'LOAD_SCHEDULE_SUCCESS':
            return action.schedules;

        case 'LOAD_SCHEDULE_BY_ID_SUCCESS':
            return action.schedule;
            
        case 'CREATE_SCHEDULE_SUCCESS':
            return [
                ...state,
                Object.assign({}, action.schedule)
            ];

        case 'UPDATE_SCHEDULE_SUCCESS':
            return [
                ...state.filter(schedule => schedule.id !== action.schedule.id),
                Object.assign({}, action.schedule)
            ];

        case 'DELETE_SCHEDULE_SUCCESS':
            return action.schedule;

        default:
            return state;
    }
}

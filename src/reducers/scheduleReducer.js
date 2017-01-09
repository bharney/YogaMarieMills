import initialState from './initialState';

export default function scheduleReducer(state = initialState.schedules, action) {
    switch (action.type) {
        case 'LOAD_SCHEDULE_SUCCESS':
            return action.schedules;

        default:
            return state;
    }
}

import initialState from './initialState';

export default function authTokenReducer(state = initialState.authToken, action) {
    switch (action.type) {
        
        case 'IS_AUTHENTICATED':
            return {
                message: action.message,
                authToken: action.authToken,
            }

        case 'NOT_AUTHENTICATED':
            return {
                message: action.error.message,
                authToken: null,
            }

        default:
            return state;
    }
}
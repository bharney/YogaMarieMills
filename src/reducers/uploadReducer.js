import initialState from './initialState';

export default function uploadReducer(state = initialState.upload, action) {
    switch (action.type) {
        case 'UPLOAD_FILE_SUCCESS':
            return [
                ...state,
                Object.assign({}, action.upload)
            ];
        default:
            return state;
    }
}
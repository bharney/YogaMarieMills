import initialState from './initialState';

export default function blogReducer(state = initialState.blogs, action) {
    switch (action.type) {
        case 'LOAD_BLOG_SUCCESS':
            return action.blogs;

        default:
            return state;
    }
}

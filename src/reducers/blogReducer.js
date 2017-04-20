<<<<<<< HEAD
﻿import initialState from './initialState';

export default function blogReducer(state = initialState.blogs, action) {
    switch (action.type) {
        case 'LOAD_BLOG_SUCCESS':
            return action.blogs;

        case 'CREATE_BLOG_SUCCESS':
            return [
                ...state,
                Object.assign({}, action.blog)
            ];

        case 'UPDATE_BLOG_SUCCESS':
            return [
                ...state.filter(blog => blog.id !== action.blog.id),
                Object.assign({}, action.blog)
            ];

        case 'DELETE_BLOG_SUCCESS':
            return action.blogs;

        default:
            return state;
    }
}
=======
﻿import initialState from './initialState';

export default function blogReducer(state = initialState.blogs, action) {
    switch (action.type) {
        case 'LOAD_BLOG_SUCCESS':
            return action.blogs;

        default:
            return state;
    }
}
>>>>>>> ee298d412f7c57384fc49ab52017ec591ac91596

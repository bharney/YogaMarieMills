import initialState from './initialState';

export default function testimonialReducer(state = initialState.testimonials, action) {
    switch (action.type) {
        case 'LOAD_TESTIMONIAL_SUCCESS':
            return action.testimonials;

        case 'CREATE_TESTIMONIAL_SUCCESS':
            return [
                ...state,
                Object.assign({}, action.testimonial)
            ];

        case 'UPDATE_TESTIMONIAL_SUCCESS':
            return [
                ...state.filter(testimonial => testimonial.id !== action.testimonial.id),
                Object.assign({}, action.testimonial)
            ];

        case 'DELETE_TESTIMONIAL_SUCCESS':
            return action.testimonials;

        default:
            return state;
    }
}

<<<<<<< HEAD
import {combineReducers} from 'redux';
import courses from './courseReducer';
import authors from './authorReducer';
import navbar_items from './navbarReducer';
import blogs from './blogReducer';
import schedules from './scheduleReducer';
import costs from './costReducer';
import classTypes from './classTypesReducer';
import dietConsultations from './dietConsultationReducer';
import massageTypes from './massageReducer';
import eventTypes from './eventReducer';
import testimonials from './testimonialReducer';
import upload from './uploadReducer';
import authToken from './authTokenReducer';

const rootReducer = combineReducers({
  courses,
  authors,
  navbar_items,
  blogs,
  schedules,
  costs,
  classTypes,
  dietConsultations,
  massageTypes,
  testimonials,
  eventTypes,
  upload,
  authToken
});

export default rootReducer;
=======
import {combineReducers} from 'redux';
import courses from './courseReducer';
import authors from './authorReducer';
import navbar_items from './navbarReducer';
import blogs from './blogReducer'

const rootReducer = combineReducers({
  courses,
  authors,
  navbar_items,
  blogs
});

export default rootReducer;
>>>>>>> ee298d412f7c57384fc49ab52017ec591ac91596

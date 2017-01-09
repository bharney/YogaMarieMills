import {combineReducers} from 'redux';
import courses from './courseReducer';
import authors from './authorReducer';
import navbar_items from './navbarReducer';
import blogs from './blogReducer';
import schedules from './scheduleReducer'
import costs from './costReducer'

const rootReducer = combineReducers({
  courses,
  authors,
  navbar_items,
  blogs,
  schedules,
  costs
});

export default rootReducer;

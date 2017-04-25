/*eslint-disable import/default */
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import { Router, browserHistory } from 'react-router';
import getRoutes from './routes';
import {loadCourses} from './actions/courseActions';
import {loadAuthors} from './actions/authorActions';
import {loadNavbar} from './actions/navbarActions';
import {loadBlog} from './actions/blogActions';
import {loadSchedule} from './actions/scheduleActions';
import {loadCost} from './actions/costActions';
import {loadClassTypes} from './actions/classTypesActions';
import {loadDietConsultation} from './actions/dietConsultationActions';
import {loadMassage} from './actions/massageActions';
import {loadEvent} from './actions/eventActions';
import {loadTestimonial} from './actions/testimonialActions';
import {authenticate} from './actions/authTokenActions';
import MuiThemeProvider from '../node_modules/material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'draft-js-inline-toolbar-plugin/lib/plugin.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';
import 'material-design-lite/material.js';
import 'material-design-lite/material.css';
import './styles/styles.scss';
        
injectTapEventPlugin();

const store = configureStore();
store.dispatch(loadCourses());
store.dispatch(loadAuthors());
store.dispatch(loadNavbar());
store.dispatch(loadBlog());
store.dispatch(loadSchedule());
store.dispatch(loadCost());
store.dispatch(loadClassTypes());
store.dispatch(loadDietConsultation());
store.dispatch(loadMassage());
store.dispatch(loadTestimonial());
store.dispatch(loadEvent());
store.dispatch(loadCourses());
store.dispatch(authenticate());

let onUpdate = () => { window.scrollTo(0, 0); };

render(
    <MuiThemeProvider>
        <Provider store={store}>
            <Router history={browserHistory} onUpdate={onUpdate} >
                {getRoutes(store)}
            </Router>
        </Provider>
   </MuiThemeProvider>,
  document.getElementById('app')

);

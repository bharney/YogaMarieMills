/*eslint-disable import/default */
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import { Router, browserHistory } from 'react-router';
import routes from './routes';
import {loadCourses} from './actions/courseActions';
import {loadAuthors} from './actions/authorActions';
import {loadNavbar} from './actions/navbarActions';
import {loadBlog} from './actions/blogActions';
import {loadSchedule} from './actions/scheduleActions';
import {loadCost} from './actions/costActions';
import MuiThemeProvider from '../node_modules/material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/material-design-lite/material.js';
import '../node_modules/material-design-lite/material.css';
import './styles/styles.scss';

injectTapEventPlugin();

const store = configureStore();
store.dispatch(loadCourses());
store.dispatch(loadAuthors());
store.dispatch(loadNavbar());
store.dispatch(loadBlog());
store.dispatch(loadSchedule());
store.dispatch(loadCost());
store.dispatch(loadCourses());

render(
    <MuiThemeProvider>
        <Provider store={store}>
            <Router history={browserHistory} routes={routes} />
        </Provider>
   </MuiThemeProvider>,
  document.getElementById('app')

);

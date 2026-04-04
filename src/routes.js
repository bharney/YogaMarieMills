import React from 'react';
import { Route, IndexRoute, browserHistory } from 'react-router';
import App from './components/App';
import HomePage from './components/home/HomePage';
import CoursesPage from './components/course/CoursesPage';
import ManageCoursePage from './components/course/ManageCoursePage';
import BlogPage from './components/blog/BlogPage';
import BlogsPage from './components/blog/BlogsPage';
import ManageBlogPage from './components/blog/ManageBlogPage';
import AboutPage from './components/about/AboutPage';
import YogaThurlesPage from './components/yogathurles/YogaThurlesPage';
import ManageSchedulePage from './components/yogathurles/ManageSchedulePage';
import WhatToBringPage from './components/yogathurles/WhatToBringPage';
import ClassTypesPage from './components/yogathurles/ClassTypesPage';
import ClassTypePage from './components/yogathurles/ClassTypePage';
import ManageClassTypePage from './components/yogathurles/ManageClassTypePage';
import ManageCostPage from './components/cost/ManageCostPage';
import CostsPage from './components/cost/CostsPage';
import DietConsultationPage from './components/contemporary/DietConsultationPage';
import ManageDietConsultationPage from './components/contemporary/ManageDietConsultationPage';
import MassagePage from './components/contemporary/MassagePage';
import MassagesPage from './components/contemporary/MassagesPage';
import ManageMassagePage from './components/contemporary/ManageMassagePage';
import ManageEventPage from './components/events/ManageEventPage';
import EventPage from './components/events/EventPage';
import TestimonialPage from './components/contemporary/TestimonialPage';
import ManageTestimonialPage from './components/contemporary/ManageTestimonialPage';
import ManageLoginPage from './components/login/ManageLoginPage';
import { authenticate } from './actions/authTokenActions';

export const getRoutes = (store) => {
  const authRequired = (nextState, replace, callback) => {
    store.dispatch(authenticate())
      .then(() => {
        const state = store.getState();
        const authState = state.authToken || {};
        if (!authState.authToken) {
          replace('/Login');
        }
        callback();
      })
      .catch(() => {
        replace('/Login');
        callback();
      });
  };
  return (
    <Route path="/" history={browserHistory} component={App}>
      <IndexRoute component={HomePage} />
      <Route path="Login" component={ManageLoginPage} />
      <Route path="YogaThurles/Schedule" component={YogaThurlesPage} />
      <Route path="Schedule/:id" component={ManageSchedulePage} onEnter={authRequired} />
      <Route path="Schedule" component={ManageSchedulePage} onEnter={authRequired} />
      <Route path="Cost/:id" component={ManageCostPage} onEnter={authRequired} />
      <Route path="Cost" component={ManageCostPage} onEnter={authRequired} />
      <Route path="YogaThurles/Costs" component={CostsPage} />
      <Route path="YogaThurles/WhatToBring" component={WhatToBringPage} />
      <Route path="YogaThurles/ClassType/:id" component={ClassTypePage} />
      <Route path="ClassType/:id" component={ManageClassTypePage} onEnter={authRequired} />
      <Route path="ClassType" component={ManageClassTypePage} onEnter={authRequired} />
      <Route path="YogaThurles/ClassTypes" component={ClassTypesPage} />
      <Route path="Massage" component={ManageMassagePage} onEnter={authRequired} />
      <Route path="Massage/:type/:id" component={ManageMassagePage} onEnter={authRequired} />
      <Route path="Massage/:type" component={ManageMassagePage} onEnter={authRequired} />
      <Route path="Ayurveda/Massage" component={MassagesPage} />
      <Route path="Ayurveda/Massage/:id" component={MassagePage} />
      <Route path="Ayurveda/DietConsultation" component={DietConsultationPage} />
      <Route path="DietConsultation" component={ManageDietConsultationPage} onEnter={authRequired} />
      <Route path="Ayurveda/Testimonials" component={TestimonialPage} />
      <Route path="Testimonials" component={ManageTestimonialPage} onEnter={authRequired} />
      <Route path="Admin/Events/:id" component={ManageEventPage} onEnter={authRequired} />
      <Route path="Admin/Events" component={ManageEventPage} onEnter={authRequired} />
      <Route path="Events" component={EventPage} />
      <Route path="Events/:id" component={EventPage} />
      <Route path="events" component={EventPage} />
      <Route path="events/:id" component={EventPage} />
      <Route path="About" component={AboutPage} />
      <Route path="Blogs" component={BlogsPage} />
      <Route path="Blog/:id" component={BlogPage} />
      <Route path="Admin/Blog/:id" component={ManageBlogPage} />
      <Route path="Admin/Blog" component={ManageBlogPage} />
      <Route path="Admin/blog/:id" component={ManageBlogPage} />
      <Route path="Admin/blog" component={ManageBlogPage} />
      <Route path="course" component={ManageCoursePage} onEnter={authRequired} />
      <Route path="course/:id" component={ManageCoursePage} onEnter={authRequired} />
      <Route path="courses" component={CoursesPage} />
    </Route>
  );
}

export default getRoutes;

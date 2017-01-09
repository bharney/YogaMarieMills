import React from 'react';
import { Route, IndexRoute, browserHistory } from 'react-router';
import App from './components/App';
import HomePage from './components/home/HomePage';
import CoursesPage from './components/course/CoursesPage';
import BlogPage from './components/blog/BlogPage';
import Blog from './components/blog/Blog';
import AboutPage from './components/about/AboutPage';
import YogaThurlesPage from './components/yogathurles/YogaThurlesPage';
import WhatToBringPage from './components/yogathurles/WhatToBringPage';
import ClassesPage from './components/yogathurles/ClassesPage';
import CostPage from './components/cost/CostPage';
import ContemporaryPage from './components/contemporary/ContemporaryPage';
import ManageCoursePage from './components/course/ManageCoursePage';

export default (
    <Route path="/" history={browserHistory} component={App}>
        <IndexRoute component={HomePage} />
        <Route path="YogaThurles/Schedule" component={YogaThurlesPage} />
        <Route path="YogaThurles/Cost" component={CostPage} />
        <Route path="YogaThurles/WhatToBring" component={WhatToBringPage} />
        <Route path="YogaThurles/Classes" component={ClassesPage} />
        <Route path="Ayurveda" component={ContemporaryPage} />
        <Route path="About" component={AboutPage} />
        <Route path="Blog" component={BlogPage} />
        <Route path="Blog/:id" component={BlogPage} />
        <Route path="course" component={ManageCoursePage} />
        <Route path="course/:id" component={ManageCoursePage} />
        <Route path="courses" component={CoursesPage} />
    </Route>
);

<<<<<<< HEAD
import React, {PropTypes} from 'react';
import {Link} from 'react-router';


const CourseListRow = ({course}) => {
    return (
        <tr>
          <td><a href={course.watchHref} target="_blank">Watch</a></td>
          <td><Link to={'/course/' + course.id}>{course.title}</Link></td>
          <td>{course.authorId}</td>
          <td>{course.category}</td>
          <td>{course.length}</td>
        </tr>
    );
};

CourseListRow.propTypes = {
  course: PropTypes.array.isRequired
}

export default CourseListRow;
=======
import React, {PropTypes} from 'react';
import {Link} from 'react-router';


const CourseListRow = ({course}) => {
    return (
        <tr>
          <td><a href={course.watchHref} target="_blank">Watch</a></td>
          <td><Link to={'/course/' + course.id}>{course.title}</Link></td>
          <td>{course.authorId}</td>
          <td>{course.category}</td>
          <td>{course.length}</td>
        </tr>
    );
};

CourseListRow.propTypes = {
  course: PropTypes.array.isRequired
}

export default CourseListRow;
>>>>>>> ee298d412f7c57384fc49ab52017ec591ac91596

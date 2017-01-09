import React, { PropTypes } from 'react';
import { Link } from 'react-router';


const SchedulePage = ({schedule}) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>
              <h4><strong>{schedule.session_date}</strong></h4>
            </th>
            <th>
              <h4><strong>{schedule.session_time}</strong></h4>
            </th>
            <th>
              <h4><strong>{schedule.class}</strong></h4>
            </th>
          </tr>
        </thead>
        {schedule.session_details.map(session_details =>
          <tbody>
            <tr className="text-left">
              <td>
              </td>
              <td>
                <h4>{session_details.session_time}</h4>
              </td>
              <td>
                <h4>{session_details.class}</h4>
              </td>
            </tr>
          </tbody>)
        }
      </table>
    </div>
  );
}

SchedulePage.propTypes = {
  schedule: PropTypes.array.isRequired
};

export default SchedulePage;

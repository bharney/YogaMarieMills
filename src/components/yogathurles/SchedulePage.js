import React, { PropTypes } from 'react';


const SchedulePage = ({schedule}) => {
  return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th colSpan="2">
              <h4 className="p-t-0 p-b-0"><strong>{schedule.session_date}</strong></h4>
            </th>
          </tr>
        </thead>
        {schedule.session_details.map(session_details =>
          <tbody>
            <tr>
              <td className="text-left">
                <h4 className="p-t-0 p-b-0">{session_details.session_time}</h4>
              </td>
              <td className="text-right">
                <h4 className="p-t-0 p-b-0">{session_details.class}</h4>
              </td>
            </tr>
          </tbody>)
        }
      </table>
  );
}

SchedulePage.propTypes = {
  schedule: PropTypes.array.isRequired
};

export default SchedulePage;

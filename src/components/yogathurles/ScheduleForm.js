import React from 'react';
import PropTypes from 'prop-types';
import TextInput from '../common/TextInput';
import RemoveRowButton from '../common/RemoveRowButton';

const ScheduleForm = ({ updateClassState, updateScheduleTimeState, removeRow, schedule }) => {

  const vertAlign = {
    verticalAlign: "middle"
  }

  return (
    <form>
      <table className="table table-hover">
        <thead>
          <tr>
            <th colSpan="2">
              {/* <DatePicker
                formatDate={new Intl.DateTimeFormat('en-US', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }).format}
                hintText="Date"
                value={schedule.session_date == '' ? new Date() : new Date(schedule.session_date)} name="session_date"
                onChange={updateDateState} /> */}
            </th>
          </tr>
        </thead>
        {schedule.session_details.map((session_details, index) =>
          <tbody key={`session-row-${index}`}>
            <tr>
              <td style={vertAlign} className="text-center">
                <RemoveRowButton
                  name={String(index)}
                  onClick={removeRow} />
              </td>
              <td>
                <TextInput
                  className="p-t-0 p-b-0"
                  name={String(index)}
                  label="Time"
                  placeholder="Time"
                  value={session_details.session_time}
                  onChange={updateScheduleTimeState} />
              </td>
              <td>
                <TextInput
                  className="p-t-0 p-b-0"
                  name={String(index)}
                  label="Class"
                  placeholder="Class"
                  value={session_details.class}
                  onChange={updateClassState} />
              </td>
            </tr>
          </tbody>)
        }
      </table>
    </form>
  );
};

ScheduleForm.propTypes = {
  schedule: PropTypes.object.isRequired,
  updateClassState: PropTypes.func.isRequired,
  updateScheduleTimeState: PropTypes.func.isRequired,
  removeRow: PropTypes.func.isRequired,
  updateDateState: PropTypes.func,
  saving: PropTypes.bool,
  saveSchedule: PropTypes.func,
  errors: PropTypes.object,
};

export default ScheduleForm;

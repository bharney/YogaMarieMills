import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as scheduleActions from '../../actions/scheduleActions';
import ScheduleForm from './ScheduleForm';
import Admin from '../common/Admin';

class ManageSchedulePage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      schedule: cloneSchedule(props.schedule),
      errors: {},
      saving: false
    };
    this.updateScheduleTimeState = this.updateScheduleTimeState.bind(this);
    this.updateDateState = this.updateDateState.bind(this);
    this.saveSchedule = this.saveSchedule.bind(this);
    this.deleteSchedule = this.deleteSchedule.bind(this);
    this.updateClassState = this.updateClassState.bind(this);
    this.removeRow = this.removeRow.bind(this);
    this.addRow = this.addRow.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.schedule.id != nextProps.schedule.id) {
      this.setState({ schedule: cloneSchedule(nextProps.schedule) });
    }
  }

  updateClassState(event) {
    const field = parseInt(event.target.name, 10);
    const value = event.target.value;

    this.setState((prevState) => {
      const schedule = cloneSchedule(prevState.schedule);
      schedule.session_details[field] = {
        ...schedule.session_details[field],
        class: value
      };
      return { schedule };
    });
  }

  updateScheduleTimeState(event) {
    const field = parseInt(event.target.name, 10);
    const value = event.target.value;

    this.setState((prevState) => {
      const schedule = cloneSchedule(prevState.schedule);
      schedule.session_details[field] = {
        ...schedule.session_details[field],
        session_time: value
      };
      return { schedule };
    });
  }

  updateDateState(event, date) {
    this.setState((prevState) => ({
      schedule: {
        ...cloneSchedule(prevState.schedule),
        session_date: date.toISOString()
      }
    }));
  }

  saveSchedule(event) {
    event.preventDefault();
    this.props.actions.saveSchedule(this.state.schedule).then(() => {
      this.context.router.push('/YogaThurles/Schedule');
    });
  }

  deleteSchedule() {
    this.props.actions.deleteSchedule(this.state.schedule.id).then(() => {
      this.context.router.push('/YogaThurles/Schedule');
    });
  }

  addRow(e) {
    e.preventDefault();
    this.setState((prevState) => {
      const schedule = cloneSchedule(prevState.schedule);
      schedule.session_details = [
        ...schedule.session_details,
        { id: '', session_time: '', class: '' }
      ];
      return { schedule };
    });
  }

  removeRow(event) {
    const field = parseInt(event.currentTarget.name, 10);

    this.setState((prevState) => {
      const schedule = cloneSchedule(prevState.schedule);
      schedule.session_details = schedule.session_details.filter((_, index) => index !== field);
      return { schedule };
    });
  }

  render() {
    const { authorized } = this.props;

    return (
      <div className="mdl-grid dark-color bg-color">
        <div className="ribbon bg-image-landing b-border">
          <div className="container-fluid">
            <div className="row m-b-1-em">
              <div className="col-12 col-sm-offset-1 col-sm-10 m-b-1-em">
                <Admin saveAction={this.saveSchedule} deleteAction={this.deleteSchedule} authorized={authorized} />
                <br />
                <br />
                <div className="col-12 col-sm-offset-2 col-sm-8 col-md-offset-2 col-md-8 col-lg-offset-3 col-lg-6 m-b-1-em">
                  <div className="mdl-card mdl-shadow--4dp p-t-05-em p-l-1-em p-r-1-em p-b-05-em">
                    <ScheduleForm
                      updateClassState={this.updateClassState}
                      updateDateState={this.updateDateState}
                      updateScheduleTimeState={this.updateScheduleTimeState}
                      removeRow={this.removeRow}
                      schedule={this.state.schedule}
                      errors={this.state.errors}
                      saving={this.state.saving}
                    />
                    <Link className="text-right" to="" onClick={this.addRow} >
                      <button type="button" className="btn btn-success btn-circle-lg" title="Add Row"><i className="glyphicon glyphicon-plus"></i></button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ManageSchedulePage.propTypes = {
  schedule: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

ManageSchedulePage.contextTypes = {
  router: PropTypes.object
};

function getScheduleById(schedules, id) {
  const schedule = schedules.session_dates.filter(session_date => session_date.id == id);
  if (schedule.length) {
    return schedule[0];
  }

  return null;
}

function mapStateToProps(state, ownProps) {
  const scheduleId = ownProps.params.id;
  let schedule = { id: '', session_date: new Date(), session_details: [{ id: '', session_time: '', class: '' }] };
  if (scheduleId && state.schedules.id != undefined) {
    schedule = getScheduleById(state.schedules, scheduleId);
  }

  return {
    schedule: schedule,
    authorized: state.authToken
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(scheduleActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedulePage);

function cloneSchedule(schedule) {
  const safeSchedule = schedule || {};
  return {
    ...safeSchedule,
    session_details: Array.isArray(safeSchedule.session_details)
      ? safeSchedule.session_details.map((detail) => ({ ...detail }))
      : []
  };
}




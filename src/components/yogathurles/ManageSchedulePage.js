import React, { PropTypes } from 'react';
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
      schedule: Object.assign({}, props.schedule),
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


  componentWillReceiveProps(nextProps) {
    if (this.props.schedule.id != nextProps.schedule.id) {
      this.setState({ schedule: Object.assign({}, nextProps.schedule) });
    }
  }

  updateClassState(event) {
    const field = event.target.name;
    let schedule = this.state.schedule;
    schedule.session_details[parseInt(field)].class = event.target.value;
    return this.setState({ schedule });
  }

  updateScheduleTimeState(event) {
    const field = event.target.name;
    let schedule = this.state.schedule;
    schedule.session_details[parseInt(field)].session_time = event.target.value;
    return this.setState({ schedule });
  }

  updateDateState(event, date) {
    let schedule = this.state.schedule;
    schedule.session_date = date.toISOString();
    return this.setState({ schedule });
  }

  saveSchedule(event) {
    event.preventDefault();
    let schedule = this.state.schedule;
    this.setState({ schedule });
    this.props.actions.saveSchedule(this.state.schedule);
    this.context.router.push('/YogaThurles/Schedule');
  }

  deleteSchedule() {
    this.props.actions.deleteSchedule(this.state.schedule.id);
    this.props.actions.loadSchedule();
    this.context.router.push('/YogaThurles/Schedule');
  }

  addRow() {
    let schedule = this.state.schedule;
    schedule.session_details.push({ id: '', session_time: '', class: '' })
    this.setState({ schedule });
  }

  removeRow(event) {
    const field = event.currentTarget.name;
    let schedule = this.state.schedule;
    schedule.session_details.splice(parseInt(field), 1)
    this.setState({ schedule });
  }

  render() {
    const {authorized} = this.props;

    return (
      <div className="mdl-grid dark-color bg-color">
        <div className="ribbon bg-image-landing b-border">
          <div className="container-fluid">
            <div className="row m-b-1-em">
              <div className="col-xs-12 col-sm-offset-1 col-sm-10 m-b-1-em">
                <Admin saveAction={this.saveSchedule} deleteAction={this.deleteSchedule} authorized={authorized} />
                <br />
                <br />
                <div className="col-xs-12 col-sm-offset-2 col-sm-8 col-md-offset-2 col-md-8 col-lg-offset-3 col-lg-6 m-b-1-em">
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




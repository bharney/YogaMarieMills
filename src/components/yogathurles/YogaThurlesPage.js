<<<<<<< HEAD
﻿import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as scheduleActions from '../../actions/scheduleActions';
import Schedule from './SchedulePage';
import Admin from '../common/Admin';

class YogaThurlesPage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    ScheduleTable(schedule, index) {
        return <div key={index}>{schedule.name}</div>
    }

    render() {
        const { schedules } = this.props;
        if (!schedules.session_dates)
            schedules.session_dates = [];

        const { authorized } = this.props;
        return (
            <div className="container-fluid p-l-0 p-r-0 p-t-4-em p-b-1-em color-blur">
                <div className="ribbon bg-image-landing b-border">
                    <div className="container-fluid">
                        <div className="row m-b-1-em">
                            <div className="col-xs-12 col-sm-offset-1 col-sm-10 m-b-1-em">
                                <h1 className="text-center color-white">{schedules.header}</h1>
                                <hr width="50%" className="center-block m-t-0" />
                                <h3 className="color-white">Studio: {schedules.venue}</h3>
                                <Admin addAction={"Schedule"} authorized={authorized} />
                            </div>
                            {schedules.session_dates.map(session_dates =>
                                <div className="col-xs-12 col-sm-offset-2 col-sm-8 col-md-offset-2 col-md-8 col-lg-offset-3 col-lg-6 m-b-1-em">
                                    <div className="mdl-card mdl-shadow--4dp p-t-05-em p-l-1-em p-r-1-em p-b-05-em">
                                        <Admin editAction={"Schedule/" + session_dates.id} authorized={authorized} />
                                        <Schedule schedule={session_dates} />
                                    </div>
                                </div>)
                            }
                        </div>

                        <div className="row">
                            <div className="col-sm-offset-1 col-sm-10 col-xs-12 color-white text-center">
                                <h3>If you desire a class at a different time or day, six students will make it viable. If a class time is not listed, you can either <a title="Bespoke Yoga courses" href="http://yogamariemills.com/yoga-thurles/class-types/bespoke-yoga-courses/" target="_blank">build a Bespoke class</a> using the Angel shop Yoga room or a venue you provide.</h3>
                                <br />
                                <h3>Please contact Marie at 086-1778369 or email <a href="mailto:marie@yogamariemills.com">marie@yogamariemills.com</a> Inquiries are welcome. </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

YogaThurlesPage.propTypes = {
    schedules: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        schedules: state.schedules,
        authorized: state.authToken
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(scheduleActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(YogaThurlesPage);
=======
﻿import React, { PropTypes } from 'react';

class YogaThurlesPage extends React.Component {
    render() {
        return (
            <div>
                Yoga Here!
            </div>
        );
    };
}

export default YogaThurlesPage;
>>>>>>> ee298d412f7c57384fc49ab52017ec591ac91596

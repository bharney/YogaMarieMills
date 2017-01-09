import React, { PropTypes } from 'react';
import { Link, IndexLink, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as costActions from '../../actions/costActions';
import Cost from '../cost/CostPage';

class CostPage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    CostTable(cost, index) {
        return <div key={index}>{cost.name}</div>
    }

    render() {
        const {costs} = this.props;

        return (
            <div className="container-fluid light-bg-color">
                <div id="about" div className="mdl-card container m-t-30 mdl-shadow--4dp">
                    <div className="featured clearfix text-center color-black">
                        <div className="row">
                            <div className="col-xs-offset-1 col-xs-10">
                                <h1>Pricing</h1>
                                <hr />
                                <h2>How much does it cost for Yoga classes in Thurles with Marie Mills?</h2>
                                <h3>In my view it is …priceless. Even if you just learn how to breathe better
                                        on a regular basis, like the L’Oreal ad, you are worth it!
                                        <br /><br />
                                    Every class runs for no less than 60 minutes unless stated, ands sometimes
                                        may run over time. Best of all, should you miss a class in the course you paid for,
                                        you can replace it with a class on another day and time of your series, provided there is room.
                                        <br /><br />
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row m-t-30">
                    <div className="col-xs-offset-1 col-xs-10 row-centered">
                        {costs.map(cost =>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-4 col-centered">
                                <div className="mdl-card mdl-shadow--4dp m-l-30 m-r-30 m-t-15 m-b-15 bg-white color-black cost-tile text-center">
                                    <div className="inner">
                                        <div className="top">
                                            <span>{cost.package}</span>
                                        </div>
                                        <div className="row p-t-40">
                                            <div className="col-xs-12">
                                                <h3>{cost.description}</h3>
                                                <h4>{cost.cost}</h4>
                                                <h4>{cost.duration}</h4>
                                            </div>
                                        </div>
                                        <div className="mdl-card__actions mdl-card--border">
                                            <Link to="YogaThurlesSchedule">
                                                <button className="btn bright-bg-color btn-lg color btn-block color-black">Course Details</button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                        }
                    </div>
                </div>
                <div id="about" div className="mdl-card container m-b-30 mdl-shadow--4dp">
                    <div className="featured clearfix text-center color-black">
                        <div className="row">
                            <div className="col-xs-offset-1 col-xs-10">
                                <h2>Additional Info</h2>
                                <hr />
                                <h3>
                                    Deposits of €20 for new students is required. Please leave your name, your phone number and the class you are booking for on the envelop.
                                        All deposits to the Angel Room, Baker Street, Thurles.
                                        <br /><br />
                                    Morning Yoga classes are a drop in basis, at €11 per class. #dependant on group commitment
                                        Please note, due to the size of the room, Marie is offering a unique experience for all students.
                                        <br /><br />
                                    Concessions are available for shift workers.
                                        <br /><br />
                                    contact Marie 086 1778369
                                    </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

CostPage.propTypes = {
    costs: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
}

function mapStateToProps(state, ownProps) {
    return {
        costs: state.costs
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(costActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CostPage);



import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Admin from '../common/Admin';
import * as costActions from '../../actions/costActions';

class CostsPage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const { costs } = this.props;
        const { authorized } = this.props;
        return (
            <div className="mdl-grid dark-color bg-color">
                <div className="container-fluid p-t-3-em p-l-0 p-r-0 color-blur">
                    <div className="ribbon bg-image-landing b-border">
                        <div className="row m-l-0 m-r-0">
                            <div className="col-sm-offset-1 col-sm-10 col-xs-12 row-centered">
                                <h1 className="color-white">Pricing</h1>
                                <Admin addAction="Cost" authorized={authorized} />
                                <hr width="50%" className="center-block m-t-0" />
                                
                                        <h3 className="text-center color-white">
                                        Every class runs for no less than 60 minutes unless stated, ands sometimes
                                        may run over time. Best of all, should you miss a class in the course you paid for,
                                        you can replace it with a class on another day and time of your series, provided there is room.
                            </h3>
                                {costs.map(cost =>
                                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-4 col-centered">
                                        <Admin editAction={cost.type + "/" + cost.id} authorized={authorized} />
                                        <div className="mdl-card mdl-shadow--4dp m-t-05-em m-b-05-em bg-white color-black cost-tile text-center">
                                            <div className="inner">
                                                <div className="top">
                                                    <span>{cost.package}</span>
                                                </div>
                                                <div className="row p-t-1-em">
                                                    <div className="col-xs-12">
                                                        <h3>{cost.description}</h3>
                                                        <h4>{cost.cost}</h4>
                                                        <h4>{cost.duration}</h4>
                                                    </div>
                                                </div>
                                                <div className="mdl-card__actions mdl-card--border">
                                                    <Link to="YogaThurles/ClassTypes">
                                                        <button className="btn bright-bg-color btn-lg color btn-block color-black">Courses</button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                                }
                            </div>
                        </div>
                        
                        <h2 className="text-center color-white">Additional Info</h2>
                        <hr width="50%" className="center-block" />
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-offset-1 col-sm-10 col-xs-12">
                                    <div className="mdl-card container p-1-em m-b-1-em m-t-1-em mdl-shadow--4dp">
                                        <div className="featured clearfix text-center color-black">

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
                    </div>
                </div>
            </div>

        );
    }
}

CostsPage.propTypes = {
    costs: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        costs: state.costs,
        authorized: state.authToken
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(costActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CostsPage);



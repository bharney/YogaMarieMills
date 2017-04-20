import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Admin from '../common/Admin';
import * as massageActions from '../../actions/massageActions';

class MassagePage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const { massageType } = this.props;
        const { authorized } = this.props;
        let displayIcon = function (icon, iconWidth, iconHeight) {
            let requireImg = icon ? require(`../../images/${icon}`) : ""
            const iconImg = {
                backgroundImage: 'url(' + requireImg + ')',
                backgroundSize: `${iconWidth} ${iconHeight}`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }
            return (<div className="icon-circle-sm mdl-pos-rel bg-color-green mdl-shadow--4dp m-t--60" style={iconImg}></div>)
        }
        let offsetColumns = function (massage, massage_details) {
            if (massage_details.title)
                if (massage.massage_details.findIndex(i => i.id == massage_details.id) % 2 == 0) {
                    return (
                        <div className="col-xs-12 col-sm-offset-2 col-sm-4 massage-details">
                            <h4><strong>{massage_details.title}</strong></h4>
                            <p>{massage_details.description}</p>
                        </div>
                    )
                }
                else {
                    return (
                        <div className="col-xs-12 col-sm-offset-1 col-sm-4 massage-details">
                            <h4><strong>{massage_details.title}</strong></h4>
                            <p>{massage_details.description}</p>
                        </div>
                    )
                }
        }

        return (
            <div className="container-fluid p-l-0 p-r-0 color-blur">
                <div className="ribbon bg-image-landing">
                    <div className="container p-t-4-em">
                        <div className="row">
                            <div className="col-xs-12">
                                <h1 className="text-center color-white m-0">{massageType.header}</h1>
                                <h3 className="text-center color-white m-0 m-b-2-em">{massageType.description}
                                    <br />Venue: {massageType.venue}</h3>
                                <Admin addAction={"Massage/" + massageType.type} authorized={authorized} />
                            </div>
                            {massageType.massages.map(massage =>
                                <div className="col-xs-12 m-t-1-em m-b-3-em">
                                    <div>
                                        <Admin editAction={"Massage/" + massageType.type + "/" + massage.id} authorized={authorized} />
                                    </div>
                                    <div className="mdl-card mdl-shadow--4dp p-b-3-em p-1-em allow-overflow">
                                        {displayIcon(massage.icon, massage.iconWidth, massage.iconHeight)}
                                        <h3 className="p-t-1-em text-center"><strong>{massage.title}</strong></h3>
                                        <hr width="50%" className="center-block" />
                                        <h4 className="m-0 text-center"><strong>{massage.session_time}</strong></h4>
                                        <h4 className="m-0 text-center"><strong>{massage.cost}</strong></h4>
                                        <div className="row">
                                            <div className="col-xs-12">
                                                {massage.massage_details.map(massage_details =>
                                                    offsetColumns(massage, massage_details)
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

MassagePage.propTypes = {
    massageTypes: PropTypes.array.isRequired,
    massageType: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
}

function getMassageByType(massageTypes, type) {
    const massageType = massageTypes.filter(massageType => massageType.type == type);
    if (massageType.length) {
        return massageType[0];
    }

    return null;
}

function mapStateToProps(state, ownProps) {
    const massageTypeId = ownProps.params.id;
    let massageType = { type: '', header: '', description: '', venue: '', massages: [{ session_time: '', title: '', details: '', cost: '', massage_details: [{ title: '', description: '' }] }] };
    if (massageTypeId && state.massageTypes.length > 0) {
        massageType = getMassageByType(state.massageTypes, massageTypeId);
    }

    return {
        massageType: massageType,
        authorized: state.authToken
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(massageActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MassagePage);



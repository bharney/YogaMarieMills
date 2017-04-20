import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Admin from '../common/Admin';
import * as dietConsultationActions from '../../actions/dietConsultationActions';
import { Editor, EditorState, convertFromRaw } from 'draft-js';

class DietConsultationPage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {

        const { dietConsultations } = this.props;
        if (!dietConsultations.consultationDetails)
            dietConsultations.consultationDetails = [];

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

        return (
            <div className="mdl-grid dark-color">
                <div className="container-fluid p-t-4-em p-l-0 p-r-0 color-blur">
                    <div className="ribbon bg-image-landing">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-xs-12 col-sm-12 col-md-offset-1 col-md-10 m-b-3-em">
                                    <h1 className="color-white text-center">Aryuvedic Diet Consultation</h1>
                                    <h3 className="color-white text-center">{dietConsultations.short}</h3>
                                    <div className="mdl-card mdl-shadow--4dp p-1-em">
                                        <Admin editAction={"DietConsultation"} authorized={authorized} />
                                        <div id="editor" className="editor">
                                            <p>
                                                <Editor
                                                    editorState={EditorState.createWithContent(
                                                        dietConsultations.description ? convertFromRaw(JSON.parse(dietConsultations.description))
                                                            : convertFromRaw({ blocks: [{ text: '', type: 'unstyled', },], entityMap: { first: { type: 'TOKEN', mutability: 'MUTABLE', }, } }),
                                                        this.decorator,
                                                    )}
                                                    readOnly={true}
                                                    ref="editor"
                                                />
                                            </p>
                                        </div>

                                        <div className="row text-center">
                                            {dietConsultations.consultationDetails.map(consultationDetails =>
                                                <div className="col-xs-12 col-sm-6 col-md-4 m-auto-inline">
                                                    <div className="mdl-card mdl-shadow--8dp bg-color-light-orange p-1-em allow-overflow m-b-35-em">
                                                        {displayIcon(consultationDetails.icon, consultationDetails.iconWidth, consultationDetails.iconHeight)}
                                                        <h3>{consultationDetails.title}<br />
                                                            {consultationDetails.cost}</h3>
                                                        <p>{consultationDetails.session_time}</p>
                                                        <p>{consultationDetails.consultation}</p>
                                                        <p>{consultationDetails.consultation_desc}</p>
                                                    </div>
                                                </div>
                                            )}
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

DietConsultationPage.propTypes = {
    dietConsultations: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        dietConsultations: state.dietConsultations,
        authorized: state.authToken
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(dietConsultationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DietConsultationPage);



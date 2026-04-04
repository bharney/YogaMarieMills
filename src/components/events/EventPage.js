import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Admin from '../common/Admin';
import * as eventActions from '../../actions/eventActions';
import { Editor, EditorState, convertFromRaw } from 'draft-js';

function getEventDescriptionEditorState(description) {
    if (!description) {
        return EditorState.createWithContent(
            convertFromRaw({
                blocks: [{ text: '', type: 'unstyled' }],
                entityMap: {}
            })
        );
    }

    try {
        return EditorState.createWithContent(convertFromRaw(JSON.parse(description)));
    } catch (error) {
        // Seed or legacy rows can contain plain text instead of Draft.js raw JSON.
        return EditorState.createWithContent(
            convertFromRaw({
                blocks: [{ text: description, type: 'unstyled' }],
                entityMap: {}
            })
        );
    }
}

class EventPage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        if (!this.props.eventTypes || this.props.eventTypes.length === 0) {
            this.props.actions.loadEvent();
        }
    }

    render() {
        const { eventType } = this.props;
        const { authorized } = this.props;
        function displayImage(image) {
            let safeImage = '';
            if (image) {
                try {
                    safeImage = require(`../../images/${image}`);
                } catch (error) {
                    safeImage = `/images/${encodeURIComponent(image)}`;
                }
            }
            return ({
                backgroundImage: 'url(' + safeImage + ')',
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "contain"
            })
        }

        return (
            <div className="container-fluid p-l-0 p-r-0 color-blur p-t-4-em full-page-shell">
                <div className="ribbon bg-image-landing b-border">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <h1 className="color-white text-center">{eventType.header}</h1>
                                <hr width="50%" className="center-block m-t-0 m-b-1-em" />
                                <Admin addAction={"Admin/Events"} authorized={authorized} />
                                <div className="col-12 m-b-1-em">
                                    <div className="mdl-card mdl-shadow--4dp">
                                        <Admin editAction={"Admin/Events/" + eventType.type} authorized={authorized} />
                                        <div className="mdl-card__media image-text-container" style={displayImage(eventType.image)}>
                                            <img src={"../" + eventType.image} className="img-responsive hdn" />
                                            <div className="text-left align-bottom m-l-20 m-b-20">
                                                <header className="color-white">
                                                    <h4 className="m-t-0 m-b-0"><strong>{eventType.title}</strong></h4>
                                                </header>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="col-6 text-left p-l-30">
                                                <h4><strong>Venue: {eventType.venue}<br />
                                                    {eventType.session_time}</strong></h4>
                                            </div>
                                            <div className="col-6 text-right p-r-30">
                                                <h4><strong>{eventType.cost}</strong></h4>
                                            </div>
                                            <div className="col-12 t-border-thin p-20">
                                                <div id="editor" className="editor">
                                                    <p>
                                                        <Editor
                                                            editorState={getEventDescriptionEditorState(eventType.description)}
                                                            readOnly={true}
                                                            ref="editor"
                                                        />
                                                    </p>
                                                </div>
                                            </div>
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

EventPage.propTypes = {
    eventTypes: PropTypes.array.isRequired,
    eventType: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
}


function getEventByType(eventTypes, type) {
    const eventType = eventTypes.filter(eventType => eventType.type == type);
    if (eventType.length) {
        return eventType[0];
    }

    return null;
}

function mapStateToProps(state, ownProps) {
    const eventTypeId = ownProps.params.id;
    const defaultEventType = { id: '', type: '', header: '', description: '', route: '', venue: '', image: '', session_time: '', title: '', cost: '' };
    let eventType = defaultEventType;

    if (state.eventTypes.length > 0) {
        if (eventTypeId) {
            eventType = state.eventTypes.find(event => String(event.id) === String(eventTypeId))
                || getEventByType(state.eventTypes, eventTypeId)
                || state.eventTypes[0];
        } else {
            eventType = state.eventTypes[0];
        }
    }

    return {
        eventTypes: state.eventTypes,
        eventType: eventType,
        authorized: state.authToken
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(eventActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventPage);

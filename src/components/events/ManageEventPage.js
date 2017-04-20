import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as eventActions from '../../actions/eventActions';
import * as uploadActions from '../../actions/uploadActions';
import EventForm from './EventForm';
import TextInput from '../common/TextInput';
import { CompositeDecorator, EditorState, convertFromRaw, convertToRaw } from 'draft-js';

class ManageEventPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    const decorator = new CompositeDecorator([
      {
        strategy: getEntityStrategy('MUTABLE'),
        component: TokenSpan,
      },
    ]);

    let blocks = convertFromRaw(blocks = { blocks: [{ text: '', type: 'unstyled', },], entityMap: { first: { type: 'TOKEN', mutability: 'MUTABLE', }, } });
    if (props.eventType.description != "")
      blocks = convertFromRaw(JSON.parse(props.eventType.description));

    this.state = {
      eventType: Object.assign({}, props.eventType),
      editorState: EditorState.createWithContent(
        blocks,
        decorator,
      ),
      errors: {},
      saving: false,
      newRecord: true
    };

    this.onChange = this.onChange.bind(this);
    this.focus = this.focus.bind(this);
    this.getTextFromEntity = this.getTextFromEntity.bind(this);
    this.saveEvent = this.saveEvent.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.updateEventState = this.updateEventState.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.updateStartDateState = this.updateStartDateState.bind(this);
    this.updateEndDateState = this.updateEndDateState.bind(this);
    this.displayEventType = this.displayEventType.bind(this);
    this.displayImage = this.displayImage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.eventType.id != nextProps.eventType.id) {
      nextProps.eventType.start_date = nextProps.eventType.start_date ? new Date(nextProps.eventType.start_date) : new Date()
      nextProps.eventType.end_date = nextProps.eventType.end_date ? new Date(nextProps.eventType.end_date) : new Date()
      this.setState({ eventType: Object.assign({}, nextProps.eventType) });
      const blocks = convertFromRaw(JSON.parse(nextProps.eventType.description));
      const editorState = EditorState.push(this.state.editorState, blocks);
      this.setState({ editorState });
      this.setState(this.state.newRecord = false);
    }
  }

  onChange(editorState) {
    this.setState({ editorState });
  }

  focus() {
    this.refs.editor.focus();
  }

  getTextFromEntity(editorObj) {
    let descriptionBlocks = [];
    for (let prop in editorObj.blocks) {
      if (editorObj.blocks.hasOwnProperty(prop)) {
        descriptionBlocks.push(editorObj.blocks[prop].text)
      }
    }
    return descriptionBlocks.join("\\n ");
  }

  updateEventState(event) {
    const field = event.target.name;
    let eventType = this.state.eventType;
    eventType[field] = event.target.value;
    return this.setState({ eventType });
  }

  updateStartDateState(event, date) {
    let eventType = this.state.eventType;
    eventType.start_date = date.toISOString();
    return this.setState({ eventType });
  }

  updateEndDateState(event, date) {
    let eventType = this.state.eventType;
    eventType.end_date = date.toISOString();
    return this.setState({ eventType });
  }

  saveEvent(event) {
    event.preventDefault();
    let eventType = this.state.eventType;
    eventType.short = this.getTextFromEntity(convertToRaw(this.state.editorState.getCurrentContent()));
    eventType.description = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
    eventType.start_date = new Date(eventType.start_date).toISOString();
    eventType.end_date = new Date(eventType.end_date).toISOString();
    this.setState({ eventType });
    this.props.actions.saveEvent(this.state.eventType);
    function replaceAll(str, find, replace) {
                return str.replace(new RegExp(find, 'g'), replace);
    }

    const generateType = (eventType) => {
        return replaceAll(eventType.header, ' ', '-');
    };
    eventType.type = generateType(eventType);

    this.context.router.push('/Events/' + eventType.type);
  }

  deleteEvent() {
    this.props.actions.deleteEvent(this.state.eventType);
    this.props.actions.loadEvent();
    this.context.router.push('/');
  }

  uploadImage(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      let eventType = this.state.eventType;
      eventType.image = file.name
      this.props.upload.uploadFile(file);
      return this.setState({ eventType: eventType });
    }
    reader.readAsDataURL(file)
  }

  displayEventType(header, updateEventState) {
    if (this.state.newRecord)
      return (
        <TextInput
          name="header"
          label="Page Title"
          value={header}
          onChange={updateEventState} />
      )

    return (
      <h1 className="color-white text-center">{header}</h1>
    )
  }

  displayImage(image) {
    image = image ? require(`../../images/${image}`) : '';
    return ({
      backgroundImage: 'url(' + image + ')',
      backgroundSize: "contain"
    })
  }

  render() {
    const {authorized} = this.props;
    return (
      <EventForm
        authorized={authorized}
        updateEventState={this.updateEventState}
        onChange={this.onChange}
        saveEvent={this.saveEvent}
        eventType={this.state.eventType}
        editorState={this.state.editorState}
        ref="editor"
        focus={focus}
        errors={this.state.errors}
        saving={this.state.saving}
        uploadImage={this.uploadImage}
        deleteEvent={this.deleteEvent}
        updateStartDateState={this.updateStartDateState}
        updateEndDateState={this.updateEndDateState}
        displayEventType={this.displayEventType}
        displayImage={this.displayImage}
      />
    );
  }
}

ManageEventPage.propTypes = {
  eventType: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  editorState: PropTypes.array.isRequired,
  upload: PropTypes.object.isRequired,
  entityKey: PropTypes.object.isRequired,
};

ManageEventPage.contextTypes = {
  router: PropTypes.object
};

function getEntityStrategy(mutability) {
  return function (contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        if (entityKey === null) {
          return false;
        }
        return contentState.getEntity(entityKey).getMutability() === mutability;
      },
      callback
    );
  };
}

const TokenSpan = (props) => {
  return (
    <span data-offset-key={props.offsetkey}>
      {props.children}
    </span>
  );
};


function getEventByType(eventTypes, type) {
  const eventType = eventTypes.filter(eventType => eventType.type == type);
  if (eventType.length) {
    return eventType[0];
  }

  return null;
}

function mapStateToProps(state, ownProps) {
  const eventTypeId = ownProps.params.id;
  let eventType = { id: '', type: '', header: '', short: '', description: '', venue: '', session_time: '', start_date: new Date(), end_date: new Date(), title: '', cost: '', image: '' };

  if (eventTypeId && state.eventTypes.length > 0) {
    eventType = getEventByType(state.eventTypes, eventTypeId);
  }

  return {
    eventType: eventType,
    authorized: state.authToken
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(eventActions, dispatch),
    upload: bindActionCreators(uploadActions, dispatch)
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(ManageEventPage);

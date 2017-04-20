import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as dietConsultationActions from '../../actions/dietConsultationActions';
import DietConsultationForm from './DietConsultationForm';
import Admin from '../common/Admin';
import { CompositeDecorator, EditorState, convertFromRaw, convertToRaw } from 'draft-js';

class ManageDietConsultationPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    const decorator = new CompositeDecorator([
      {
        strategy: getEntityStrategy('MUTABLE'),
        component: TokenSpan,
      },
    ]);

    let blocks = convertFromRaw(blocks = { blocks: [{ text: '', type: 'unstyled', },], entityMap: { first: { type: 'TOKEN', mutability: 'MUTABLE', }, } });
    if (props.dietConsultation.description != "")
      blocks = convertFromRaw(JSON.parse(props.dietConsultation.description));

    this.state = {
      dietConsultation: Object.assign({}, props.dietConsultation),
      editorState: EditorState.createWithContent(
        blocks,
        decorator,
      ),
      errors: {},
      saving: false
    };
    this.updateDietConsultationState = this.updateDietConsultationState.bind(this);
    this.updateTitleState = this.updateTitleState.bind(this);
    this.updateCostState = this.updateCostState.bind(this);
    this.updateSessionTimeState = this.updateSessionTimeState.bind(this);
    this.updateShortState = this.updateShortState.bind(this);
    this.updateConsultationDescState = this.updateConsultationDescState.bind(this);
    this.saveDietConsultation = this.saveDietConsultation.bind(this);
    this.removeRow = this.removeRow.bind(this);
    this.addRow = this.addRow.bind(this);
    this.onChange = this.onChange.bind(this);
    this.focus = this.focus.bind(this);
    this.getTextFromEntity = this.getTextFromEntity.bind(this);
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.dietConsultation.id != nextProps.dietConsultation.id) {
      this.setState({ dietConsultation: Object.assign({}, nextProps.dietConsultation) });
      const blocks = convertFromRaw(JSON.parse(nextProps.dietConsultation.description));
      const editorState = EditorState.push(this.state.editorState, blocks);
      this.setState({ editorState });
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

  updateTitleState(event) {
    const field = event.target.name;
    let dietConsultation = this.state.dietConsultation;
    dietConsultation.consultationDetails[parseInt(field)].title = event.target.value;
    return this.setState({ dietConsultation });
  }

  updateCostState(event) {
    const field = event.target.name;
    let dietConsultation = this.state.dietConsultation;
    dietConsultation.consultationDetails[parseInt(field)].cost = event.target.value;
    return this.setState({ dietConsultation });
  }

  updateSessionTimeState(event) {
    const field = event.target.name;
    let dietConsultation = this.state.dietConsultation;
    dietConsultation.consultationDetails[parseInt(field)].session_time = event.target.value;
    return this.setState({ dietConsultation });
  }

  updateShortState(event) {
    const field = event.target.name;
    let dietConsultation = this.state.dietConsultation;
    dietConsultation.consultationDetails[parseInt(field)].consultation = event.target.value;
    return this.setState({ dietConsultation });
  }

  updateConsultationDescState(event) {
    const field = event.target.name;
    let dietConsultation = this.state.dietConsultation;
    dietConsultation.consultationDetails[parseInt(field)].consultation_desc = event.target.value;
    return this.setState({ dietConsultation });
  }

  updateDietConsultationState(event) {
    const field = event.target.name;
    let dietConsultation = this.state.dietConsultation;
    dietConsultation[field] = event.target.value;
    return this.setState({ dietConsultation });
  }

  saveDietConsultation(event) {
    event.preventDefault();
    let dietConsultation = this.state.dietConsultation;
    if (!dietConsultation.icon) {
      dietConsultation.icon = 'whitehop.png';
      dietConsultation.iconHeight = '3em';
      dietConsultation.iconWidth = '3em';
    }
    dietConsultation.description = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
    this.setState({ dietConsultation });
    this.props.actions.saveDietConsultation(this.state.dietConsultation);
    this.context.router.push('/Ayurveda/DietConsultation');
  }

  addRow() {
    let dietConsultation = this.state.dietConsultation;
    dietConsultation.consultationDetails.push({
      id: '',
      type: 'diet',
      title: '',
      consultation: '',
      consultation_desc: '',
      session_time: '',
      cost: '',
      icon: 'whitehop.png',
      iconHeight: '3em',
      iconWidth: '3em',
    })
    this.setState({ dietConsultation });
  }

  removeRow(event) {
    const rowNumber = event.currentTarget.name;
    let dietConsultation = this.state.dietConsultation;
    dietConsultation.consultationDetails.splice(parseInt(rowNumber), 1)
    this.setState({ dietConsultation });
  }

  render() {
    const {authorized} = this.props;
    return (
      <div className="mdl-grid dark-color">
        <div className="ribbon bg-image-landing">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12 col-sm-offset-1 col-sm-10 m-b-1-em">
                <Admin saveAction={this.saveDietConsultation} authorized={authorized} />
                <br />
                <br />
                <DietConsultationForm
                  updateTitleState={this.updateTitleState}
                  updateCostState={this.updateCostState}
                  updateSessionTimeState={this.updateSessionTimeState}
                  updateShortState={this.updateShortState}
                  updateConsultationDescState={this.updateConsultationDescState}
                  updateDietConsultationState={this.updateDietConsultationState}
                  removeRow={this.removeRow}
                  addRow={this.addRow}
                  dietConsultation={this.state.dietConsultation}
                  errors={this.state.errors}
                  saving={this.state.saving}
                  onChange={this.onChange}
                  editorState={this.state.editorState}
                  ref="editor"
                  focus={focus}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ManageDietConsultationPage.propTypes = {
  dietConsultation: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

ManageDietConsultationPage.contextTypes = {
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

function mapStateToProps(state) {

  let dietConsultation = {
    id: '',
    type: '',
    header: '',
    short: '',
    description: '',
    venue: '',
    consultationDetails: [{
      id: '',
      type: '',
      title: '',
      consultation: '',
      consultation_desc: '',
      session_time: '',
      cost: '',
      icon: 'whitearomaoil.png',
      iconHeight: '3em',
      iconWidth: '1.8em',
    }]
  };

  if (state.dietConsultations.header) {
    dietConsultation = state.dietConsultations;
  }

  return {
    dietConsultation: dietConsultation,
    authorized: state.authToken
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(dietConsultationActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageDietConsultationPage);




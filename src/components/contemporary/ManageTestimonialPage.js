import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as testimonialActions from '../../actions/testimonialActions';
import TestimonialForm from './TestimonialForm';
import { CompositeDecorator, EditorState, convertFromRaw, convertToRaw } from 'draft-js';

class ManageTestimonialPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    const decorator = new CompositeDecorator([
      {
        strategy: getEntityStrategy('MUTABLE'),
        component: TokenSpan,
      },
    ]);

    let blocks = convertFromRaw(blocks = { blocks: [{ text: '', type: 'unstyled', },], entityMap: { first: { type: 'TOKEN', mutability: 'MUTABLE', }, } });
    if (props.testimonial.description != "")
      blocks = convertFromRaw(JSON.parse(props.testimonial.description));

    this.state = {
      testimonial: Object.assign({}, props.testimonial),
      editorState: EditorState.createWithContent(
        blocks,
        decorator,
      ),
      errors: {},
      saving: false
    };
    this.updateTestimonialState = this.updateTestimonialState.bind(this);
    this.updateQuoteState = this.updateQuoteState.bind(this);
    this.updateNameState = this.updateNameState.bind(this);
    this.saveTestimonial = this.saveTestimonial.bind(this);
    this.removeRow = this.removeRow.bind(this);
    this.addRow = this.addRow.bind(this);
    this.onChange = this.onChange.bind(this);
    this.focus = this.focus.bind(this);
    this.getTextFromEntity = this.getTextFromEntity.bind(this);
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.testimonial.id != nextProps.testimonial.id) {
      this.setState({ testimonial: Object.assign({}, nextProps.testimonial) });
      const blocks = convertFromRaw(JSON.parse(nextProps.testimonial.description));
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

  updateTestimonialState(event) {
    const field = event.target.name;
    let testimonial = this.state.testimonial;
    testimonial[field] = event.target.value;
    return this.setState({ testimonial });
  }

  updateQuoteState(event) {
    const field = event.target.name;
    let testimonial = this.state.testimonial;
    testimonial.testimonial_details[parseInt(field)].testimonial = event.target.value;
    return this.setState({ testimonial });
  }

  updateNameState(event) {
    const field = event.target.name;
    let testimonial = this.state.testimonial;
    testimonial.testimonial_details[parseInt(field)].name = event.target.value;
    return this.setState({ testimonial });
  }

  saveTestimonial(event) {
    event.preventDefault();
    let testimonial = this.state.testimonial;
    if (!testimonial.icon) {
      testimonial.icon = 'whitehop.png';
      testimonial.iconHeight = '3em';
      testimonial.iconWidth = '3em';
    }
    testimonial.description = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
    this.setState({ testimonial });
    this.props.actions.saveTestimonial(this.state.testimonial);
    this.context.router.push('/Ayurveda/Testimonials');
  }

  addRow() {
    let testimonial = this.state.testimonial;
    testimonial.testimonial_details.push({
      id: '',
      type: '',
      testimonial: '',
      name: '',
    })
    this.setState({ testimonial });
  }

  removeRow(event) {
    const rowNumber = event.currentTarget.name;
    let testimonial = this.state.testimonial;
    testimonial.testimonial_details.splice(parseInt(rowNumber), 1)
    this.setState({ testimonial });
  }

  render() {
    const {authorized} = this.props;
    return (
      <TestimonialForm
        authorized={authorized}
        saveTestimonial={this.saveTestimonial} 
        updateTestimonialState={this.updateTestimonialState}
        updateQuoteState={this.updateQuoteState}
        updateNameState={this.updateNameState}
        removeRow={this.removeRow}
        addRow={this.addRow}
        testimonial={this.state.testimonial}
        errors={this.state.errors}
        saving={this.state.saving}
        onChange={this.onChange}
        editorState={this.state.editorState}
        ref="editor"
        focus={focus}
      />
    );
  }
}

ManageTestimonialPage.propTypes = {
  testimonial: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

ManageTestimonialPage.contextTypes = {
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

  let testimonial = {
    id: '',
    type: '',
    header: '',
    short: '',
    description: '',
    testimonial_details: [{
      id: '',
      type: '',
      testimonial: '',
      name: '',
    }]
  };

  if (state.testimonials.header) {
    testimonial = state.testimonials;
  }

  return {
    testimonial: testimonial,
    authorized: state.authToken
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(testimonialActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageTestimonialPage);




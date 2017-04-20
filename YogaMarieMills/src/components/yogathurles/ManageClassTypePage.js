import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as classTypesActions from '../../actions/classTypesActions';
import * as uploadActions from '../../actions/uploadActions';
import ClassTypeForm from './ClassTypeForm';
import { CompositeDecorator, EditorState, convertFromRaw, convertToRaw } from 'draft-js';

class ManageClassTypePage extends React.Component {
  constructor(props, context) {
    super(props, context);

    const decorator = new CompositeDecorator([
      {
        strategy: getEntityStrategy('MUTABLE'),
        component: TokenSpan,
      },
    ]);

    let blocks = convertFromRaw(blocks = { blocks: [{ text: '', type: 'unstyled', },], entityMap: { first: { type: 'TOKEN', mutability: 'MUTABLE', }, } });
    if (props.classType.description != "")
      blocks = convertFromRaw(JSON.parse(props.classType.description));

    this.state = {
      classType: Object.assign({}, props.classType),
      editorState: EditorState.createWithContent(
        blocks,
        decorator,
      ),
      errors: {},
      saving: false
    };

    this.onChange = this.onChange.bind(this);
    this.focus = this.focus.bind(this);
    this.getTextFromEntity = this.getTextFromEntity.bind(this);
    this.saveClassType = this.saveClassType.bind(this);
    this.deleteClassType = this.deleteClassType.bind(this);
    this.updateClassTypeState = this.updateClassTypeState.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.classType.id != nextProps.classType.id) {
      this.setState({ classType: Object.assign({}, nextProps.classType) });
      const blocks = convertFromRaw(JSON.parse(nextProps.classType.description));
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

  updateClassTypeState(event) {
    const field = event.target.name;
    let classType = this.state.classType;
    classType[field] = event.target.value;
    return this.setState({ classType });
  }

  saveClassType(event) {
    event.preventDefault();
    let classType = this.state.classType;
    classType.short = this.getTextFromEntity(convertToRaw(this.state.editorState.getCurrentContent()));
    classType.description = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
    this.setState({ classType });
    this.props.actions.saveClassType(this.state.classType);
    this.context.router.push('/YogaThurles/ClassTypes');
  }

  deleteClassType() {
    this.props.actions.deleteClassType(this.state.classType.id);
    this.props.actions.loadClassType();
    this.context.router.push('/YogaThurles/ClassTypes');
  }

  uploadImage(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      let classType = this.state.classType;
      classType.image = file.name
      this.props.upload.uploadFile(file);
      return this.setState({ classType: classType });
    }
    reader.readAsDataURL(file)
  }

  render() {
    const { classType } = this.props;
    const { authorized } = this.props;
    let classTypeImg = classType.image != "" ? require(`../../images/${classType.image}`) : ""

    const classTypeImage = {
      backgroundImage: 'url(' + classTypeImg + ')',
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "cover"
    }

    return (
      <ClassTypeForm
        authorized={authorized}
        updateClassTypeState={this.updateClassTypeState}
        onChange={this.onChange}
        saveClassType={this.saveClassType}
        classType={this.state.classType}
        classTypeImage={classTypeImage}
        editorState={this.state.editorState}
        ref="editor"
        focus={focus}
        errors={this.state.errors}
        saving={this.state.saving}
        uploadImage={this.uploadImage}
        deleteClassType={this.deleteClassType}
      />
    );
  }
}

ManageClassTypePage.propTypes = {
  classType: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  editorState: PropTypes.array.isRequired,
  upload: PropTypes.object.isRequired,
  entityKey: PropTypes.object.isRequired,
};

ManageClassTypePage.contextTypes = {
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


function getClassTypeById(classTypes, id) {
  const classType = classTypes.filter(classType => classType.id == id);
  if (classType.length) {
    return classType[0];
  }

  return null;
}

function mapStateToProps(state, ownProps) {
  const classTypeId = ownProps.params.id;
  let classType = { id: '', title: '', image: '', short: '', description: '', href: '', route: '', component: '' };
  if (classTypeId && state.classTypes.length > 0) {
    classType = getClassTypeById(state.classTypes, classTypeId);
  }

  return {
    classType: classType,
    authorized: state.authToken
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(classTypesActions, dispatch),
    upload: bindActionCreators(uploadActions, dispatch)
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(ManageClassTypePage);

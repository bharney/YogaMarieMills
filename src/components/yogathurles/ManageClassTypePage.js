import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as classTypesActions from '../../actions/classTypesActions';
import * as uploadActions from '../../actions/uploadActions';
import ClassTypeForm from './ClassTypeForm';
import { CompositeDecorator, EditorState, convertFromRaw, convertToRaw } from 'draft-js';

class ManageClassTypePage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.decorator = new CompositeDecorator([
      {
        strategy: getEntityStrategy('MUTABLE'),
        component: (componentProps) => (
          <span data-offset-key={componentProps.offsetKey}>
            {componentProps.children}
          </span>
        ),
      },
    ]);

    const defaultRawContent = {
      blocks: [{ text: '', type: 'unstyled' }],
      entityMap: {}
    };
    let blocks = convertFromRaw(defaultRawContent);

    if (props.classType.description) {
      try {
        blocks = convertFromRaw(JSON.parse(props.classType.description));
      } catch (error) {
        blocks = convertFromRaw(defaultRawContent);
      }
    }

    this.state = {
      classType: Object.assign({}, props.classType),
      editorState: EditorState.createWithContent(
        blocks,
        this.decorator,
      ),
      imagePreviewUrl: '',
      errors: {},
      saving: false
    };

    this.onChange = this.onChange.bind(this);
    this.getTextFromEntity = this.getTextFromEntity.bind(this);
    this.saveClassType = this.saveClassType.bind(this);
    this.deleteClassType = this.deleteClassType.bind(this);
    this.updateClassTypeState = this.updateClassTypeState.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.displayImage = this.displayImage.bind(this);
  }

  componentWillUnmount() {
    if (this.state.imagePreviewUrl && this.state.imagePreviewUrl.indexOf('blob:') === 0) {
      URL.revokeObjectURL(this.state.imagePreviewUrl);
    }
  }


  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.classType.id != nextProps.classType.id) {
      this.setState({ classType: Object.assign({}, nextProps.classType), imagePreviewUrl: '' });
      const blocks = nextProps.classType.description
        ? convertFromRaw(JSON.parse(nextProps.classType.description))
        : convertFromRaw({ blocks: [{ text: '', type: 'unstyled' }], entityMap: {} });
      const editorState = EditorState.createWithContent(blocks, this.decorator);
      this.setState({ editorState });
    }
  }

  onChange(editorState) {
    this.setState({ editorState });
  }

  getTextFromEntity(editorObj) {
    let descriptionBlocks = [];
    for (let prop in editorObj.blocks) {
      if (editorObj.blocks.hasOwnProperty(prop)) {
        descriptionBlocks.push(editorObj.blocks[prop].text);
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
    this.props.actions.loadClassTypes();
    this.context.router.push('/YogaThurles/ClassTypes');
  }

  uploadImage(e) {
    e.preventDefault();

    let file = e.target.files[0];
    if (!file) {
      return;
    }

    const previousPreviewUrl = this.state.imagePreviewUrl;
    const imagePreviewUrl = URL.createObjectURL(file);
    let classType = this.state.classType;
    classType.image = file.name;

    this.setState({ classType: classType, imagePreviewUrl });

    if (previousPreviewUrl && previousPreviewUrl.indexOf('blob:') === 0) {
      URL.revokeObjectURL(previousPreviewUrl);
    }

    this.props.upload.uploadFile(file).then((uploadedFile) => {
      this.setState((prevState) => ({
        classType: {
          ...prevState.classType,
          image: uploadedFile.filename
        }
      }));
    }).catch(() => {
      // Keep the local preview visible even if the upload request fails.
    });
  }

  displayImage(image) {
    let imageSrc = '';

    if (image) {
      if (image.indexOf('blob:') === 0 || image.indexOf('data:') === 0 || image.indexOf('http') === 0 || image.indexOf('/') === 0) {
        imageSrc = image;
      } else {
        try {
          imageSrc = require(`../../images/${image}`);
        } catch (error) {
          imageSrc = `/images/${encodeURIComponent(image)}`;
        }
      }
    }

    if (imageSrc && imageSrc.indexOf('blob:') !== 0 && imageSrc.indexOf('data:') !== 0) {
      imageSrc = encodeURI(imageSrc);
    }

    return {
      backgroundImage: imageSrc ? `url("${imageSrc}")` : 'none',
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "cover"
    };
  }

  render() {
    const { authorized } = this.props;

    return (
      <ClassTypeForm
        authorized={authorized}
        updateClassTypeState={this.updateClassTypeState}
        onChange={this.onChange}
        saveClassType={this.saveClassType}
        classType={this.state.classType}
        classTypeImage={this.displayImage(this.state.imagePreviewUrl || this.state.classType.image)}
        editorState={this.state.editorState}
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
  upload: PropTypes.object.isRequired,
  authorized: PropTypes.object,
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

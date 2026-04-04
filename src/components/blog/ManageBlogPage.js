import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as blogActions from '../../actions/blogActions';
import * as uploadActions from '../../actions/uploadActions';
import BlogForm from './BlogForm';
import { CompositeDecorator, EditorState, convertFromRaw, convertToRaw } from 'draft-js';

class ManageBlogPage extends React.Component {
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

    if (props.blog.description) {
      try {
        blocks = convertFromRaw(JSON.parse(props.blog.description));
      } catch (error) {
        blocks = convertFromRaw(defaultRawContent);
      }
    }

    this.state = {
      blog: Object.assign({}, props.blog),
      editorState: EditorState.createWithContent(
        blocks,
        this.decorator,
      ),
      imagePreviewUrl: '',
      errors: {},
      saving: false,
    };

    this.onChange = this.onChange.bind(this);
    this.saveBlog = this.saveBlog.bind(this);
    this.deleteBlog = this.deleteBlog.bind(this);
    this.getTextFromEntity = this.getTextFromEntity.bind(this);
    this.updateBlogState = this.updateBlogState.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.displayImage = this.displayImage.bind(this);
  }
  componentWillUnmount() {
    if (this.state.imagePreviewUrl && this.state.imagePreviewUrl.indexOf('blob:') === 0) {
      URL.revokeObjectURL(this.state.imagePreviewUrl);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.blog.id !== nextProps.blog.id) {
      const blocks = nextProps.blog.description ?
        convertFromRaw(JSON.parse(nextProps.blog.description)) :
        convertFromRaw({ blocks: [{ text: '', type: 'unstyled' }], entityMap: {} });
      const editorState = EditorState.createWithContent(blocks, this.decorator);
      this.setState({
        blog: Object.assign({}, nextProps.blog),
        editorState
      });
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

  saveBlog(event) {
    event.preventDefault();
    let blog = this.state.blog;
    blog.short = this.getTextFromEntity(convertToRaw(this.state.editorState.getCurrentContent()));
    blog.description = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
    this.setState({ blog: blog });
    this.props.actions.saveBlog(this.state.blog);
    this.context.router.push('/blogs');
  }

  deleteBlog() {
    this.props.actions.deleteBlog(this.state.blog.id);
    this.props.actions.loadBlog();
    this.context.router.push('/blogs');
  }

  uploadImage(e) {
    e.preventDefault();

    let file = e.target.files[0];
    if (!file) {
      return;
    }

    const previousPreviewUrl = this.state.imagePreviewUrl;
    const imagePreviewUrl = URL.createObjectURL(file);
    let blog = this.state.blog;
    blog.image = file.name;

    this.props.upload.uploadFile(file);
    this.setState({ blog: blog, imagePreviewUrl });

    if (previousPreviewUrl && previousPreviewUrl.indexOf('blob:') === 0) {
      URL.revokeObjectURL(previousPreviewUrl);
    }
  }

  updateBlogState(event) {
    const field = event.target.name;
    let blog = this.state.blog;
    blog[field] = event.target.value;
    return this.setState({ blog: blog });
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

    return ({
      backgroundImage: imageSrc ? `url("${imageSrc}")` : 'none',
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "cover"
    });
  }


  render() {
    const { authorized } = this.props;
    return (
      <BlogForm
        authorized={authorized}
        updateBlogState={this.updateBlogState}
        onChange={this.onChange}
        saveBlog={this.saveBlog}
        deleteBlog={this.deleteBlog}
        blog={this.state.blog}
        imagePreviewUrl={this.state.imagePreviewUrl}
        editorState={this.state.editorState}
        errors={this.state.errors}
        saving={this.state.saving}
        uploadImage={this.uploadImage}
        displayImage={this.displayImage}
      />
    );
  }
}

ManageBlogPage.propTypes = {
  blog: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  upload: PropTypes.object.isRequired,
  authorized: PropTypes.object
};

ManageBlogPage.contextTypes = {
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

function getBlogById(blogs, id) {
  const blog = blogs.filter(blog => blog.id == id);
  if (blog.length) {
    return blog[0];
  }

  return null;
}

function mapStateToProps(state, ownProps) {
  const blogId = ownProps.params.id;
  let blog = { id: '', title: '', image: '', description: '', href: '', route: '', component: '' };
  if (blogId && state.blogs.length > 0) {
    blog = getBlogById(state.blogs, blogId);
  }

  return {
    blog: blog,
    authorized: state.authToken
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(blogActions, dispatch),
    upload: bindActionCreators(uploadActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageBlogPage);

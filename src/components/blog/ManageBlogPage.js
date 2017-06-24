import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as blogActions from '../../actions/blogActions';
import * as uploadActions from '../../actions/uploadActions';
import BlogForm from './BlogForm';
import { CompositeDecorator, EditorState, convertFromRaw, convertToRaw } from 'draft-js';

class ManageBlogPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    const decorator = new CompositeDecorator([
      {
        strategy: getEntityStrategy('MUTABLE'),
        component: TokenSpan,
      },
    ]);

    let blocks = convertFromRaw(blocks = { blocks: [{ text: '', type: 'unstyled', },], entityMap: { first: { type: 'TOKEN', mutability: 'MUTABLE', }, } });
    if (props.blog.description != "")
      blocks = convertFromRaw(JSON.parse(props.blog.description));

    this.state = {
      blog: Object.assign({}, props.blog),
      editorState: EditorState.createWithContent(
        blocks,
        decorator,
      ),
    };

    this.onChange = this.onChange.bind(this);
    this.focus = this.focus.bind(this);
    this.saveBlog = this.saveBlog.bind(this);
    this.deleteBlog = this.deleteBlog.bind(this);
    this.getTextFromEntity = this.getTextFromEntity.bind(this);
    this.updateBlogState = this.updateBlogState.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.displayImage = this.displayImage.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.blog.id != nextProps.blog.id) {
      this.setState({ blog: Object.assign({}, nextProps.blog) });
      const blocks = convertFromRaw(JSON.parse(nextProps.blog.description));
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

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      let blog = this.state.blog;
      blog.image = file.name
      this.props.upload.uploadFile(file);
      return this.setState({ blog: blog });
    }
    reader.readAsDataURL(file)
  }

  updateBlogState(event) {
    const field = event.target.name;
    let blog = this.state.blog;
    blog[field] = event.target.value;
    return this.setState({ blog: blog });
  }

  displayImage(image) {
    image = image ? require(`../../images/${image}`) : '';
    return ({
      backgroundImage: 'url(' + image + ')',
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "cover"
    })
  }


  render() {
    const {authorized} = this.props;
    return (
      <BlogForm
      authorized={authorized}
        updateBlogState={this.updateBlogState}
        onChange={this.onChange}
        saveBlog={this.saveBlog}
        deleteBlog={this.deleteBlog}
        blog={this.state.blog}
        editorState={this.state.editorState}
        ref="editor"
        focus={focus}
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
  actions: PropTypes.object.isRequired
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

const TokenSpan = (props) => {
  return (
    <span data-offset-key={props.offsetkey}>
      {props.children}
    </span>
  );
};


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
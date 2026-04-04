import React from 'react';
import PropTypes from 'prop-types';
import TextInput from '../common/TextInput';
import Admin from '../common/Admin';
import { Link } from 'react-router';
import Editor from 'draft-js-plugins-editor';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
} from 'draft-js-buttons';

const inlineToolbarPlugin = createInlineToolbarPlugin({
  structure: [
    BoldButton,
    ItalicButton,
    UnderlineButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
  ]
});

const plugins = [inlineToolbarPlugin];

const { InlineToolbar } = inlineToolbarPlugin;

const BlogForm = ({ authorized, updateBlogState, onChange, deleteBlog, saveBlog, blog, imagePreviewUrl, editorState, uploadImage, displayImage }) => {

  return (
    <div className="mdl-grid dark-color">
      <div className="ribbon bg-image-landing b-border">
        <div className="container">
          <div className="row m-b-1-em">
            <div className="col-12">
              <h1 className="color-white text-center">{blog.title}</h1>
              <Admin uploadImage={uploadImage} blog={blog} saveAction={saveBlog} deleteAction={deleteBlog} authorized={authorized} />
              <div className="mdl-card mdl-shadow--4dp">
                <div className="mdl-card__media v-h-40 image-text-container" style={displayImage(imagePreviewUrl || blog.image)}>
                  <div className="col-7 text-left align-bottom m-l-20 m-b-20">
                    <TextInput
                      name="title"
                      label="Title"
                      value={blog.title}
                      onChange={updateBlogState} />
                  </div>
                </div>
                <div className="col-12 t-border-thin p-20">
                  <div className="mdl-color-text--grey-700 col-12 m-b-15">
                    <div className="pull-left">
                      <p><strong>{blog.postDate} by <Link to="/about">Marie Mills</Link></strong></p>
                    </div>
                    <div className="pull-right">
                      <i className="glyphicon glyphicon-heart fa-lg" aria-hidden="true" /> &nbsp;
                      <i className="glyphicon glyphicon-bookmark fa-lg" aria-hidden="true" /> &nbsp;
                      <i className="fa fa-share-alt fa-lg" aria-hidden="true" />
                    </div>
                  </div>
                  <div id="editor" className="editor">
                    <div>
                      <Editor
                        editorState={editorState}
                        onChange={onChange}
                        plugins={plugins}
                      />
                      <InlineToolbar />
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
};

BlogForm.propTypes = {
  blog: PropTypes.object.isRequired,
  authorized: PropTypes.object,
  imagePreviewUrl: PropTypes.string,
  editorState: PropTypes.object.isRequired,
  updateBlogState: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  saveBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func,
  saving: PropTypes.bool,
  uploadImage: PropTypes.func.isRequired,
  displayImage: PropTypes.func.isRequired,
  errors: PropTypes.object
};

export default BlogForm;

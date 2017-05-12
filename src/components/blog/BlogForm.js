import React from 'react';
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

const BlogForm = ({authorized, updateBlogState, onChange, deleteBlog, saveBlog, blog, editorState, ref, focus, uploadImage, displayImage }) => {

  return (
    <div className="mdl-grid dark-color">
      <div className="ribbon bg-image-landing b-border">
        <div className="container">
          <div className="row m-b-1-em">
            <div className="col-xs-12">
              <h1 className="color-white text-center">{blog.title}</h1>
              <Admin uploadImage={uploadImage} blog={blog} saveAction={saveBlog} deleteAction={deleteBlog} authorized={authorized} />
              <div className="mdl-card mdl-shadow--4dp">
                <div className="mdl-card__media v-h-40 image-text-container" style={displayImage(blog.image)}>
                  <div className="col-xs-7 text-left align-bottom m-l-20 m-b-20">
                    <TextInput
                      name="title"
                      label="Title"
                      value={blog.title}
                      onChange={updateBlogState} />
                  </div>
                </div>
                <div className="col-xs-12 t-border-thin p-20">
                  <div className="mdl-color-text--grey-700 col-xs-12 m-b-15">
                    <div className="pull-left">
                      <p><strong>{blog.postDate} by <Link to="/about">Marie Mills</Link></strong></p>
                    </div>
                    <div className="pull-right">
                      <i className="glyphicon glyphicon-heart fa-lg" aria-hidden="true"></i> &nbsp;
                      <i className="glyphicon glyphicon-bookmark fa-lg" aria-hidden="true"></i> &nbsp;
                      <i className="fa fa-share-alt fa-lg" aria-hidden="true"></i>
                    </div>
                  </div>
                  <div id="editor" className="editor" onClick={focus}>
                    <p>
                      <Editor
                        editorState={editorState}
                        onChange={onChange}
                        ref={ref}
                        plugins={plugins}
                      />
                      <InlineToolbar />
                    </p>
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
  blog: React.PropTypes.object.isRequired,
  editorState: React.PropTypes.object.isRequired,
  updateBlogState: React.PropTypes.object.isRequired,
  focus: React.PropTypes.object.isRequired,
  saving: React.PropTypes.object.isRequired,
  uploadImage: React.PropTypes.object.isRequired,
  saveBlog: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  errors: React.PropTypes.object
};

export default BlogForm;
import React from 'react';
import TextInput from '../common/TextInput';
import Admin from '../common/Admin';
import { Link } from 'react-router';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';

/* Emoji plugin */
import createEmojiPlugin from 'draft-js-emoji-plugin'
import 'draft-js-emoji-plugin/lib/plugin.css'
const emojiPlugin = createEmojiPlugin()
const { EmojiSuggestions } = emojiPlugin

/* Hashtag plugin */
import createHashtagPlugin from 'draft-js-hashtag-plugin'
import 'draft-js-hashtag-plugin/lib/plugin.css'
const hashtagPlugin = createHashtagPlugin()

/* Image with Alignment, dnd, focus, resize plugin */
import createImagePlugin from 'draft-js-image-plugin'
import createAlignmentPlugin from 'draft-js-alignment-plugin'
import createFocusPlugin from 'draft-js-focus-plugin'
import createResizeablePlugin from 'draft-js-resizeable-plugin'
import createDndPlugin from 'draft-js-dnd-plugin'

import 'draft-js-alignment-plugin/lib/plugin.css'
import 'draft-js-focus-plugin/lib/plugin.css'

const focusPlugin = createFocusPlugin()
const resizeablePlugin = createResizeablePlugin()
const dndPlugin = createDndPlugin()
const alignmentPlugin = createAlignmentPlugin()
const { AlignmentTool } = alignmentPlugin

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
  focusPlugin.decorator,
  dndPlugin.decorator
)
const imagePlugin = createImagePlugin({ decorator })

/* Linkify */
import createLinkifyPlugin from 'draft-js-linkify-plugin'
import 'draft-js-linkify-plugin/lib/plugin.css'
const linkifyPlugin = createLinkifyPlugin()

/* ld plugins */

/* Toolbar */
import createToolbarPlugin from 'last-draft-js-toolbar-plugin'
import 'last-draft-js-toolbar-plugin/lib/plugin.css'
const toolbarPlugin = createToolbarPlugin()
const { Toolbar } = toolbarPlugin

/* Side Toolbar */
import createSidebarPlugin from 'last-draft-js-sidebar-plugin'
import 'last-draft-js-sidebar-plugin/lib/plugin.css'
const sidebarPlugin = createSidebarPlugin()
const { Sidebar } = sidebarPlugin

/* Embed plugin */
import createEmbedPlugin from 'draft-js-embed-plugin'
import 'draft-js-embed-plugin/lib/plugin.css'
const embedPlugin = createEmbedPlugin()

/* Link plugin */
import createLinkPlugin from 'draft-js-link-plugin'
import 'draft-js-link-plugin/lib/plugin.css'
const linkPlugin = createLinkPlugin()


/* init the plugins */
const plugins = [
  dndPlugin, focusPlugin, alignmentPlugin, resizeablePlugin, imagePlugin,
  emojiPlugin, hashtagPlugin, linkifyPlugin,
  toolbarPlugin, sidebarPlugin, embedPlugin, linkPlugin
]

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
                      <AlignmentTool />
                      <Toolbar />
                      <Sidebar />
                      <EmojiSuggestions />
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
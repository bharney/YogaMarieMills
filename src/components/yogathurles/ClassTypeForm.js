import React from 'react';
import PropTypes from 'prop-types';
import TextInput from '../common/TextInput';
import Admin from '../common/Admin';
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

const ClassTypeForm = ({ authorized, updateClassTypeState, onChange, saveClassType, classType, classTypeImage, editorState, uploadImage, deleteClassType }) => {

  return (
    <div className="mdl-grid dark-color">
      <div className="ribbon bg-image-landing b-border">
        <div className="container">
          <div className="row m-b-1-em">
            <div key={classType.id} className="col-12">
              <h1 className="color-white text-center">{classType.title}</h1>
              <hr width="50%" className="center-block" />
              <form>
                <Admin saveAction={saveClassType} deleteAction={deleteClassType} uploadImage={uploadImage} authorized={authorized} />
                <div className="col-12 m-b-1-em">
                  <div className="mdl-card mdl-shadow--4dp">
                    <div className="mdl-card__media v-h-40 image-text-container" style={classTypeImage}>
                      <div className="col-7 text-left align-bottom m-l-20 m-b-20">
                        <TextInput
                          name="title"
                          label="Title"
                          value={classType.title}
                          onChange={updateClassTypeState} />
                      </div>
                    </div>
                    <div className="col-12 t-border-thin p-20">
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

ClassTypeForm.propTypes = {
  classType: PropTypes.object.isRequired,
  authorized: PropTypes.object,
  classTypeImage: PropTypes.object.isRequired,
  editorState: PropTypes.object.isRequired,
  updateClassTypeState: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  uploadImage: PropTypes.func.isRequired,
  saveClassType: PropTypes.func.isRequired,
  deleteClassType: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object
};

export default ClassTypeForm;

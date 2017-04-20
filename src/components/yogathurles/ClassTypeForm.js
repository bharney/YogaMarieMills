import React from 'react';
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

const ClassTypeForm = ({authorized, updateClassTypeState, onChange, saveClassType, classType, classTypeImage, editorState, ref, focus, uploadImage, deleteClassType}) => {
    
  return (
    <div className="mdl-grid dark-color">
      <div className="ribbon bg-image-landing b-border">
        <div className="container">
          <div className="row m-b-1-em">
            <div key={classType.id} className="col-xs-12">
              <h1 className="color-white text-center">{classType.title}</h1>
              <hr width="50%" className="center-block" />
              <form>
                <Admin saveAction={saveClassType} deleteAction={deleteClassType} uploadImage={uploadImage} authorized={authorized}/>
                <div className="col-xs-12 m-b-1-em">
                  <div className="mdl-card mdl-shadow--4dp">
                    <div className="mdl-card__media v-h-40 image-text-container" style={classTypeImage}>
                      <div className="col-xs-7 text-left align-bottom m-l-20 m-b-20">
                          <TextInput
                            name="title"
                            label="Title"
                            value={classType.title}
                            onChange={updateClassTypeState} />
                      </div>
                    </div>
                    <div className="col-xs-12 t-border-thin p-20">
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

ClassTypeForm.propTypes = {
  classType: React.PropTypes.object.isRequired,
  editorState: React.PropTypes.object.isRequired,
  updateClassTypeState: React.PropTypes.object.isRequired,
  focus: React.PropTypes.object.isRequired,
  saving: React.PropTypes.object.isRequired,
  uploadImage: React.PropTypes.object.isRequired,
  saveClassType: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  errors: React.PropTypes.object
};

export default ClassTypeForm;
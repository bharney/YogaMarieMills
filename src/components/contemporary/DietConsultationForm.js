import React from 'react';
import { Link } from 'react-router';
import TextInput from '../common/TextInput';
import ConsultationDetailsForm from './ConsultationDetailsForm';
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

const DietConsultationForm = ({ updateTitleState, updateCostState, updateSessionTimeState, updateShortState, updateConsultationDescState, updateDietConsultationState, addRow, removeRow, saveDietConsultation, dietConsultation, errors, saving, onChange, editorState, ref, focus }) => {

  return (
    <form>
      <h1 className="color-white text-center">Aryuvedic Diet Consultation</h1>
      <TextInput
        name="short"
        label="Title"
        value={dietConsultation.short}
        onChange={updateDietConsultationState} />
      <div className="mdl-card mdl-shadow--4dp p-2-em">
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
        <ConsultationDetailsForm 
          removeRow={removeRow}
          updateTitleState={updateTitleState}
          updateCostState={updateCostState}
          updateSessionTimeState={updateSessionTimeState}
          updateShortState={updateShortState}
          updateConsultationDescState={updateConsultationDescState}
          removeRow={removeRow}
          saveDietConsultation={saveDietConsultation}
          dietConsultation={dietConsultation}
          errors={errors}
          saving={saving}
          deleteDietConsultationdietConsultation={dietConsultation} />
        <Link className="text-right" to="" onClick={addRow} >
          <button type="button" className="btn btn-success btn-circle-lg" title="Add Row"><i className="glyphicon glyphicon-plus"></i></button>
        </Link>
      </div>

    </form>
  );
};

DietConsultationForm.propTypes = {
  dietConsultation: React.PropTypes.object.isRequired,
  updateDietConsultationState: React.PropTypes.object.isRequired,
  saving: React.PropTypes.object.isRequired,
  saveDietConsultation: React.PropTypes.func.isRequired,
  errors: React.PropTypes.object
};

export default DietConsultationForm;
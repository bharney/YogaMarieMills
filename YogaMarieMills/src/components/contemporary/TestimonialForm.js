import React from 'react';
import { Link } from 'react-router';
import TextInput from '../common/TextInput';
import Admin from '../common/Admin';
import TestimonialDetailsForm from './TestimonialDetailsForm';
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

const TestimonialForm = ({ authorized, updateQuoteState, updateNameState, updateTestimonialState, saveTestimonial, addRow, removeRow, testimonial, errors, saving, onChange, editorState, ref, focus }) => {

  return (
    <form>
      <div className="mdl-grid dark-color">
        <div className="ribbon bg-image-landing">
          <div className="container-fluid">
            <div className="row m-t-1-em m-b-1-em">
              <div className="col-xs-offset-12 col-sm-offset-1 col-sm-10 m-b-1-em">
                <Admin saveAction={saveTestimonial} authorized={authorized} />
                <h1 className="color-white text-center">{testimonial.header}</h1>
                <TextInput
                  name="short"
                  label="Title"
                  value={testimonial.short}
                  onChange={updateTestimonialState} />
                <div className="col-xs-12 m-b-1-em">
                  <div className="mdl-card mdl-shadow--4dp p-1-em">
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
                <div className="col-2-masonry">
                  <TestimonialDetailsForm
                    removeRow={removeRow}
                    updateQuoteState={updateQuoteState}
                    updateNameState={updateNameState}
                    removeRow={removeRow}
                    testimonial={testimonial}
                    errors={errors}
                    saving={saving} />
                </div>
                <Link className="text-right" to="" onClick={addRow} >
                  <button type="button" className="btn btn-success btn-circle-lg" title="Add Row"><i className="glyphicon glyphicon-plus"></i></button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

TestimonialForm.propTypes = {
  testimonial: React.PropTypes.object.isRequired,
  updateTestimonialState: React.PropTypes.object.isRequired,
  saving: React.PropTypes.object.isRequired,
  saveTestimonial: React.PropTypes.func.isRequired,
  errors: React.PropTypes.object
};

export default TestimonialForm;
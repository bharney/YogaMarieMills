import React, { Component } from 'react';
import { render } from 'react-dom';
import {Editor} from '../src/components/Editor';
import LD from '../src/';
import { fromJS } from 'immutable';

/* init the state, either from raw or html */
import RAW from './initialState/raw'
import HTML from './initialState/html'

export default class ExampleEditor extends Component {
  constructor(props) {
    super(props)
    /* examples of initial state */
    const INITIAL_STATE = LD.editorStateFromRaw(RAW)
    //const INITIAL_STATE = editorStateFromHtml(HTML)
    //const INITIAL_STATE = editorStateFromRaw({})
    //const INITIAL_STATE = editorStateFromText('this is a cooel editor... 🏄🌠🏀')
    //const INITIAL_STATE = editorStateFromHtml('<div />')
    this.state = { editorState: INITIAL_STATE }
    this.onChange = this.onChange.bind(this);
  }

  onChange = (editorState) => {
    this.setState({ editorState: editorState })
    /* You would normally save this to your database here instead of logging it */
    console.log(LD.editorStateToHtml(editorState))
    //console.log(editorStateToJSON(editorState))
  }

  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        placeholder='Text'
        onChange={this.onChange} />
    )
  }
}
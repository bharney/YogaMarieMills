import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Admin from '../common/Admin';
import * as testimonialActions from '../../actions/testimonialActions';
import { Editor, EditorState, convertFromRaw } from 'draft-js';

class TestimonialPage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const { testimonials } = this.props;
        if(!testimonials.testimonial_details)
            testimonials.testimonial_details = [];
        const { authorized } = this.props;
        return (
            <div className="container-fluid p-l-0 p-r-0 p-t-4-em color-blur">
                <div className="ribbon bg-image-landing">
                    <div className="container-fluid">
                        <div className="row m-t-1-em">
                            <div className="col-sm-offset-1 col-sm-10 col-xs-12 m-b-1-em">
                                <h1 className="color-white text-center">{testimonials.header}</h1>
                                <h3 className="color-white text-center">{testimonials.short}</h3>
                                <div className="mdl-card mdl-shadow--4dp p-20">
                                    <Admin editAction={"Testimonials"} authorized={authorized} />
                                    <div id="editor" className="editor">
                                        <p>
                                            <Editor
                                                editorState={EditorState.createWithContent(
                                                    testimonials.description ? convertFromRaw(JSON.parse(testimonials.description))
                                                        : convertFromRaw({ blocks: [{ text: '', type: 'unstyled', },], entityMap: { first: { type: 'TOKEN', mutability: 'MUTABLE', }, } }),
                                                    this.decorator,
                                                )}
                                                readOnly={true}
                                                ref="editor"
                                            />
                                        </p>
                                    </div>
                                </div>
                                <div className="col-2-masonry">
                                    {testimonials.testimonial_details.map(testimonial_details =>
                                        <div className="mdl-card mdl-shadow--4dp p-20 m-t-1-em tile-masonry bg-color-white">
                                            <ul className="mdl-list">
                                                <li>
                                                    <blockquote>{testimonial_details.testimonial}</blockquote>
                                                    <p>{testimonial_details.name}</p>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

TestimonialPage.propTypes = {
    testimonials: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        testimonials: state.testimonials,
        authorized: state.authToken
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(testimonialActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TestimonialPage);
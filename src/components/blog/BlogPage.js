import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as blogActions from '../../actions/blogActions';
import { Editor, EditorState, convertFromRaw } from 'draft-js';

class BlogPage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const { blog } = this.props;

        let blogImg = blog.image ? require(`../../images/${blog.image}`) : ""

        const blogImage = {
            backgroundImage: 'url(' + blogImg + ')',
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover"
        }

        return (
            <div className="mdl-grid dark-color">
                <div className="ribbon bg-image-landing b-border">
                    <div className="container p-t-4-em">
                        <div className="row m-b-1-em">
                            <div className="col-xs-12">
                                <h1 className="color-white text-center">{blog.title}</h1>
                                <div className="mdl-card mdl-shadow--4dp">
                                    <div className="mdl-card__media v-h-40 image-text-container" style={blogImage}>
                                        <div className="text-left align-bottom m-l-20 m-b-20">
                                            <header className="color-white">
                                                <h4 className="m-t-0 m-b-0"><strong>{blog.title}</strong></h4>
                                            </header>
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
                                        <div id="editor" className="editor">
                                            <p>
                                                <Editor
                                                    editorState={EditorState.createWithContent(
                                                        blog.description ? convertFromRaw(JSON.parse(blog.description))
                                                            : convertFromRaw({ blocks: [{ text: '', type: 'unstyled', },], entityMap: { first: { type: 'TOKEN', mutability: 'MUTABLE', }, } }),
                                                        this.decorator,
                                                    )}
                                                    readOnly={true}
                                                    ref="editor"
                                                />
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
    }
}

BlogPage.propTypes = {
    blog: PropTypes.object.isRequired,
    editorState: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    upload: PropTypes.object.isRequired,
    entityKey: PropTypes.object.isRequired,
};

BlogPage.contextTypes = {
    router: PropTypes.object
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
        blog: blog
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(blogActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogPage);
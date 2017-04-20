import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import MultilineText from '../common/MultilineText';
import { bindActionCreators } from 'redux';
import Admin from '../common/Admin';
import * as blogActions from '../../actions/blogActions';

class BlogPage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const { blogs } = this.props;
        const { authorized } = this.props;
        function blogImage(image) {
            let blogImg = image != "" ? require(`../../images/${image}`) : ""
            const styles = {
                blog: {
                    img: {
                        backgroundImage: 'url(' + blogImg + ')',
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover"
                    }
                }
            }
            return styles.blog.img
        }

        function previewText(short) {
            return short.substring(0, 500) + "...";
        }

        return (
            <div className="mdl-grid dark-color">
                <div className="container-fluid p-l-0 p-r-0 p-t-4-em color-blur">
                    <div className="ribbon bg-image-landing b-border">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-offset-1 col-sm-10 col-xs-12 m-b-1-em">
                                    <h1 className="text-center color-white">My Blog</h1>
                                    <Admin addAction={"Admin/Blog"} authorized={authorized} />
                                    <h2 className="text-center color-white">Read useful information on Yoga and Ayurveda</h2>
                                    <div className="responsive-col-masonry">
                                        {blogs.map(blog =>
                                            <div className="mdl-card mdl-shadow--4dp m-t-1-em tile-masonry bg-color-white">
                                                <Admin editAction={"Admin/" + blog.type + "/" + blog.id} authorized={authorized} />
                                                <div className="mdl-card__media bright-bg-color v-h-30 mdl-pos-rel" style={blogImage(blog.image)}>
                                                    <div className="p-l-1-em pull-left color-white align-bottom-left">
                                                        <p><strong>{blog.postDate} by <Link to="/about">Marie Mills</Link></strong></p>
                                                    </div>
                                                    <div className="p-r-1-em p-b-1-em pull-right color-white align-bottom-right">
                                                        <i className="glyphicon glyphicon-heart fa-lg" aria-hidden="true"></i> &nbsp;
                                                        <i className="glyphicon glyphicon-bookmark fa-lg" aria-hidden="true"></i> &nbsp;
                                                        <i className="fa fa-share-alt fa-lg" aria-hidden="true"></i>
                                                    </div>
                                                </div>
                                                <div className="mdl-card__title p-l-1-em p-r-1-em p-t-0 p-b-0">
                                                    <div className="mdl-card__title-text">
                                                        <section className="text-center">
                                                            <h2>{blog.title}</h2>
                                                        </section>
                                                    </div>
                                                </div>
                                                <div className="mdl-card__supporting-text p-l-1-em p-r-1-em">
                                                    <MultilineText multilineText={previewText(blog.short)} />
                                                </div>
                                                <div className="mdl-card__actions mdl-card--border">
                                                    <Link key={blog.id} to={'/' + blog.type + '/' + blog.id} className="dark-color btn btn-default btn-block" activeClassName="active">Read More</Link>
                                                </div>
                                            </div>
                                        )}
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
    blogs: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        blogs: state.blogs,
        authorized: state.authToken
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(blogActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogPage);
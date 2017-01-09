import React, { PropTypes } from 'react';
import { Link, IndexLink, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as blogActions from '../../actions/blogActions';
import Blog from '../blog/Blog';
import SocialMediaBar from '../common/SocialMediaBar';
import landing from '../../images/landing.jpg';
import yogaImg1 from '../../images/yogaImg1.jpg';
import yogaImg2 from '../../images/yogaImg2.jpg';
import yogaImg3 from '../../images/yogaImg3.jpg';


const landingImg = {
    backgroundImage: 'url(' + landing + ')',
    backgroundSize: 'cover',
    backgroundPosition: "center"
};

const divider = {
    backgroundImage: 'url(' + landing + ')',
    backgroundSize: 'cover',
    backgroundPosition: "center",
    height: "250px"
};

class HomePage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    blogTile(blog, index) {
        return <div key={index}>{blog.name}</div>
    }

    render() {
        const {blogs} = this.props;

        return (
            <div>
                <section style={landingImg} className="featured">
                    <div className="container-fluid">
                        <div className="row m-b-30">
                            <div className="col-md-6 col-md-offset-3 text-center bright-color anchor">
                                <h1 className="page-header banner">Yoga with Marie Mills</h1>
                                <h3>Bakers street, Thurles, Co. Tipperary<br />
                                    086 – 1778369 | <a className="color-white" href="mailto:marie@yogamariemills.com">marie@yogamariemills.com</a></h3>
                                <h4>
                                    Marie Mills is a Stress Reduction Specialist and Yoga practitioner in Thurles.
                                        Yoga and Ayurveda are integral to Traditional Indian Medicine and easily adapted
                                        to the modern life. Learn Yoga, Ayeruveda and more.
                                    </h4>
                                <div className="row text-center">
                                    <Link to="YogaThurles/Schedule">
                                        <button className="btn btn-default btn-lg btn-round-lg color-black">Find Yoga Classes</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="container-fluid bg-color">
                        <div className="container">
                            <div className="row text-center">
                                <div className="col-xs-4 p-t-40 p-b-40 p-l-15 p-r-15">
                                    <img className="img-circle img-responsive" src={yogaImg1} />
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <h4>Contemporary Ayeruveda</h4>
                                        </div>
                                    </div>
                                    <div className="col-xs-offset-2 col-xs-8">
                                        <hr />
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-12">

                                            <Link className="color" to="YogaThurlesSchedule">
                                                <p>Learn More</p>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-4 p-t-40 p-b-40 p-l-15 p-r-15">
                                    <img className="img-circle img-responsive" src={yogaImg2} />
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <h4>Yoga Workshops and Bespoke Yoga</h4>
                                        </div>
                                    </div>
                                    <div className="col-xs-offset-2 col-xs-8">
                                        <hr />
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <Link className="color" to="yogathurlescost">
                                                <p>Learn More</p>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-4 p-t-40 p-b-40 p-l-15 p-r-15">
                                    <img className="img-circle img-responsive" src={yogaImg3} />
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <h4>Dietary Consultation</h4>
                                        </div>
                                    </div>
                                    <div className="col-xs-offset-2 col-xs-8">
                                        <hr />
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <Link className="color" to="Contemporary">
                                                <p>Learn More</p>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="container-fluid light-bg-color">
                        <div className="row p-b-40 p-t-40">
                            <div className="col-md-6 col-md-offset-3">
                                <div className="text-center">
                                    <h2>
                                        Yoga with Marie Mills is a family friendly studio that offers a wide variety of classes and child care.
                                    </h2>
                                    <h4>
                                        No matter what stage of life you are in, Yoga with Marie Mills offers something for everyone.
                                        Yoga Marie Mills offers Yoga, Ayurveda, and Kids Yoga.
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="container-fluid p-l-0 p-r-0">
                    <div className="row" style={divider}>
                    </div>
                </div>
                <section>
                    <div className="container-fluid light-bg-color">
                        <div className="row p-t-40">
                            <div className="col-xs-offset-1 col-xs-10">
                                <h2 className="text-center">My Blog</h2>
                                {blogs.map(blog =>
                                    <Blog blog={blog} />)
                                }
                            </div>
                        </div>
                    </div>
                </section>
                <SocialMediaBar />
            </div >
        );
    }
}


HomePage.propTypes = {
    blogs: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
}

function mapStateToProps(state, ownProps) {
    return {
        blogs: state.blogs
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(blogActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

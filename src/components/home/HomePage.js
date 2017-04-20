<<<<<<< HEAD
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as blogActions from '../../actions/blogActions';
import BlogTile from '../blog/BlogTile';
import SocialMediaBar from '../common/SocialMediaBar';
import Footer from '../common/Footer';
import landing from '../../images/landing.jpg';
import yogaImg1 from '../../images/yogaImg1.jpg';
import yogaImg2 from '../../images/yogaImg2.jpg';
import yogaImg3 from '../../images/yogaImg3.jpg';


const landingImg = {
    backgroundImage: 'url(' + landing + ')',
    backgroundSize: 'cover',
    backgroundPosition: "center",
    height: "100%"
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
        return <div key={index}>{blog.title}</div>
    }

    render() {
        const { blogs } = this.props;

        return (
            <div className="container-fluid">
                <section style={landingImg} className="row p-3-em">
                    <div className="col-md-6 col-md-offset-3 text-center bright-color anchor ">
                        <h1 className="page-header">Yoga with Marie Mills</h1>
                        <h2 banner>
                            Stress Reduction Specialist
                                    </h2>
                        <h3>Bakers street, Thurles, Co. Tipperary<br />
                            086 – 1778369 | <a className="color-white" href="mailto:marie@yogamariemills.com">marie@yogamariemills.com</a></h3>
                        <div className="row text-center">
                            <Link to="YogaThurles/Schedule">
                                <button className="btn btn-default btn-lg btn-round color-black">Find Yoga Classes</button>
                            </Link>
                        </div>
                    </div>
                </section>
                <section className="t-border t-shadow row text-center p-3-em color-blur">
                    <div className="col-xs-offset-1 col-xs-10">
                        <h2>Marie is a Yoga practitioner in Thurles.</h2>
                        <div className="line-thru"><span>
                            <img src={require('../../images/greenlotus.png')} className="bg-color-transparent img-thru p-l-10 p-r-10" width="65" /></span>
                        </div>
                        <h3>Yoga and Ayurveda are integral to Traditional Indian Medicine and easily adapted
                                        to the modern life. Learn Yoga, Ayeruveda and more.</h3>
                        <div className="col-sm-4 col-xs-12 p-t-5 p-b-40 p-l-15 p-r-15">
                            <Link to="/Ayurveda/Massage/Body">
                                <div className="icon-circle mdl-shadow--4dp lotus-flower bg-color-purple"></div>
                            </Link>
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
                                    <Link className="color" to="/Ayurveda/Massage/Body">
                                        <p>Learn More</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4 col-xs-12 p-t-5 p-b-40 p-l-15 p-r-15">
                            <Link to="/YogaThurles/Schedule">
                                <div className="icon-circle mdl-shadow--4dp om bright-bg-color"></div>
                            </Link>
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
                                    <Link className="color" to="/YogaThurles/Schedule">
                                        <p>Learn More</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4 col-xs-12 p-t-5 p-b-40 p-l-15 p-r-15">
                            <Link to="/Ayurveda/DietConsultation">
                                <div className="icon-circle mdl-shadow--4dp yoga-mat bg-color-green"></div>
                            </Link>
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
                                    <Link className="color" to="/Ayurveda/DietConsultation">
                                        <p>Learn More</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="t-border t-shadow row" style={divider}>
                </section>
                <section className="row bg-color-transparent t-border t-shadow p-3-em color-blur">
                    <div className="col-xs-12 col-sm-10 col-sm-offset-1">
                        <h2 className="text-center">Specialties</h2>
                        <div className="text-center">
                            <h4>
                                Yoga with Marie Mills is a family friendly studio that offers a wide variety of classes and child care.
                                        No matter what stage of life you are in, Yoga with Marie Mills offers something for everyone.
                                        Yoga Marie Mills offers Yoga, Ayurveda, and Kids Yoga.
                                    </h4>
                        </div>
                        <div className="row m-t-1-em p-t-40 p-b-40 text-center">
                            <div className="col-sm-4 col-xs-12 p-l-15 p-r-15">
                                <Link to="/Ayurveda/Massage/Body">
                                    <img className="img-circle img-responsive center-block mdl-shadow--4dp" src={yogaImg1} />
                                </Link>
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
                            <div className="col-sm-4 col-xs-12 p-l-15 p-r-15">
                                <Link to="/YogaThurles/Schedule">
                                    <img className="img-circle img-responsive center-block mdl-shadow--4dp" src={yogaImg2} />
                                </Link>
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
                            <div className="col-sm-4 col-xs-12 p-l-15 p-r-15">
                                <Link to="/Ayurveda/DietConsultation">
                                    <img className="img-circle img-responsive center-block mdl-shadow--4dp" src={yogaImg3} />
                                </Link>
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
                </section>
                <section className="row p-t-40 p-b-40 row-center bg-color color-white t-border t-shadow">
                    <div className="col-xs-12 col-sm-offset-1 col-sm-10">
                        <h2 className="text-center">My Blog</h2>
                        <p className="text-center">Read useful information on Yoga and Ayurveda</p>
                        <div className="responsive-col-masonry">
                            {blogs.map(blog =>
                                <BlogTile blog={blog} />)
                            }
                        </div>
                    </div>
                </section>
                <section className="row bg-color-white p-t-30 p-b-30">
                    <p className="footer text-center">Share, Like, and Heart my Story!</p>
                    <SocialMediaBar />
                </section>
                <section className="row">
                    <Footer />
                </section>
            </div>
        );
    }
}


HomePage.propTypes = {
    blogs: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
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
=======
import React, {PropTypes} from 'react';
import { Link, IndexLink, browserHistory } from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as blogActions from '../../actions/blogActions';
import Blog from '../blog/Blog';
import SocialMediaBar from '../common/SocialMediaBar';
import RaisedButton from 'material-ui/RaisedButton';
import landing from '../../images/landing.jpg';


const landingImg = {
    backgroundImage: 'url(' + landing + ')',
    backgroundSize: 'cover',
    backgroundPosition: "center"
};

const rounded = {
    borderRadius: 22.5
};

class HomePage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.redirectToBlogPage = this.redirectToBlogPage.bind(this);
    }

    blogTile(blog, index) {
        return <div key={index}>{blog.name}</div>
    }

    redirectToBlogPage() {
        browserHistory.push(`/ {blog.name}`);
    }
    render() {
        const {blogs} = this.props;

        return (
            <div>
                
            <section style={landingImg} className="featured">
                <div className="container-fluid">
                    <div className="row m-b-40">
                        <div className="col-md-6 col-md-offset-3">
                            <div className="text-center">
                                <i className="m-b-20"></i>
                                <h1 className="page-header banner">Yoga with Marie Mills</h1>
                                <h4>
                                    Marie Mills is a Stress Reduction Specialist and Yoga practitioner in Thurles.
                                    Yoga and Ayurveda are integral to Traditional Indian Medicine and easily adapted
                                    to the modern life. Learn Yoga, Ayeruveda and more
                                </h4>
                                <div className="row text-center">
                                        <Link to="about"><RaisedButton label="My Work" /></Link>
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
            <section>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xs-offset-1 col-xs-10">
                        {blogs.map(blog =>
                            <Blog blog={blog}/>)
                        }
                        </div>
                     </div>
                </div>
            </section>
            <SocialMediaBar />
            </div>
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
>>>>>>> ee298d412f7c57384fc49ab52017ec591ac91596

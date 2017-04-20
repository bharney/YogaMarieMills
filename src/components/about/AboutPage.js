<<<<<<< HEAD
import React from 'react';
import { Link } from 'react-router';
import profileSmall from '../../images/Profile204x300.jpg';
import profileLarge from '../../images/Profile400x589.jpg';
import SocialMediaBar from '../common/SocialMediaBar';


class AboutPage extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {

        return (
            <div className="container-fluid p-l-0 p-r-0 p-t-3-em">
                <div className="ribbon bg-image-landing b-border">
                    <div className="container p-2-em">
                        <div className="row color-white">
                            <div className="col-xs-12 col-sm-7">
                                <h2 className="m-b-0 p-b-0"><strong>Marie Mills Yoga and Ayurveda</strong></h2>
                                <h4 className="m-t-0 m-b-0 p-t-0">Stress Reduction Specialist</h4>
                            </div>
                            <div className="m-t-1-em col-xs-12 col-sm-5">
                                <div className="pull-right">
                                    <SocialMediaBar />
                                    <h4 className="m-b-1-em m-t-0 p-t-0 p-r-15 text-right">+086 1778369</h4>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xs-12">
                                <div className="mdl-card p-l-0 p-r-0 container m-t-1-em m-b-1-em mdl-shadow--4dp">
                                    <div className="row m-l-0 m-r-0 lg-vertical-center">
                                        <div className="color-white text-center m-l-0 p-l-0">
                                            <div className="profile-image max-w-245 xs-profile">
                                                <img src={profileLarge} className="img-responsive hidden-xs" alt="Marie Mills Yoga Instructor and Owner" />
                                                <img src={profileSmall} className="img-responsive img-circle visible-xs" alt="Marie Mills Yoga Instructor and Owner" />
                                                <div className="profile-text text-left align-bottom m-l-10">
                                                    <h3 className="m-t-0 m-b-0">Marie Mills</h3>
                                                    <p className="m-t-0 m-b-5">Owner and Instructor</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xs-12 text-center pull-right">
                                            <h4 className="text-left p-l-30 p-r-30 m-t-5">
                                                <strong>About Marie:</strong>
                                                <hr />
                                                <div className="text-center">Twelve years teaching Hatha Yoga, meditation, mindfulness techniques and
                                    stress relief for all ages. And also nine years using Ayurveda medicine
                                    with clients and students to find balance in these unbalancing times.</div>
                                            </h4>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
                <div className="container-fluid color-blur">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="text-center color-white p-t-1-em p-b-1-em">
                                    <blockquote className="bigquote no-left-border">All of life is an individual manifestation and
                                    combination of the five elements. It really doesn't get
                                    any easier! As a wise friend of mine once said, 'If it's not fun,
                                    it's not Yoga, and if it's not simple, it's not Ayurveda.
                                                        </blockquote>
                                    <p className="col-lg-offset-6">
                                        Marie Mills
                                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="section-header">
                                <h2 className="text-center">Contact Marie Mills</h2>
                            </div>

                            <div className="col-xs-12">
                                <div className="mdl-card p-1-em mdl-shadow--4dp">
                                    <div className="featured clearfix text-center">
                                        <div className="row dark-color">
                                            <div className="col-xs-12">
                                                <p>
                                                    <br />
                                                    <Link title="Yoga" className="schedule dark-color" to="http://yogamariemills.com/thurles-className-schedule/" target="_blank">Yoga</Link> and <Link title="Ayurveda massage treatments" className="ayurveda dark-color" to="http://yogamariemills.com/ayurveda-massage-treatments/" target="_blank">
                                                        Ayurveda's wisdom is in its simplicity
                                                            </Link>
                                                </p>
                                                <ul className="list-unstyled">
                                                    <li>Contact me for a Yoga className or Ayurvedic consultation or treatment</li>
                                                    <li>Phone: 086 1778369</li>
                                                    <li><Link to="mailto:marie@yogamariemills.com">marie@yogamariemills.com</Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <fieldset className="container m-b-1-em">
                        <div className="row">
                            <div className="col-xs-12 text-center">
                                <h3 className="text-center">You can also email me using the form below</h3>
                                <hr />
                                <form action="/" method="post">
                                    <div className="col-lg-4 col-sm-4 col-xs-12 m-b-05-em">
                                        <input required type="text" name="Name" className="form-control form-group" placeholder="Name" />
                                    </div>
                                    <div className="col-lg-4 col-sm-4 col-xs-12">
                                        <input type="email" name="EmailAddress" className="form-control form-group" placeholder="Email" />
                                    </div>
                                    <div className="col-lg-4 col-sm-4 col-xs-12">
                                        <input type="text" name="Phone" className="form-control form-group" placeholder="Phone" />
                                    </div>
                                    <div className="col-lg-12 col-xs-12">
                                        <textarea name="Message" spellcheck="true" className="form-control form-group" rows="8" placeholder="Your message here..."></textarea>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-sm-offset-4 col-sm-4 col-xs-12">
                            <div className="btn btn-success btn-lg btn-block center-block mdl-shadow--4dp">
                                <Link to="" className="dark-color m-b-1-em" activeClassName="active"><span>Send <i className="glyphicon glyphicon-send"></i></span></Link>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
        );
    }
}

export default AboutPage;
=======
import React, {PropTypes} from 'react';
import { Link, IndexLink, browserHistory } from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as navbarActions from '../../actions/navbarActions';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import {ToolbarGroup, Toolbar} from 'material-ui/Toolbar';
import Drawer from 'material-ui/Drawer';
import profile from '../../images/Profile204x300.jpg';

const styles = {
   
}

class AboutPage extends React.Component {

    constructor(props, context) { 
        super(props, context);
    }

    render() {
    const {navbar_items} = this.props;

    return (
    <div className="mdl-grid dark-color bg-color">
        <div className="ribbon bright-bg-color">
            <div id="about" div className="mdl-card container m-t-30 m-b-30 mdl-shadow--4dp">
                <div className="featured clearfix text-center">
                    <h1>Marie's Yoga and Ayurveda</h1>
                    <hr className="col-xs-offset-3 col-xs-6" />
                    <div className="row">
                        <div className="col-xs-offset-1 col-xs-10">
                            <div className="col-xs-12">
                                <p>As time moves on, some things change, and some stay the same, I am now:
                                    <br/><br/>
                                    Twelve years teaching Hatha Yoga, meditation, mindfulness techniques and
                                    stress relief for all ages. And also nine years using Ayurveda medicine
                                    with clients and students to find balance in these unbalancing times.
                                </p>
                            </div>
                            <section id="section-about" className="section appear">
                                <div className="col-lg-offset-2 col-lg-8">
                                    <div className="section-header text-center">
                                        <h2 className="section-heading">Marie Mills</h2>
                                    </div>
                                    <div className="row align-center m-b-40">
                                        <div className="col-xs-offset-1 col-xs-10">
                                            <figure className="member-photo">
                                                <img className="img-circle" src={profile} alt="Marie Mills Yoga Instructor and Owner" />
                                            </figure>
                                            <br/>
                                            <p>Owner and Instructor</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section className="section">
                                    <div className="row">
                                        <div className="col-lg-offset-2 col-lg-8">
                                        
                                <div className="text-center p-t-40 p-b-40">
                                    <blockquote className="bigquote color-white">
                                        All of life is an individual manifestation and 
                                        combination of the five elements. It really doesn't get
                                        any easier! As a wise friend of mine once said, 'If it's not fun,
                                        it's not Yoga, and if it's not simple, it's not Ayurveda.
                                    </blockquote>
                                    <p className="col-lg-offset-6 color-white">
                                        Marie Mills
                                    </p>
                                </div>
                                            </div>
                                         </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
                            
            <div id="work" div className="mdl-card container m-t-30 m-b-30 mdl-shadow--4dp">
                 <div className="featured clearfix text-center">
                    <div className="row dark-color">
                       <div className="col-xs-12 m-b-30 m-t-30">
                          <div className="col-xs-12">                 
                            <section>
                                <div className="row m-b-30">
                                    <div className="col-xs-12">
                                        <div className="section-header">
                                            <h2 className="section-heading text-center">Current Work</h2>
                                            <hr />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12 m-b-40 text-center">
                                            <div className="portfolio-items" id="3">
                                                {navbar_items.map(item =>
                                                <Link key={item.route} to={'/' + item.route} className="dark-color text-center">
                                                <div className="col-xs-3">{item.name}</div>
                                                    <div className="portfolio-item">
                                                        <img src="img/portfolio/img1.jpg" alt="" />
                                                        <div className="portfolio-desc align-center">
                                                            <div className="folio-info">
                                                                <h5><a href="#">Portfolio name</a></h5>
                                                                <a href="img/portfolio/img1.jpg" className="fancybox"><i className="fa fa-plus fa-2x"></i></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                               </Link>
                                                )}
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </section>
                                <section>
                                   <div className="row">
                                      <div className="col-lg-12">
                                         <div className="text-center p-t-40 p-b-40">
                                            <blockquote className="bigquote color-white">There are only two choices, to be the Candle or the Mirror which reflects it</blockquote>
                                            <p className="col-lg-offset-6 color-white">Edith Wharton</p>
                                         </div>
                                      </div>
                                   </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

                <div id="questions" className="mdl-card container m-t-30 m-b-30 mdl-shadow--4dp">
                     <div className="featured clearfix text-center">
                        <div className="row dark-color">
                           <div className="col-xs-offset-1 col-xs-10">
                              <div className="col-xs-12 m-b-30 m-t-30">
                                <section>
                                    <fieldset>
                                            <div className="section-header">
                                        <h2 className="text-center">Contact Marie Mills</h2>
                                                </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-lg-12 col-md-12 col-xs-12 text-center">
                                                <p>
                                                    <br/>
                                                    <Link title="Yoga" className="schedule dark-color" to="http://yogamariemills.com/thurles-className-schedule/" target="_blank">Yoga</Link> and
                                                    <Link title="Ayurveda massage treatments" className="ayurveda dark-color" to="http://yogamariemills.com/ayurveda-massage-treatments/" target="_blank">Ayurveda's wisdom is in its simplicity</Link>
                                                </p>
                                                <ul className="list-unstyled">
                                                    <li>Contact me for a Yoga className or Ayurvedic consultation or treatment</li>
                                                    <li>Phone: 086 1778369</li>
                                                    <li><Link to="mailto:marie@yogamariemills.com">marie@yogamariemills.com</Link></li>
                                                </ul>
                                                <h3 className="text-center">You can also email me using the form below</h3>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="row">
                                            <div className="col-lg-10 col-lg-offset-1 col-xs-12 text-center">
                                                <form action="/" method="post">
                                                    <div className="col-lg-4 col-sm-4 col-xs-12 m-b-10">
                                                        <input required type="text" name="Name" className="form-control form-group" placeholder="Name" />
                                                    </div>
                                                    <div className="col-lg-4 col-sm-4 col-xs-12">
                                                        <input type="email" name="EmailAddress" className="form-control form-group" placeholder="Email" />
                                                    </div>
                                                    <div className="col-lg-4 col-sm-4 col-xs-12">
                                                        <input type="text" name="Phone" className="form-control form-group" placeholder="Phone" />
                                                    </div>
                                                    <div className="col-lg-12 col-xs-12">
                                                        <textarea style={styles.Message} name="Message" spellcheck="true" className="form-control form-group" rows="8" placeholder="Your message here..."></textarea>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                        <div className="mdl-card__actions mdl-card--border">
                                            <div className="col-xs-offset-4 col-xs-4">
                                                <div className="btn btn-warning btn-lg btn-block center-block">
                                                    <Link to="" className="dark-color m-b-30" activeClassName="active"><span>Send <i className="glyphicon glyphicon-send"></i></span></Link>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                </section>       
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

AboutPage.propTypes = {
    navbar_items: PropTypes.array.isRequired
};


function mapStateToProps(state, ownProps) {
    return {
        navbar_items: state.navbar_items
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(navbarActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutPage);
>>>>>>> ee298d412f7c57384fc49ab52017ec591ac91596

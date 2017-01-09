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

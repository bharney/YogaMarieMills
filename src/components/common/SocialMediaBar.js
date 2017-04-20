import React from 'react';
import { Link } from 'react-router';

class SocialMediaBar extends React.Component {

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xs-12">
                        <ul className="list-unstyled text-center list-inline alignleft social-media">
                            <li className="social-email">
                                <Link to="mailto:marie@yogamariemills.com" className="fa fa-envelope-open fa-2x" activeClassName="active" target="_blank"></Link>
                            </li>
                            <li className="social-facebook">
                                <Link to="//www.facebook.com/YogaAyurvedaMarieMills" className="fa fa-facebook-square fa-2x" aria-hidden="true" activeClassName="active" target="_blank"></Link>
                            </li>
                            <li className="social-gplus">
                                <Link to="//plus.google.com/u/0/+Yogamariemills157/posts" className="fa fa-google-plus fa-2x" aria-hidden="true" activeClassName="active" target="_blank"></Link>
                            </li>
                            <li className="social-instagram">
                                <Link to="//instagram.com/yogamariemills" className="fa fa-instagram fa-2x" aria-hidden="true" activeClassName="active" target="_blank"></Link>
                            </li>
                            <li className="social-linkedin">
                                <Link to="//www.linkedin.com/pub/marie-mills/20/a6/192" className="fa fa-linkedin-square fa-2x" aria-hidden="true" activeClassName="active" target="_blank"></Link>
                            </li>
                            <li className="social-twitter">
                                <Link to="//twitter.com/yogamariemills" className="fa fa-twitter-square fa-2x" aria-hidden="true" activeClassName="active" target="_blank"></Link>
                            </li>
                            <li className="social-youtube">
                                <Link to="//www.youtube.com/channel/UCZdWvhVg_nrEHpaiBxgRQAQ" className="fa fa-youtube-square fa-2x" activeClassName="active" target="_blank"></Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default SocialMediaBar;

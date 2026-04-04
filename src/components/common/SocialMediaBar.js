import React from 'react';

class SocialMediaBar extends React.Component {

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <ul className="list-unstyled text-center list-inline alignleft social-media">
                            <li className="social-email">
                                <a href="mailto:marie@yogamariemills.com" className="fa fa-envelope-open fa-2x" target="_blank" rel="noreferrer"></a>
                            </li>
                            <li className="social-facebook">
                                <a href="https://www.facebook.com/YogaAyurvedaMarieMills" className="fa fa-facebook-square fa-2x" aria-hidden="true" target="_blank" rel="noreferrer"></a>
                            </li>
                            <li className="social-gplus">
                                <a href="https://plus.google.com/u/0/+Yogamariemills157/posts" className="fa fa-google-plus fa-2x" aria-hidden="true" target="_blank" rel="noreferrer"></a>
                            </li>
                            <li className="social-instagram">
                                <a href="https://instagram.com/yogamariemills" className="fa fa-instagram fa-2x" aria-hidden="true" target="_blank" rel="noreferrer"></a>
                            </li>
                            <li className="social-linkedin">
                                <a href="https://www.linkedin.com/pub/marie-mills/20/a6/192" className="fa fa-linkedin-square fa-2x" aria-hidden="true" target="_blank" rel="noreferrer"></a>
                            </li>
                            <li className="social-twitter">
                                <a href="https://twitter.com/yogamariemills" className="fa fa-twitter-square fa-2x" aria-hidden="true" target="_blank" rel="noreferrer"></a>
                            </li>
                            <li className="social-youtube">
                                <a href="https://www.youtube.com/channel/UCZdWvhVg_nrEHpaiBxgRQAQ" className="fa fa-youtube-square fa-2x" target="_blank" rel="noreferrer"></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default SocialMediaBar;

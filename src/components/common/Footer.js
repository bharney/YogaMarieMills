import React from 'react';
import Login from '../common/Login';

class Footer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false
        };
    }

    render() {

        return (
            <footer>
                <div className="container-fluid light-bg-color p-2-em">
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 text-center">
                            <span>
                                <p className="m-0">
                                    Marie Mills &nbsp; | &nbsp; <i className="fa fa-phone" aria-hidden="true"></i> 086-1778369 &nbsp; | &nbsp;
                            <a href="mailto:marie@yogamariemills.com" target="_top"><i className="fa fa-envelope" aria-hidden="true"></i> marie@yogamariemills.com</a></p>
                            </span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 text-center">
                            <span>
                                <p className="m-0 m-t-1-em">
                                    <a href="http://www.http://yogamariemills.com">Copyright @ {new Date().getFullYear()} Yoga Marie Mills</a> &nbsp; | &nbsp;
                                <Login/>
                                </p>
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;
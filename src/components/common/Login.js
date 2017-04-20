import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authTokenActions from '../../actions/authTokenActions';

class Login extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.Logout = this.Logout.bind(this);
    }

    Logout(event) {
        event.preventDefault();
        this.props.actions.logOut();
        this.setState();
    }

    render() {
        const { login } = this.props;
        let that = this;
        function LoginOut(login) {
            if (!login.authToken) 
                return <Link to={`/Login`}>Login</Link>

                return <Link to="" className="hover" onClick={that.Logout}>Logout</Link>
        }
        return (
            <span>{LoginOut(login)}</span>
        );
    }
}

Login.propTypes = {
    login: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};

Login.contextTypes = {
    router: PropTypes.object
};

function mapStateToProps(state) {
    return {
        login: state.authToken
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(authTokenActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

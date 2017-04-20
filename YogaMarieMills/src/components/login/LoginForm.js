import React from 'react';
import PasswordInput from '../common/PasswordInput';
import EmailInput from '../common/EmailInput';
import ErrorMessages from '../common/ErrorMessages';

const LoginForm = ({ login, loginRequest, onChange, loading, errors, errorMessage }) => {
  return (
    <div className="mdl-grid dark-color bg-color">
      <div className="ribbon bg-image-landing b-border">
        <div className="container-fluid">
          <div className="row m-b-1-em">
            <h1 className="text-center color-white">Login</h1>
            <hr width="50%" className="center-block" />
            <div className="col-xs-12 col-sm-offset-3 col-sm-6 col-md-offset-3 col-md-6 col-lg-offset-4 col-lg-4 m-b-1-em m-t-1-em">
              <div className="mdl-card mdl-shadow--4dp p-login">
                <form>
                  <ErrorMessages errorMessage={errorMessage} />
                  <EmailInput
                    name="emailAddress"
                    label="Email"
                    placeholder="Email"
                    value={login.emailAddress}
                    onChange={onChange}
                    error={errors.email} />
                  <PasswordInput
                    name="password"
                    label="Password"
                    placeholder="Password"
                    value={login.password}
                    onChange={onChange}
                    error={errors.password} />
                  <button
                    type="submit"
                    disabled={loading}
                    value={loading ? 'Logging in...' : 'Log In'}
                    className="btn btn-primary pull-right"
                    onClick={loginRequest}>Log In</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

LoginForm.propTypes = {
  login: React.PropTypes.object.isRequired,
  authenticateLogin: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  loading: React.PropTypes.bool,
  errors: React.PropTypes.object
};

export default LoginForm;

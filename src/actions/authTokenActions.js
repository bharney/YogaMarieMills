import loginApi from '../API/LoginApi';
import { browserHistory } from 'react-router';

let storage = window.localStorage;
let cachedToken;
let userToken = 'userToken';

export function loginSuccess(authToken) {
  cachedToken = authToken;
  storage.setItem(userToken, authToken);
  return { type: 'IS_AUTHENTICATED', authToken };
}

export function loginError(error) {
  return { type: 'NOT_AUTHENTICATED', error };
}

export function logOutSuccess() {
  cachedToken = null;
  storage.removeItem(userToken);
  const error = {message: "logged out sucessfully."};
  return { type: 'NOT_AUTHENTICATED', error };
}

export function loginRequest(login) {
  return function (dispatch) {
    return loginApi.loginRequest(login).then(loginResponse => {
      if (loginResponse.token) {
        dispatch(loginSuccess(JSON.stringify(loginResponse)))
        browserHistory.push('/')
      }
      else {
        dispatch(loginError(loginResponse));
      }
    }).catch(error => {
      throw (error);
    });
  };
}

export function authenticate() {
  return function (dispatch) {
    if (!cachedToken)
      cachedToken = storage.getItem(userToken);
    return new Promise((resolve) => {
      if (cachedToken) {
        dispatch(loginSuccess(cachedToken))
        resolve(cachedToken);
      }
      else {
        dispatch(loginError(''));
        resolve('Access not Authorized');
      }
    });
  };
}

export function getToken() {
  if (!cachedToken)
    cachedToken = storage.getItem(userToken);

  return cachedToken;
}

export function logOut() {
  return function (dispatch) {
    return dispatch(logOutSuccess())
  };
}
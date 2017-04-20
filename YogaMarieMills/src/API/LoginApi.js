import 'whatwg-fetch'

class LoginApi {
    static loginRequest(login) {
        login = Object.assign({}, login);
        return new Promise((resolve) => {
            if (login.emailAddress && login.password) {
                fetch('http://localhost:3000/api/login', {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(login)
                }).then(function (response) {
                    return response.json();
                }).then(function (login) {
                    resolve(login);
                }).catch(function (error) {
                    console.log('Request failed', error);
                });
            }
        });
    }
}

export default LoginApi;
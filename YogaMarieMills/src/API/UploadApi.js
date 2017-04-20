import 'whatwg-fetch'
import { getToken } from '../actions/authTokenActions';

class UploadApi {
    static uploadFile(file) {
        let data = new FormData()
        data.append('file', file)
        return new Promise((resolve) => {
            fetch('http://localhost:3000/api/uploads', {
                method: 'post',
                headers: {
                    'Authorization': 'Bearer ' + getToken()
                },
                body: data
            }).then(function (response) {
                resolve(response)
            }).catch(function (error) {
                console.log('Request failed', error);
            });
        });
    }
}

export default UploadApi;
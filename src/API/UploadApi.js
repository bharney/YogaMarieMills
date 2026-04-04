import { getToken } from '../actions/authTokenActions';

class UploadApi {
    static uploadFile(file) {
        let data = new FormData();
        data.append('file', file);
        return new Promise((resolve) => {
            fetch('/api/uploads', {
                method: 'post',
                headers: {
                    'Authorization': 'Bearer ' + getToken()
                },
                body: data
            }).then(function (response) {
                if (!response.ok) {
                    throw new Error(`Upload failed with status ${response.status}`);
                }

                return response.json();
            }).then(function (uploadedFile) {
                resolve(uploadedFile);
            }).catch(function (error) {
                console.log('Request failed', error);
                throw error;
            });
        });
    }
}

export default UploadApi;

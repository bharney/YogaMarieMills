import uploadApi from '../API/UploadApi';

export function uploadFileSuccess(file) {
  return {type: 'UPLOAD_FILE_SUCCESS', file};
}

export function uploadFile(file) {
    return function (dispatch) {
      return uploadApi.uploadFile(file).then(fileUploaded => {
        dispatch(uploadFileSuccess(fileUploaded));
    }).catch(error => {
      throw(error);
    });
  };
}

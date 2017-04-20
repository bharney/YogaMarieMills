import React from 'react';

const ImageUpload = ({uploadImage}) => {
        return (
            <div className="previewComponent">
                <label for="upload-photo" className="btn btn-info btn-circle-lg" title="Change Image">
                    <i className="p-t-3 glyphicon glyphicon-camera"></i>
                    <input type="file" id="upload-photo" accept="image/*" onChange={(e) => uploadImage(e)} title="Change Image"></input>
                </label>
            </div>
        );
    }


export default ImageUpload;
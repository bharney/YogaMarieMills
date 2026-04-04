import React from 'react';
import { Link } from 'react-router';
import ImageUpload from './ImageUpload';

const Admin = ({ uploadImage, saveAction, deleteAction, addAction, editAction, authorized }) => {
    const isAuthorized = authorized && authorized.authToken;
    return (
        <div className="absolute top-15-right-1 admin-button-stack">
            {isAuthorized && addAction ?
                <div className="admin-button-item">
                   <Link to={'/' + addAction} className="admin-action-link" >
                        <button type="button" className="btn btn-success btn-circle-lg" title="Add Record"><i className="glyphicon glyphicon-plus"></i></button>
                    </Link>
                </div>
            : ''}
            {isAuthorized && editAction ?
                <div className="admin-button-item">
                   <Link to={'/' + editAction}>
                        <button type="button" className="btn btn-primary btn-circle-lg" title="Edit"><i className="glyphicon glyphicon-pencil"></i></button>
                    </Link>
                </div>
            : ''}
            {isAuthorized && saveAction ?
                <div className="admin-button-item">
                   <button type="button" className="btn btn-success btn-circle-lg" onClick={saveAction} title="Save"><i className="glyphicon glyphicon-ok"></i></button>
                </div>
            : ''}
            {isAuthorized && uploadImage ?
                <div className="admin-button-item">
                   <ImageUpload uploadImage={uploadImage} />
                </div>
            : ''}
            {isAuthorized && deleteAction ?
                <div className="admin-button-item">
                   <button type="button" className="btn btn-danger btn-circle-lg" onClick={deleteAction} title="Delete Record"><i className="glyphicon glyphicon-remove"></i></button>
                </div>
            : ''}
        </div>
    );
}

export default Admin;

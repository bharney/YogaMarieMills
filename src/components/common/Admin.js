import React from 'react';
import { Link } from 'react-router';
import ImageUpload from './ImageUpload';

const Admin = ({ uploadImage, saveAction, deleteAction, addAction, editAction, authorized }) => {
    return (
        <div className="absolute top-15-right-1">
            {authorized.authToken && addAction ? 
                <div className="relative m-t-5">
                   <a href={'/' + addAction} className="fixed top-10" >
                        <button type="button" className="relative m-t-5 btn btn-success btn-circle-lg" title="Add Record"><i className="glyphicon glyphicon-plus"></i></button>
                    </a>
                </div>
            : ''}
            {authorized.authToken && editAction ? 
                <div className="relative m-t-5">
                   <Link to={'/' + editAction}>
                        <button type="button" className="btn btn-primary btn-circle-lg" title="Edit"><i className="glyphicon glyphicon-pencil"></i></button>
                    </Link>
                </div>
            : ''}
            {authorized.authToken && saveAction ? 
                <div className="relative m-t-5">
                   <button type="button" className="btn btn-success btn-circle-lg" onClick={saveAction} title="Save"><i className="glyphicon glyphicon-ok"></i></button>
                </div>
            : ''}
            {authorized.authToken && uploadImage ? 
                <div className="relative m-t-5">
                   <ImageUpload uploadImage={uploadImage} />
                </div>
            : ''}
            {authorized.authToken && deleteAction ? 
                <div className="relative m-t-5">
                   <button type="button" className="btn btn-danger btn-circle-lg" onClick={deleteAction} title="Delete Record"><i className="glyphicon glyphicon-remove"></i></button>
                </div>
            : ''}
        </div>
    );
}

export default Admin;
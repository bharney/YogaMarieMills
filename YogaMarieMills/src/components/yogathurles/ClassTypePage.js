import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as classTypesActions from '../../actions/classTypesActions';
import { Editor, EditorState, convertFromRaw } from 'draft-js';



class ClassTypePage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const { classType } = this.props;

        let classTypeImg = classType.image != "" ? require(`../../images/${classType.image}`) : ""

        const classTypeImage = {
            backgroundImage: 'url(' + classTypeImg + ')',
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover"
        }

        return (
            <div className="mdl-grid dark-color">
                <div className="ribbon bg-image-landing b-border">
                    <div className="container">
                        <div className="row m-b-1-em">
                            <div key={classType.id} className="col-xs-12">
                                <h1 className="color-white text-center">{classType.title}</h1>
                                <hr />
                                <div className="col-xs-12 m-b-1-em">
                                    <div className="mdl-card mdl-shadow--4dp">
                                        <div className="mdl-card__media v-h-40 image-text-container" style={classTypeImage}>
                                            <div className="text-left align-bottom m-l-20 m-b-20">
                                                <header className="color-white">
                                                    <h4 className="m-t-0 m-b-0"><strong>{classType.title}</strong></h4>
                                                </header>
                                            </div>
                                        </div>
                                        <div className="col-xs-12 t-border-thin p-20">
                                            <div id="editor" className="editor">
                                                    <p>
                                                        <Editor
                                                            editorState={EditorState.createWithContent(
                                                                classType.description ? convertFromRaw(JSON.parse(classType.description))
                                                                    : convertFromRaw({ blocks: [{ text: '', type: 'unstyled', },], entityMap: { first: { type: 'TOKEN', mutability: 'MUTABLE', }, } }),
                                                                this.decorator,
                                                            )}
                                                            readOnly={true}
                                                            ref="editor"
                                                        />
                                                    </p>
                                                </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ClassTypePage.propTypes = {
    classType: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};

function getClassTypeById(classTypes, id) {
    const classType = classTypes.filter(classType => classType.id == id);
    if (classType.length) {
        return classType[0];
    }

    return null;
}

function mapStateToProps(state, ownProps) {
    const classTypeId = ownProps.params.id;
    let classType = { id: '', name: '', image: '', description: '', href: '', route: '', component: '' };
    if (classTypeId && state.classTypes.length > 0) {
        classType = getClassTypeById(state.classTypes, classTypeId);
    }

    return {
        classType: classType
    };
}


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(classTypesActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassTypePage);

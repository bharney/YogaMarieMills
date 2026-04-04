import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as classTypesActions from '../../actions/classTypesActions';
import Admin from '../common/Admin';
import MultilineText from '../common/MultilineText';

class ClassTypesPage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        if (!this.props.classTypes || this.props.classTypes.length === 0) {
            this.props.actions.loadClassTypes();
        }
    }

    render() {
        const { classTypes } = this.props;
        const { authorized } = this.props;
        function classTypeImage(image) {
            let backgroundImg = "";

            if (image) {
                try {
                    backgroundImg = require(`../../images/${image}`);
                } catch (error) {
                    backgroundImg = `/images/${encodeURIComponent(image)}`;
                }
            }

            const imageStyle = {
                backgroundImage: backgroundImg ? `url("${backgroundImg}")` : 'none',
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover"
            }
            return imageStyle
        }

        function previewText(short) {
            return short.substring(0, 500) + "...";
        }
        let alternateTileSides = function (classTypes, classType, authorized) {
            const classTypeRoute = classType.route && classType.id
                ? `/${String(classType.route).replace(/^\/+/, '')}/${classType.id}`
                : null;
            if (classType.title)
                if (classTypes.findIndex(i => i.id == classType.id) % 2 == 0) {
                    return (
                        <div key={classType.id} className="v-align-middle clear-cols bg-color-white">
                            <div className="flex-col tile-col col-12 col-sm-6 p-l-0 p-r-0">
                                <div className="v-align-flex" style={classTypeImage(classType.image)} >
                                    <div className="place-holder-col">
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-col tile-col col-12 col-sm-6 p-l-0 p-r-0">
                                <div className="v-align-flex p-2-em">
                                    <Admin editAction={classType.type + "/" + classType.id} authorized={authorized} />
                                    <h2 className="page-header">{classType.title}</h2>
                                    <div>
                                        <MultilineText multilineText={previewText(classType.short)} />
                                    </div>
                                    {classTypeRoute ? <Link to={classTypeRoute}>
                                        <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect">
                                            Read More
                            <span className="mdl-button__ripple-container">
                                                <span className="mdl-ripple">
                                                </span>
                                            </span>
                                        </button>
                                    </Link> : null}
                                </div>
                            </div>
                        </div>
                    );
                }
                else {
                    return (
                        <div key={classType.id} className="v-align-middle clear-cols bg-color-white">
                            <div className="flex-col tile-col col-12 col-sm-6 p-l-0 p-r-0">
                                <div className="v-align-flex p-2-em">
                                    <Admin editAction={classType.type + "/" + classType.id} authorized={authorized} />
                                    <h2 className="page-header">{classType.title}</h2>
                                    <div>
                                        <MultilineText multilineText={previewText(classType.short)} />
                                    </div>
                                    {classTypeRoute ? <Link to={classTypeRoute}>
                                        <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect">
                                            Read More
                            <span className="mdl-button__ripple-container">
                                                <span className="mdl-ripple">
                                                </span>
                                            </span>
                                        </button>
                                    </Link> : null}
                                </div>
                            </div>
                            <div className="flex-col tile-col col-12 col-sm-6 p-l-0 p-r-0">
                                <div className="v-align-flex" style={classTypeImage(classType.image)}>
                                    <div className="place-holder-col">
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
        };

        return (
            <div className="mdl-grid dark-color bg-color">
                <div className="ribbon bg-image-landing">
                    <div className="container-fluid">
                        <div className="row p-t-4-em p-b-2-em">
                            <div className="col-offset-1 col-10">
                                <h1 className="text-center color-white">Yoga Thurles Class Types</h1>
                                <Admin addAction="ClassType" authorized={authorized} />
                            </div>
                        </div>
                        <div className="p-l-0 p-r-0 row t-border t-shadow">
                            {classTypes.map(classType => alternateTileSides(classTypes, classType, authorized))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ClassTypesPage.propTypes = {
    classTypes: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};


function mapStateToProps(state) {
    return {
        classTypes: state.classTypes,
        authorized: state.authToken
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(classTypesActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassTypesPage);

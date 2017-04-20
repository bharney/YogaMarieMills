import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as massageActions from '../../actions/massageActions';
import MassageForm from './MassageForm';
import Admin from '../common/Admin';

class ManageMassagePage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      massage: Object.assign({}, props.massage),
      errors: {},
      saving: false
    };
    this.updateMassageState = this.updateMassageState.bind(this);
    this.updateDescriptionState = this.updateDescriptionState.bind(this);
    this.updateTitleState = this.updateTitleState.bind(this);
    this.saveMassage = this.saveMassage.bind(this);
    this.deleteMassage = this.deleteMassage.bind(this);
    this.removeRow = this.removeRow.bind(this);
    this.addRow = this.addRow.bind(this);
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.massage.id != nextProps.massage.id) {
      this.setState({ massage: Object.assign({}, nextProps.massage) });
    }
  }

  updateTitleState(event) {
    const field = event.target.name;
    let massage = this.state.massage;
    massage.massage_details[parseInt(field)].title = event.target.value;
    return this.setState({ massage });
  }

  updateDescriptionState(event) {
    const field = event.target.name;
    let massage = this.state.massage;
    massage.massage_details[parseInt(field)].description = event.target.value;
    return this.setState({ massage });
  }

  updateMassageState(event) {
    const field = event.target.name;
    let massage = this.state.massage;
    massage[field] = event.target.value;
    return this.setState({ massage });
  }

  saveMassage(event) {
    event.preventDefault();
    let massage = this.state.massage;
    if (!massage.icon)
    {
      massage.icon = 'whitearomaoil.png';
      massage.iconHeight = '3em';
      massage.iconWidth = '1.8em';
    }
    this.setState({ massage });
    this.props.actions.saveMassage(this.state.massage);
    this.context.router.push('/Ayurveda/Massage/' + massage.type);
  }

  deleteMassage() {
    this.props.actions.deleteMassage(this.state.massage.id);
    this.props.actions.loadMassage();
    this.context.router.push('/Ayurveda/Massage/' + this.state.massage.type);
  }

  addRow() {
    let massage = this.state.massage;
    massage.massage_details.push({ id:'', title: '', description: '' })
    this.setState({ massage });
  }

  removeRow(event) {
    const rowNumber = event.currentTarget.name;
    let massage = this.state.massage;
    massage.massage_details.splice(parseInt(rowNumber), 1)
    this.setState({ massage });
  }

  render() {
    const {authorized} = this.props;
    return (
      <div className="mdl-grid dark-color bg-color">
        <div className="ribbon bg-image-landing b-border">
          <div className="container-fluid">
            <div className="row m-b-1-em">
              <div className="col-xs-12 col-sm-offset-1 col-sm-10 m-b-1-em">
                <Admin saveAction={this.saveMassage} deleteAction={this.deleteMassage} authorized={authorized} />
                <br />
                <br />
                <div className="col-xs-12 col-sm-offset-2 col-sm-8 col-md-offset-2 col-md-8 col-lg-offset-3 col-lg-6 m-b-1-em">
                  <div className="mdl-card mdl-shadow--4dp p-t-05-em p-l-1-em p-r-1-em p-b-05-em">
                    <MassageForm
                      updateTitleState={this.updateTitleState}
                      updateDescriptionState={this.updateDescriptionState}
                      updateMassageState={this.updateMassageState}
                      removeRow={this.removeRow}
                      massage={this.state.massage}
                      errors={this.state.errors}
                      saving={this.state.saving}
                      />
                      <Link className="text-right" to="" onClick={this.addRow} >
                        <button type="button" className="btn btn-success btn-circle-lg" title="Add Row"><i className="glyphicon glyphicon-plus"></i></button>
                      </Link>
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

ManageMassagePage.propTypes = {
  massage: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

ManageMassagePage.contextTypes = {
  router: PropTypes.object
};


function getMassageByTypeAndId(massageTypes, type, id) {
    const massageType = massageTypes.filter(massageType => massageType.type == type);
    const massage = massageType[0].massages.filter(massage => massage.id == id);
      if (massage.length) {
        return massage[0];
      }

    return null;
}

function mapStateToProps(state, ownProps) {
  const massageTypeId = ownProps.params.type;
  const massageId = ownProps.params.id;

  let massage = { 
    id: '', 
    type: massageTypeId,
    session_time: '', 
    title: '', 
    description: '', 
    cost: '', 
    icon: 'whitearomaoil.png', 
    iconHeight: '3em', 
    iconWidth: '1.8em', 
    massage_details: [{ 
      id: '', 
      title: '', 
      description: '' }] 
    };

  if (massageTypeId && massageId && state.massageTypes.length > 0) {
      massage = getMassageByTypeAndId(state.massageTypes, massageTypeId, massageId);
  }

  return {
    massage: massage,
    authorized: state.authToken
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(massageActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageMassagePage);




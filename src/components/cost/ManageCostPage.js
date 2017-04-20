import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as costActions from '../../actions/costActions';
import * as uploadActions from '../../actions/uploadActions';
import CostForm from './CostForm';

class ManageCostPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      cost: Object.assign({}, props.cost),
      errors: {},
      saving: false
    };
    
    this.saveCost = this.saveCost.bind(this);
    this.deleteCost = this.deleteCost.bind(this);
    this.updateCostState = this.updateCostState.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
        if (this.props.cost.id != nextProps.cost.id) {
            this.setState({ cost: Object.assign({}, nextProps.cost) });
        }
    }

  updateCostState(event) {
    const field = event.target.name;
    let cost = this.state.cost;
    cost[field] = event.target.value;
    return this.setState({ cost: cost });
  }

  saveCost(event) {
    event.preventDefault();
    let cost = this.state.cost;
    this.setState({ cost: cost });
    this.props.actions.saveCost(this.state.cost);
    this.context.router.push('/YogaThurles/Costs');
  }

  deleteCost() {
        this.props.actions.deleteCost(this.state.cost.id);
        this.props.actions.loadCost();
        this.context.router.push('/YogaThurles/Costs');
  }

  uploadImage(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      let cost = this.state.cost;
      cost.image = file.name
      this.props.upload.uploadFile(file);
      return this.setState({ cost: cost });
    }
    reader.readAsDataURL(file)
  }


  render() {
    const {authorized} = this.props;
    return (
      <CostForm
        authorized={authorized}
        updateCostState={this.updateCostState}
        saveCost={this.saveCost}
        deleteCost={this.deleteCost}
        cost={this.state.cost}
        errors={this.state.errors}
        saving={this.state.saving}
        uploadImage={this.uploadImage}
        />
    );
  }
}

ManageCostPage.propTypes = {
  cost: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

ManageCostPage.contextTypes = {
  router: PropTypes.object
};

function getCostById(costs, id) {
    const cost = costs.filter(cost => cost.id == id);
    if (cost.length) {
        return cost[0];
    }

    return null;
}

function mapStateToProps(state, ownProps) {
    const costId = ownProps.params.id;
    let cost = { id: '', title: '', image: '', description: '', href: '', route: '', component: '' };
    if (costId && state.costs.length > 0) {
        cost = getCostById(state.costs, costId);
    }

    return {
        cost: cost,
        authorized: state.authToken
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(costActions, dispatch),
        upload: bindActionCreators(uploadActions, dispatch)
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(ManageCostPage);

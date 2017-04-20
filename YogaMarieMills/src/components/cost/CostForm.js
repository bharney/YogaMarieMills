import React from 'react';
import TextInput from '../common/TextInput';
import Admin from '../common/Admin';

const CostForm = ({updateCostState, saveCost, cost, deleteCost, authorized}) => {

  return (
    <div className="mdl-grid dark-color bg-color">
      <div className="ribbon bg-image-landing b-border">
        <div className="row">
          <div className="col-xs-offset-1 col-xs-10 row-centered">
            <h1 className="color-white">Pricing</h1>
            <hr width="50%" className="center-block" />
            <form>
              <Admin saveAction={saveCost} deleteAction={deleteCost} authorized={authorized} />
              <div className="col-xs-12 col-sm-6 col-md-6 col-lg-4 col-centered">
                <div className="mdl-card mdl-shadow--4dp m-l-30 m-r-30 m-t-15 m-b-15 bg-white color-black cost-tile text-center">
                  <div className="inner">
                    <div className="row p-t-40">
                    <div className="col-xs-12">
                        <TextInput
                          name="package"
                          label="Package"
                          value={cost.package}
                          onChange={updateCostState} />
                        <TextInput
                          name="description"
                          label="Description"
                          value={cost.description}
                          onChange={updateCostState} />
                        <TextInput
                          name="cost"
                          label="Cost"
                          value={cost.cost}
                          onChange={updateCostState} />
                        <TextInput
                          name="duration"
                          label="Duration"
                          value={cost.duration}
                          onChange={updateCostState} />
                        <TextInput
                          name="sequence"
                          label="Display Sequence"
                          value={cost.sequence}
                          onChange={updateCostState} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  );
};

CostForm.propTypes = {
  cost: React.PropTypes.object.isRequired,
  editorState: React.PropTypes.object.isRequired,
  updateCostState: React.PropTypes.object.isRequired,
  focus: React.PropTypes.object.isRequired,
  saving: React.PropTypes.object.isRequired,
  uploadImage: React.PropTypes.object.isRequired,
  saveCost: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  errors: React.PropTypes.object
};

export default CostForm;
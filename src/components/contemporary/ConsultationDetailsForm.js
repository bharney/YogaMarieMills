import React from 'react';
import TextInput from '../common/TextInput';
import TextAreaInput from '../common/TextAreaInput';
import RemoveRowButton from '../common/RemoveRowButton';

const ConsultationDetailsForm = ({ updateTitleState, updateCostState, updateSessionTimeState, updateShortState, updateConsultationDescState, removeRow, dietConsultation }) => {

  let displayIcon = function (icon, iconWidth, iconHeight) {
    let requireImg = icon ? require(`../../images/${icon}`) : ""
    const iconImg = {
      backgroundImage: 'url(' + requireImg + ')',
      backgroundSize: `${iconWidth} ${iconHeight}`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }
    return (<div className="icon-circle-sm bg-color-green mdl-shadow--4dp" style={iconImg}></div>)
  }
  return (
    <div className="row">
      <div className="col-xs-12 col-sm-offset-1 col-sm-10">
        {dietConsultation.consultationDetails.map((consultationDetails, index) =>
          <div className="col-xs-12 col-sm-6">
            <div className="mdl-card mdl-shadow--8dp bright-bg-color m-t-1-em p-1-em allow-overflow">
              {displayIcon(consultationDetails.icon, consultationDetails.iconWidth, consultationDetails.iconHeight)}
              <RemoveRowButton
                name={index}
                onClick={removeRow}/>
              <TextInput
                className="p-t-0 p-b-0"
                name={index}
                label="Title"
                placeholder="Title"
                value={consultationDetails.title}
                onChange={updateTitleState} />
              <TextInput
                className="p-t-0 p-b-0"
                name={index}
                label="Cost"
                placeholder="Cost"
                value={consultationDetails.cost}
                onChange={updateCostState} />
              <TextInput
                className="p-t-0 p-b-0"
                name={index}
                label="Consultation Duration"
                placeholder="Consultation Duration"
                value={consultationDetails.session_time}
                onChange={updateSessionTimeState} />
              <TextInput
                className="p-t-0 p-b-0"
                name={index}
                label="Short Description"
                placeholder="Short Description"
                value={consultationDetails.consultation}
                onChange={updateShortState} />
              <TextAreaInput
                className="p-t-0 p-b-0"
                name={index}
                label="Consultation Description"
                placeholder="Consultation Description"
                rows="8"
                value={consultationDetails.consultation_desc}
                onChange={updateConsultationDescState} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ConsultationDetailsForm.propTypes = {
  dietConsultation: React.PropTypes.object.isRequired,
  updateDietConsultationState: React.PropTypes.object.isRequired,
  saving: React.PropTypes.object.isRequired,
  saveDietConsultation: React.PropTypes.func.isRequired,
  errors: React.PropTypes.object
};

export default ConsultationDetailsForm;
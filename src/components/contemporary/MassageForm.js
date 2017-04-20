import React from 'react';
import TextInput from '../common/TextInput';
import TextAreaInput from '../common/TextAreaInput';
import RemoveRowButton from '../common/RemoveRowButton';

const MassageForm = ({updateDescriptionState, updateTitleState, updateMassageState, removeRow, massage }) => {

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
      <form>
        <div className="row p-t-1-em">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1 p-t-1-em">
                {displayIcon(massage.icon, massage.iconWidth, massage.iconHeight)}
                <TextInput
                  className="p-t-0 p-b-0"
                  name="title"
                  label="Title"
                  placeholder="Title"
                  value={massage.title}
                  onChange={updateMassageState} />
                <hr width="50%" className="center-block" />
                <TextInput
                  className="p-t-0 p-b-0"
                  name="cost"
                  label="Cost"
                  placeholder="Cost"
                  value={massage.cost}
                  onChange={updateMassageState} />
                <TextInput
                  className="p-t-0 p-b-0"
                  name="session_time"
                  label="Time"
                  placeholder="Time"
                  value={massage.session_time}
                  onChange={updateMassageState} />
              </div>
        </div>
        <div className="row">
            <div className="col-xs-12 col-sm-offset-1 col-sm-10">
                {massage.massage_details.map((massage_details, index) =>
                  <div className="col-xs-6">
                    <RemoveRowButton
                      name={index}
                      onClick={removeRow} />
                    <TextInput
                      className="p-t-0 p-b-0"
                      name={index}
                      label="Title"
                      placeholder="Title"
                      value={massage_details.title}
                      onChange={updateTitleState} />
                    <TextAreaInput
                      className="p-t-0 p-b-0"
                      name={index}
                      label="Description"
                      placeholder="Description"
                      rows="4"
                      value={massage_details.description}
                      onChange={updateDescriptionState} />
                  </div>
                )}
            </div>
        </div>
    </form>
  );
};

MassageForm.propTypes = {
  massage: React.PropTypes.object.isRequired,
  updateMassageState: React.PropTypes.object.isRequired,
  saving: React.PropTypes.object.isRequired,
  saveMassage: React.PropTypes.func.isRequired,
  errors: React.PropTypes.object
};

export default MassageForm;
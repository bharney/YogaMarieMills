import costApi from '../API/mockCostApi';

export function loadCostSuccess(costs) {
    return { type: 'LOAD_COST_SUCCESS', costs};
}

export function createCostSuccess(cost) {
  return { type: 'CREATE_COST_SUCCESS', cost };
}

export function updateCostSuccess(cost) {
  return { type: 'UPDATE_COST_SUCCESS', cost };
}

export function deleteCostSuccess() {
  return { type: 'DELETE_COST_SUCCESS' };
}

export function loadCost() {
    return function (dispatch) {
        return costApi.getAllItems().then(costs => {
            dispatch(loadCostSuccess(costs));
    }).catch(error => {
      throw(error);
    });
  };
}

export function deleteCost(cost) {
  return function (dispatch) {
    return costApi.deleteCost(cost).then(() => {
      dispatch(deleteCostSuccess());
      return costApi.getAllCosts().then(costs => {
        dispatch(loadCostSuccess(costs));
      });
    }).catch(error => {
      throw (error);
    });
  };
}


export function saveCost(cost) {
  return function (dispatch) {
    return costApi.saveCost(cost).then(savedCost => {
      cost.id ? dispatch(updateCostSuccess(savedCost)) :
        dispatch(createCostSuccess(savedCost));
    }).catch(error => {
      throw (error);
    });
  };
}
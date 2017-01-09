import costApi from '../API/mockCostApi';

export function loadCostSuccess(costs) {
    return { type: 'LOAD_COST_SUCCESS', costs};
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

import navbarApi from '../API/mockNavbarApi';

export function loadNavbarSuccess(navbar_items) {
    return { type: 'LOAD_NAVBAR_SUCCESS', navbar_items};
}


export function loadNavbar() {
    return function (dispatch) {
        return navbarApi.getAllItems().then(navbar_items => {
            dispatch(loadNavbarSuccess(navbar_items));
    }).catch(error => {
      throw(error);
    });
  };
}

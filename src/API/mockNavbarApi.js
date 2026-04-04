class NavbarApi {
  static getAllItems() {
    return new Promise((resolve) => {
      fetch('/api/navbars').then(function (response) {
        return response.json();
      }).then(function (navbar_items) {
        resolve(Object.assign([], navbar_items));
      });
    });
  }
}

export default NavbarApi;

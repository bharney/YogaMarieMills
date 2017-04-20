<<<<<<< HEAD
import 'whatwg-fetch'
class NavbarApi {
  static getAllItems() {
    return new Promise((resolve) => {
      fetch('http://localhost:3000/api/navbars').then(function (response) {
        return response.json();
      }).then(function (navbar_items) {
        resolve(Object.assign([], navbar_items));
      });
    });
  }
}

export default NavbarApi;
=======
// This file mocks a web API by working with the hard-coded data below.
// It uses setTimeout to simulate the delay of an AJAX call.
// All calls return promises.
const navbar_items = [
  {
    id: 1,
    name: "About Marie Mills",
    href: "http://www.yogamariemills/About/",
    route: "about",
    component: "AboutPage"
  },
  {
    id: 2,
    name: "Yoga Thurles",
    href: "http://www.yogamariemills/YogaThurles/",
    route: "yogathurles",
    component: "YogaThurlesPage"    
  },
  {
    id: 3,
    name: "Contemporary",
    href: "http://wwww.yogamariemills/Contemporary/",
    route: "contemporary",
    component: "ContemporaryPage"  
  },
  {
    id: 4,
    name: "My Blog",
    href: "http://www.yogamariemills/Blog/",
    route: "blog",
    component: "BlogPage"  
  }
];

class NavbarApi {
    static getAllItems() {
        return new Promise((resolve, reject) => {
            resolve(Object.assign([], navbar_items));
        });
    }
}

  export default NavbarApi;
>>>>>>> ee298d412f7c57384fc49ab52017ec591ac91596

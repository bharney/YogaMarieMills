// This file mocks a web API by working with the hard-coded data below.
// It uses setTimeout to simulate the delay of an AJAX call.
// All calls return promises.
const blogs = [
    {
        id: 1,
        name: "Blog Post 1",
        image: require("../images/ColetteMillsAfter.jpg"),
        description: "Ut sed ex eget tortor aliquet mollis. Fusce aliquet urna in mi volutpat accumsan. Maecenas consequat ornare vestibulum. Aenean ultricies leo ullamcorper odio bibendum aliquam. Nunc vel justo magna. Cras dignissim sed lorem et ultricies. Nullam elementum vestibulum elit, eget auctor sem finibus nec. Nullam tellus turpis, vehicula non fermentum eu, hendrerit interdum tellus. Praesent id gravida neque. Praesent ut quam ac augue ultrices gravida. Aliquam erat volutpat. Nulla at nunc posuere, vestibulum augue vitae, volutpat lectus. Maecenas felis purus, tincidunt sed rhoncus sit amet, volutpat et diam.",
        href: "http://www.yogamariemills/About/",
        route: "blog",
        component: "AboutPage"
    },
    {
        id: 2,
        name: "Blog Post 2",
        image: require("../images/ChicagoInABoxAfter.jpg"),
        description: "Ut sed ex eget tortor aliquet mollis. Fusce aliquet urna in mi volutpat accumsan. Maecenas consequat ornare vestibulum. Aenean ultricies leo ullamcorper odio bibendum aliquam. Nunc vel justo magna. Cras dignissim sed lorem et ultricies. Nullam elementum vestibulum elit, eget auctor sem finibus nec. Nullam tellus turpis, vehicula non fermentum eu, hendrerit interdum tellus. Praesent id gravida neque. Praesent ut quam ac augue ultrices gravida. Aliquam erat volutpat. Nulla at nunc posuere, vestibulum augue vitae, volutpat lectus. Maecenas felis purus, tincidunt sed rhoncus sit amet, volutpat et diam.",
        href: "http://www.yogamariemills/YogaThurles/",
        route: "blog",
        component: "YogaThurlesPage"
    },
    {
        id: 3,
        name: "Blog Post 3",
        image: require("../images/MeetBrianAfter.jpg"),
        description: "Ut sed ex eget tortor aliquet mollis. Fusce aliquet urna in mi volutpat accumsan. Maecenas consequat ornare vestibulum. Aenean ultricies leo ullamcorper odio bibendum aliquam. Nunc vel justo magna. Cras dignissim sed lorem et ultricies. Nullam elementum vestibulum elit, eget auctor sem finibus nec. Nullam tellus turpis, vehicula non fermentum eu, hendrerit interdum tellus. Praesent id gravida neque. Praesent ut quam ac augue ultrices gravida. Aliquam erat volutpat. Nulla at nunc posuere, vestibulum augue vitae, volutpat lectus. Maecenas felis purus, tincidunt sed rhoncus sit amet, volutpat et diam.",
        href: "http://wwww.yogamariemills/Contemporary/",
        route: "blog",
        component: "ContemporaryPage"
    },
    {
        id: 4,
        name: "Blog Post 4",
        image: require("../images/GoSurferAfter.jpg"),
        description: "Donec congue a enim tincidunt auctor. Etiam at consequat leo, et sodales ante. Nam vehicula, risus eget auctor finibus, ipsum odio semper arcu, et semper lectus lectus eget ante. Maecenas rutrum tellus non nunc porta pretium sit amet nec metus. Cras non egestas nisl. Phasellus eu lectus sed nisl auctor rutrum. Aenean aliquam, nibh quis ornare viverra, dolor ipsum congue quam, sit amet rhoncus mi ex at ipsum. Mauris ultrices dolor sit amet ullamcorper rhoncus.",
        href: "http://www.yogamariemills/About/",
        route: "blog",
        component: "AboutPage"
    },
    {
        id: 5,
        name: "Blog Post 5",
        image: require("../images/JMS.jpg"),
        href: "http://www.yogamariemills/YogaThurles/",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rhoncus massa tortor, eu gravida risus rhoncus suscipit. Duis justo mi, vulputate non porttitor id, lacinia nec urna. In eleifend auctor mi semper finibus. Donec cursus id lectus a maximus. Aenean et arcu tincidunt, gravida metus non, mattis nibh. Curabitur volutpat pharetra est, id mattis turpis rhoncus a. Aenean mattis non ligula ullamcorper sagittis. Curabitur efficitur interdum eros. Curabitur mollis accumsan placerat. Suspendisse at justo molestie, facilisis sapien sit amet, volutpat nunc. Donec lobortis placerat tincidunt. Phasellus libero sem, gravida eget malesuada sit amet, suscipit efficitur nisi.",
        route: "yogathurles",
        component: "YogaThurlesPage"
    },
    {
        id: 6,
        name: "Blog Post 6",
        image: require("../images/CircleHead.png"),
        description: "Ut sed ex eget tortor aliquet mollis. Fusce aliquet urna in mi volutpat accumsan. Maecenas consequat ornare vestibulum. Aenean ultricies leo ullamcorper odio bibendum aliquam. Nunc vel justo magna. Cras dignissim sed lorem et ultricies. Nullam elementum vestibulum elit, eget auctor sem finibus nec. Nullam tellus turpis, vehicula non fermentum eu, hendrerit interdum tellus. Praesent id gravida neque. Praesent ut quam ac augue ultrices gravida. Aliquam erat volutpat. Nulla at nunc posuere, vestibulum augue vitae, volutpat lectus. Maecenas felis purus, tincidunt sed rhoncus sit amet, volutpat et diam.",
        href: "http://wwww.yogamariemills/Contemporary/",
        route: "contemporary",
        component: "ContemporaryPage"
    }
];

class BlogApi {
    static getAllBlogs() {
        return new Promise((resolve, reject) => {
            resolve(Object.assign([], blogs));
        });
    }
}

export default BlogApi;

<<<<<<< HEAD
﻿import React, {PropTypes} from 'react';

class Navbar extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = { open: false };
        this.redirectToNavbarItemPage = this.redirectToNavbarItemPage.bind(this);
    }

    handleToggle() {
        this.setState({ open: !this.state.open });
        console.log("open")
    }
    handleClose() { this.setState({ open: false }); }

    render() {
        const {item} = this.props;

        return (
            <MenuItem key={item.route} primaryText={item.name} onTouchTap={this.handleClose.bind(this) }>{item.name}</MenuItem>
        );
    }
}

Navbar.propTypes = {
    item: PropTypes.array.isRequired
};

export default Navbar;

//const Navbar = ({item}) => {
//    return (
//        <li>
//            <Link key={item.route} to={'/' + item.route} activeClassName="active">{item.name}</Link>
//        </li>
//    );
//};

//Navbar.propTypes = {
//    item: PropTypes.array.isRequired
//};

=======
﻿import React, {PropTypes} from 'react';
import { Link } from 'react-router';


class Navbar extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = { open: false };
        this.redirectToNavbarItemPage = this.redirectToNavbarItemPage.bind(this);
    }

    handleToggle() {
        this.setState({ open: !this.state.open });
        console.log("open")
    }
    handleClose() { this.setState({ open: false }); }

    render() {
        const {item} = this.props;

        return (
            <MenuItem key={item.route} primaryText={item.name} onTouchTap={this.handleClose.bind(this) }>{item.name}</MenuItem>
        );
    }
}

Navbar.propTypes = {
    item: PropTypes.array.isRequired
};

export default Navbar;

//const Navbar = ({item}) => {
//    return (
//        <li>
//            <Link key={item.route} to={'/' + item.route} activeClassName="active">{item.name}</Link>
//        </li>
//    );
//};

//Navbar.propTypes = {
//    item: PropTypes.array.isRequired
//};

>>>>>>> ee298d412f7c57384fc49ab52017ec591ac91596
//export default Navbar;
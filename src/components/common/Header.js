<<<<<<< HEAD
import React, { PropTypes } from 'react';
import { Link, IndexLink, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navbarActions from '../../actions/navbarActions';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import { ListItem } from 'material-ui/List';
import logoImg from '../../images/mobileLogo.png';

class Header extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false
        };
        this.redirectToNavbarItemPage = this.redirectToNavbarItemPage.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.preventRedirect = this.preventRedirect.bind(this);
    }

    handleToggle() {
        this.setState({ open: !this.state.open });
    }

    handleClose() {
        this.setState({ open: false });
    }

    navbarItem(item, index) {
        return (<div key={index}>{item.name}</div>);
    }

    redirectToNavbarItemPage() {
        browserHistory.push(`/ {item.name}`);
    }

    preventRedirect(e) {
        e.preventDefault();
    }

    render() {
        const styles = {
            fontWeight: 300
        }
        const { navbar_items } = this.props;

        let that = this;
        let listItems = function (item) {
            return (
                <Link key={item.route} to={'/' + item.route} >
                    <ListItem nestedLevel={1} key={item.name} onTouchTap={that.handleToggle} primaryText={item.name} />
                </Link>
            );
        };
        let drawerItems = function (item) {
            if (item.subMenu.length > 0) {
                return (
                    <ListItem
                        primaryText={item.name}
                        initiallyOpen={false}
                        style={styles}
                        primaryTogglesNestedList
                        nestedItems={[
                            item.subMenu.map(subMenu => listItems(subMenu))
                        ]} />
                );
            }
            else {
                return (
                    <Link key={item.route} to={'/' + item.route} >
                        <MenuItem onTouchTap={that.handleToggle} key={item.route}>{item.name}</MenuItem>
                    </Link>
                );
            }
        };
        let subMenuItems = function (item) {
            return (
                <Link key={item.route} to={'/' + item.route} >
                    <li className="mdl-menu__item">{item.name}</li>
                </Link>
            );
        };
        let navItems = function (item) {
            if (item.subMenu.length > 0) {
                return (
                    <div className="hover" id={item.name}>
                        <Link key={item.route} to="" onClick={that.preventRedirect} className="mdl-tabs__tab nav-links p-l-1-em p-r-1-em mdl-layout--large-screen-only">
                            {item.name} &nbsp;<span className="caret" aria-hidden="true"></span>
                        </Link>
                        <ul className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" htmlFor={item.name}>
                            {item.subMenu.map(subMenu => subMenuItems(subMenu))}
                        </ul>
                    </div>
                );
            }
            else {
                return (
                    <Link key={item.route} to={'/' + item.route} className="mdl-tabs__tab nav-links p-l-1-em p-r-1-em mdl-layout--large-screen-only">{item.name}</Link>
                );
            }
        };
        return (
            <header>
                <div className="mdl-layout__header-row nav-element-left anchor dark-bg-color color-blur navbar-fixed-top mdl-shadow--4dp">
                    <a className="navbar-brand mdl-layout-title mdl-layout__header-row drawer-header nav-menu-left" onTouchTap={this.handleToggle}>
                        <span className="menu-font">
                            <i className="p-l-03-em p-t-40 p-r-015-em fa fa-ellipsis-v" aria-hidden="true"></i>Menu
                            <img className="m-0 logo brand img-responsive" src={logoImg}></img>
                        </span></a>
                    <div className="mdl-layout-spacer nav-vertical-divider">
                        <div className="mdl-layout__header-row drawer-header anchor p-l-0">
                            <IndexLink to="/" className="mdl-layout-title nav-links p-r-1-em p-l-10">
                                <h2 className="brand-text m-0">Yoga Marie Mills</h2>
                            </IndexLink>
                        </div>
                    </div>
                    {navbar_items.map(item =>
                        navItems(item)
                    )}
                </div>
                <Drawer
                    docked={false}
                    open={this.state.open}
                    onRequestChange={this.handleToggle}>
                    <header>
                        <div className="mdl-layout__header-row drawer-header color-blur anchor">
                            <IndexLink to="/">
                                <span onTouchTap={this.handleToggle}>
                                    <h4 className="m-0 p-t-05-em p-b-05-em">
                                        Yoga with Marie Mills
                                        </h4>
                                </span>
                            </IndexLink>
                        </div>
                    </header>
                    <main className="nav">
                        {navbar_items.map(item =>
                            drawerItems(item)
                        )}
                    </main>
                </Drawer>
            </header>

        );
    }
}


Header.propTypes = {
    navbar_items: PropTypes.array.isRequired
};


function mapStateToProps(state) {
    return {
        navbar_items: state.navbar_items
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(navbarActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
=======
import React, {PropTypes} from 'react';
import { Link, IndexLink, browserHistory } from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as navbarActions from '../../actions/navbarActions';
import Navbar from './Navbar';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import {ToolbarGroup, Toolbar} from 'material-ui/Toolbar';
import Drawer from 'material-ui/Drawer';

const styles = {

}

class Header extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false,
        };
        this.redirectToNavbarItemPage = this.redirectToNavbarItemPage.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleToggle() {
        this.setState({ open: !this.state.open });
    }

    handleClose() {
        this.setState({ open: false });
    }

    navbarItem(item, index) {
        return (<div key={index}>{item.name}</div>);
    }

    redirectToNavbarItemPage() {
        browserHistory.push(`/ {item.name}`);
    }

    render() {
        const {navbar_items} = this.props;

        return (
            <header className="bg-color mdl-layout__header">
                <div className="mdl-layout__header-row nav-element-left">
                    <a className="navbar-brand mdl-layout-title mdl-layout__header-row drawer-header nav-menu-left font-style" onTouchTap={this.handleToggle}><span><i className="glyphicon glyphicon-option-vertical" aria-hidden="true"></i>Menu</span></a>
                    <div className="mdl-layout-spacer nav-vertical-divider"><div className="mdl-layout__header-row drawer-header"><IndexLink to="/" className="mdl-layout-title font-style"><span>Yoga with Marie Mills</span></IndexLink></div></div>
                    <nav className="mdl-navigation mdl-layout--large-screen-only">
                        <div class="mdl-tabs__tab-bar">
                        {navbar_items.map(item =>
                                <Link key={item.route} to={'/' + item.route} className="mdl-tabs__tab nav-links">{item.name}</Link>
                        ) }
                        </div>
                    </nav>
                </div>
                <Drawer
                    docked={false}
                    open={this.state.open}
                    onRequestChange={ this.handleToggle }>
                    <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                        <header className="mdl-layout__header">
                            <div className="mdl-layout__header-row drawer-header dark-bg-color">
                                 <IndexLink to="/"><span onTouchTap={this.handleToggle}
                                    className="mdl-layout-title font-style">
                                    Yoga with Marie Mills
                                </span></IndexLink>
                            </div>
                        </header>
                        <main className="mdl-layout__content">
                            {navbar_items.map(item =>
                                <Link key={item.route} to={'/' + item.route} ><MenuItem className="font-style" onTouchTap={this.handleClose} key={item.route}>{item.name}</MenuItem></Link>
                            ) }
                        </main>
                    </div>
                </Drawer>
            </header>

        );
    }
}


Header.propTypes = {
    navbar_items: PropTypes.array.isRequired
};


function mapStateToProps(state, ownProps) {
    return {
        navbar_items: state.navbar_items
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(navbarActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);


//<AppBar title={<span style={styles.title}>MENU</span>}
//    className="theme-bg"
//    onTitleTouchTap={this.redirectHome}
//    iconElementLeft={<IconButton onTouchTap={this.handleToggle}><MoreVertIcon /></IconButton> }
//    iconElementRight={<Toolbar className="theme-bg hidden-xs">
//        {navbar_items.map(item =>
//            <ToolbarGroup>
//                <Link key={item.route} to={'/' + item.route} activeClassName="active"><MenuItem onTouchTap={this.handleClose} key={item.route}>{item.name}</MenuItem></Link>
//            </ToolbarGroup>
//        ) }
//    </Toolbar>}/>

    //constructor(props, context) {
    //    super(props, context);
    //    this.redirectToNavbarItemPage = this.redirectToNavbarItemPage.bind(this);
    //}

    //navbarItem(item, index) {
    //    return (<div key={index}>{item.name}</div>);
    //}

    //redirectToNavbarItemPage() {
    //    browserHistory.push(`/ {item.name}`);
    //}

//    render() {
//        const {navbar_items} = this.props;

//        return (
//            <nav className="navbar navbar-inverse navbar-fixed-top">
//                <div className="container-fluid">
//                    <div className="navbar-header">
//                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#js-navbar-collapse">
//                            <span className="sr-only">Toggle navigation</span>
//                            <span className="icon-bar"></span>
//                            <span className="icon-bar"></span>
//                            <span className="icon-bar"></span>
//                        </button>
//                        <IndexLink to="/" className="navbar-brand" activeClassName="active">Home</IndexLink>
//                    </div>
//                    <div className="navbar-collapse collapse" id="js-navbar-collapse">
//                        <ul className="nav navbar-nav navbar-right">
//                            {navbar_items.map(item =>
//                                <Navbar key={item.name} item={item}/>
//                                )
//                            }
//                        </ul>
//                    </div>
//                </div>
//            </nav>
//        );
//    }
//}

//import React, {PropTypes} from 'react';
//import { Link, IndexLink, browserHistory } from 'react-router';
//import {connect} from 'react-redux';
//import {bindActionCreators} from 'redux';
//import * as navbarActions from '../../actions/navbarActions';
//import Navbar from './Navbar';

//class Header extends React.Component {
//    constructor(props, context) {
//        super(props, context);
//        this.redirectToNavbarItemPage = this.redirectToNavbarItemPage.bind(this);
//    }

//    navbarItem(item, index) {
//        return <div key={index}>{item.name}</div>
//    }

//    redirectToNavbarItemPage() {
//        browserHistory.push(`/ {item.name}`);
//    }

//    render() {
//        const {navbar_items} = this.props;

//        return (
//            <nav className="navbar navbar-inverse navbar-fixed-top">
//                <div className="container-fluid">
//                    <div className="navbar-header">
//                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#js-navbar-collapse">
//                            <span className="sr-only">Toggle navigation</span>
//                            <span className="icon-bar"></span>
//                            <span className="icon-bar"></span>
//                            <span className="icon-bar"></span>
//                        </button>
//                        <IndexLink to="/" className="navbar-brand" activeClassName="active">Home</IndexLink>
//                    </div>
//                    <div className="navbar-collapse collapse" id="js-navbar-collapse">
//                        <ul className="nav navbar-nav navbar-right">
//                            {navbar_items.map(item =>
//                                <Navbar item={item}/>
//                            ) }
//                        </ul>
//                    </div>
//                </div>
//            </nav>
//        );
//    };
//}

//function mapStateToProps(state, ownProps) {
//    return {
//        navbar_items: state.navbar_items
//    };
//}
//function mapDispatchToProps(dispatch) {
//    return {
//        actions: bindActionCreators(navbarActions, dispatch)
//    };
//}

//export default connect(mapStateToProps, mapDispatchToProps)(Header);

//import React, {PropTypes} from 'react';
//import { Link, IndexLink } from 'react-router';
//import Navbar from './common/Navbar';

//const Header = () => {
//    return (
//        <nav className="navbar navbar-inverse navbar-static-top">
//            <div className="container-fluid">
//                <div className="navbar-header">
//                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#js-navbar-collapse">
//                        <span className="sr-only">Toggle navigation</span>
//                        <span className="icon-bar"></span>
//                        <span className="icon-bar"></span>
//                        <span className="icon-bar"></span>
//                    </button>
//                    <IndexLink to="/" className="navbar-brand" activeClassName="active">Home</IndexLink>
//                </div>
//                <div className="navbar-collapse collapse" id="js-navbar-collapse">
//                    <ul className="nav navbar-nav navbar-right">
//                        <li>
//                            <Link to="/about" activeClassName="active">About</Link>
//                        </li>
//                        <li>
//                            <Link to="/courses" activeClassName="active">Courses</Link>
//                        </li>
//                        <li>
//                            <Link to="/schedule" activeClassName="active">Schedule</Link>
//                        </li>
//                    </ul>
//                </div>
//            </div>
//        </nav>
//    );
//};

//export default Header;



>>>>>>> ee298d412f7c57384fc49ab52017ec591ac91596

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
                        <Link key={item.route} to="" onClick={that.preventRedirect} className="mdl-tabs__tab nav-links p-l-1-em p-r-1-em hidden-xs hidden-sm">
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
                    <Link key={item.route} to={'/' + item.route} className="mdl-tabs__tab nav-links p-l-1-em p-r-1-em hidden-xs hidden-sm">{item.name}</Link>
                );
            }
        };
        return (
            <header>
                <div className="mdl-layout__header-row nav-element-left anchor dark-bg-color color-blur navbar-fixed-top mdl-shadow--4dp">
                    <a className="navbar-brand mdl-layout-title mdl-layout__header-row drawer-header nav-menu-left" onTouchTap={this.handleToggle}><img className="m-0 p-b-5 brand img-responsive" src={logoImg}></img></a>
                    <div className="mdl-layout-spacer nav-vertical-divider">
                        <div className="mdl-layout__header-row drawer-header anchor p-l-0">
                            <IndexLink to="/" className="mdl-layout-title nav-links p-r-1-em">
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
                                    <h4 className="m-0 p-t-05-em p-b-05-em p-l-03-em">
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
import React from 'react';
import PropTypes from 'prop-types';
import { Link, IndexLink, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navbarActions from '../../actions/navbarActions';
import MenuItem from '@material-ui/core/MenuItem';
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
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
        this.normalizeRoute = this.normalizeRoute.bind(this);
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

    redirectToNavbarItemPage(item) {
        browserHistory.push(`/${item.route}`);
    }

    preventRedirect(e) {
        e.preventDefault();
    }

    normalizeRoute(route) {
        if (!route || route === 'undefined') {
            return '/';
        }

        const normalizedRoute = String(route).replace(/^\/+/, '');
        return normalizedRoute ? `/${normalizedRoute}` : '/';
    }

    render() {
        const styles = {
            fontWeight: 300
        }
        const { navbar_items } = this.props;
        let that = this;

        let drawerItems = function (item) {
            const itemRoute = that.normalizeRoute(item.route);
            if (!item.subMenu || item.subMenu.length == 0)
                return (
                    <Link key={item.route || item.name} to={itemRoute} className="drawer-link" >
                        <MenuItem onClick={that.handleToggle} key={item.route}>{item.name}</MenuItem>
                    </Link>
                );

            return (
                <div key={item.route || item.name}>
                    <ListItem disabled>
                        <ListItemText primary={item.name} style={styles} />
                    </ListItem>
                    {item.subMenu.map(subMenu => (
                        <Link key={subMenu.route || subMenu.name} to={that.normalizeRoute(subMenu.route)} className="drawer-link">
                            <MenuItem onClick={that.handleToggle} style={{ paddingLeft: '32px' }}>{subMenu.name}</MenuItem>
                        </Link>
                    ))}
                </div>
            );
        };

        let desktopNavItems = function (item) {
            const itemRoute = that.normalizeRoute(item.route);
            if (!item.subMenu || item.subMenu.length === 0) {
                return (
                    <Link key={item.id || item.name} to={itemRoute} className="top-nav-link" onClick={that.handleClose}>
                        {item.name}
                    </Link>
                );
            }

            return (
                <div key={item.id || item.name} className="top-nav-item">
                    <span className="top-nav-trigger">{item.name}</span>
                    <div className="top-nav-dropdown">
                        {item.subMenu.map(subMenu => (
                            <Link key={subMenu.id || subMenu.name} to={that.normalizeRoute(subMenu.route)} className="top-nav-dropdown-link" onClick={that.handleClose}>
                                {subMenu.name}
                            </Link>
                        ))}
                    </div>
                </div>
            );
        };
        return (
            <header>
                <div className="mdl-layout__header-row nav-element-left anchor dark-bg-color color-blur navbar-fixed-top mdl-shadow--4dp">
                    <a className="navbar-brand mdl-layout-title mdl-layout__header-row drawer-header nav-menu-left" onClick={this.handleToggle}><img className="m-0 p-b-5 brand img-responsive" src={logoImg}></img></a>
                    <div className="mdl-layout-spacer nav-vertical-divider">
                        <div className="mdl-layout__header-row drawer-header anchor p-l-0">
                            <IndexLink to="/" className="mdl-layout-title nav-links p-r-1-em">
                                <h2 className="brand-text m-0 p-l-03-em">Yoga Marie Mills</h2>
                            </IndexLink>
                        </div>
                    </div>
                    <div className="top-nav hidden-xs hidden-sm">
                        {navbar_items.map(item => desktopNavItems(item))}
                    </div>
                </div>
                <Drawer
                    open={this.state.open}
                    onClose={this.handleToggle}>
                    <header>
                        <div className="mdl-layout__header-row drawer-header color-blur anchor">
                            <IndexLink to="/">
                                <span onClick={this.handleToggle}>
                                    <h4 className="m-0 p-t-05-em p-b-05-em p-l-03-em">
                                        Yoga with Marie Mills
                                    </h4>
                                </span>
                            </IndexLink>
                        </div>
                    </header>
                    <main className="drawer-nav">
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

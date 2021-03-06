import React, { PropTypes } from 'react';
import { Link, IndexLink, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navbarActions from '../../actions/navbarActions';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import { ListItem } from 'material-ui/List';
import { Nav, NavItem, NavDropdown } from 'react-bootstrap';
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

    redirectToNavbarItemPage(item) {
        browserHistory.push(`/${item.route}`);
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

        let drawerItems = function (item) {
            if (!item.subMenu || item.subMenu.length == 0)
                return (
                    <Link key={item.route} to={'/' + item.route} >
                        <MenuItem onTouchTap={that.handleToggle} key={item.route}>{item.name}</MenuItem>
                    </Link>
                );

            return (
                <ListItem
                    primaryText={item.name}
                    initiallyOpen={false}
                    style={styles}
                    primaryTogglesNestedList
                    nestedItems={[
                        item.subMenu.map(subMenu => drawerItems(subMenu))
                    ]} />
            );
        };

        let navItems = function (item) {
            if (!item.subMenu || item.subMenu.length == 0)
                return (
                    <NavItem eventKey={item.id} onTouchTap={() => that.redirectToNavbarItemPage(item)} className="dark-color nav-links hidden-xs hidden-sm">{item.name}</NavItem>
                );
            return (
                <NavDropdown eventKey={item.id} pullRight={true} className="nav-links hidden-xs hidden-sm" title={item.name} id={item.id}>
                    {item.subMenu.map(subMenu => navItems(subMenu))}
                </NavDropdown>
            );
        };
        return (
            <header>
                <div className="mdl-layout__header-row nav-element-left anchor dark-bg-color color-blur navbar-fixed-top mdl-shadow--4dp">
                    <a className="navbar-brand mdl-layout-title mdl-layout__header-row drawer-header nav-menu-left" onTouchTap={this.handleToggle}><img className="m-0 p-b-5 brand img-responsive" src={logoImg}></img></a>
                    <div className="mdl-layout-spacer nav-vertical-divider">
                        <div className="mdl-layout__header-row drawer-header anchor p-l-0">
                            <IndexLink to="/" className="mdl-layout-title nav-links p-r-1-em">
                                <h2 className="brand-text m-0 p-l-03-em">Yoga Marie Mills</h2>
                            </IndexLink>
                        </div>
                    </div>
                    <Nav bsStyle="" className="inline-nav" activeKey="1" onSelect={this.handleClose}>
                        {navbar_items.filter(item => item.subMenu).map(item =>
                            navItems(item)
                        )}
                    </Nav>
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
                    <main className="inline-nav">
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
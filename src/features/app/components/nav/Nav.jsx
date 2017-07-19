import React from 'react';
import { Link, IndexLink } from 'react-router';
import firebase from '../../../../../firebase';
import * as actions from '../../../data/actions';
import store from '../../../../store';

export class Nav extends React.Component {
  constructor() {
    super();
    this.state = {
      userStatus: '',
    };
  }

  closeMenu = () => {
    if (window.innerWidth < 600) {
      document.getElementById('nav-toggle').click();
    }
  };

  logout = () => {
    store.dispatch(actions.logout());
    firebase.auth().signOut();
  }

  render() {
    const activeStyles = {
      backgroundColor: '#455B8A',
      color: 'white',
    };

    const adminNav = () => (
      <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul className="nav navbar-nav">
          <li>
            <IndexLink onClick={this.closeMenu} to="/" className="link" activeClassName="active" activeStyle={activeStyles}>Overview</IndexLink>
          </li>
          <li className="nav-divider"> | </li>
          <li>
            <Link onClick={this.closeMenu} to="/events" className="link" activeClassName="active" activeStyle={activeStyles}>Events</Link>
          </li>
        </ul>
      </div>
    );

    const userNav = () => (
      <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul className="nav navbar-nav">
          <li>
            <Link onClick={this.closeMenu} to="/schedule" className="link" activeClassName="active" activeStyle={activeStyles}>Schedule</Link>
          </li>
          <li>
            <Link onClick={this.closeMenu} to="/volunteers" className="link" activeClassName="active" activeStyle={activeStyles}>Volunteers</Link>
          </li>
        </ul>

      </div>
    );

    const navigation = () => {
      if (this.props.user.role === 'admin') {
        return adminNav();
      } else if (this.props.user.role === 'user') {
        return userNav();
      }
      return noUserNav();
    };
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" id="nav-toggle" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <li className="navbar-brand nav-title" href="#">Balastoff! Check-In</li>
          </div>
          {userNav()}
        </div>
      </nav>
    );
  }
}

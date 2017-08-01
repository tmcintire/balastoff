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
      backgroundColor: 'rgba(64, 93, 108, 1)',
      color: 'white',
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
            <li className="navbar-brand nav-title" href="#">
              <span className="balast">BALAST</span>
              <span className="off">OFF! </span>
              <span>Check-In</span>
            </li>
          </div>
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li>
                <Link onClick={this.closeMenu} to="/" className="link" activeClassName="active" activeStyle={activeStyles}>Home</Link>
              </li>
            </ul>
            <ul className="nav navbar-nav">
              <li>
                <Link onClick={this.closeMenu} to="/comps" className="link" activeClassName="active" activeStyle={activeStyles}>Comps</Link>
              </li>
            </ul>
            <ul className="nav navbar-nav">
              <li>
                <Link onClick={this.closeMenu} to="/addparticipant" className="link" activeClassName="active" activeStyle={activeStyles}>Add</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

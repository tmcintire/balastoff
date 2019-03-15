import * as React from 'react';
import { Link, IndexLink } from 'react-router';
import firebase from '../../../../../firebase';
import * as actions from '../../../data/actions';
import store from '../../../../store';

interface NavProps {
  connection: boolean,
}

interface NavState {
  userStatus: string
}

export class Nav extends React.Component<NavProps, NavState> {
  constructor(props) {
    super(props);
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
    const renderDisconnectMessage = () => {
      if (!this.props.connection) {
        return (
          <h4 className="disconnect-message">You have lost your internet connection, please reconnect to the internet!</h4>
        );
      }
    };
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
            <li className="navbar-brand nav-title">
              <span className="balast">BALAST</span>
              <span className="off">OFF! </span>
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
                <Link onClick={this.closeMenu} to="/addparticipant" className="link" activeClassName="active" activeStyle={activeStyles}>Add</Link>
              </li>
            </ul>
            <ul className="nav navbar-nav">
              <li>
                <Link onClick={this.closeMenu} to="/instructions" className="link" activeClassName="active" activeStyle={activeStyles}>Instructions</Link>
              </li>
            </ul>
            <ul className="nav navbar-nav">
              <li>
                <Link onClick={this.closeMenu} to="/store" className="link" activeClassName="active" activeStyle={activeStyles}>Store</Link>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li>
                <Link onClick={this.closeMenu} to="/comps" className="link" activeClassName="active" activeStyle={activeStyles}>Comps</Link>
              </li>
            </ul>
          </div>
        </div>
        {renderDisconnectMessage()}
      </nav>
    );
  }
}

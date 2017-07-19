import React from 'react';
import { NavContainer } from '../nav/NavContainer';
import '../../../../styles/index.scss';

export const App = props => (
  <div>
    <NavContainer />
    <div className="main-container">
      {props.children}
    </div>
  </div>
);

App.propTypes = {
  children: React.PropTypes.node,
};

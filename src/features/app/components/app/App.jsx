import React from 'react';
import PropTypes from 'prop-types';
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
  children: PropTypes.node,
};

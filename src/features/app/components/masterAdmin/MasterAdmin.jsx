import React from 'react';
import { Link } from 'react-router';

export const MasterAdmin = props => (
  <div className="container">
    <h1 className="text-center">Master Administrator</h1>
    <div className="header-links">
      <Link to="/administrator/edittracks">Tracks</Link>
      <Link to="/administrator/editpasses">Passes</Link>
      <Link to="/administrator/editdances">Dances</Link>
      <Link to="/administrator/editconfig">Config</Link>
      <Link to="/administrator/editstore">Store</Link>
    </div>
    {React.cloneElement(props.children, { ...props })}
  </div>
);

MasterAdmin.propTypes = {
  children: React.PropTypes.node,
};

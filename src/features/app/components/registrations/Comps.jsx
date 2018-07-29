import React from 'react';
import _ from 'lodash';

export const Comps = (props) => {
  /* Components */
  const CompsList = () => {
    if (!_.isEmpty(props.comps)) {
      return props.comps.map(c => (
        <div className="info-container">
          {
            c.Key === 'AdNov' || c.Key === 'AmateurDraw' ?
              <span>{c.Name} - {c.Role}</span>
            :
              <span>{c.Name} - {c.Partner}</span>
          }
        </div>
      ));
    }
    return (
      <h4>No Comps Selected </h4>
    );
  };

  return (
    <div>
      <div className="comp-container">
        <h3><strong><u>Comps</u></strong></h3>
        <CompsList />
        <button className="btn btn-primary" onClick={() => props.toggleAddComps()}>Edit Comps</button>
      </div>
    </div>
  );
};

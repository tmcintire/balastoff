import * as React from 'react';
import { FunctionComponent } from 'react';
import * as _ from 'lodash';
import { IComps } from '../../../data/interfaces';

interface CompsProps {
  comps: IComps[],
  toggleAddComps: () => void,
}

export const Comps: FunctionComponent<CompsProps> = (props) => {
  /* Components */
  const CompsList = (props) => {
    if (!_.isEmpty(props.comps)) {
      return props.comps.map(c => (
        <div className="info-container">
          {
            c.key === 'AdNov' || c.key === 'AmateurDraw' ?
              <span>{c.name} - {c.role}</span>
            :
              <span>{c.name} - {c.partner}</span>
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

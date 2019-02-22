import * as React from 'react';
import { FunctionComponent, useState, useEffect } from 'react';
import { IRegistration } from '../../../data/interfaces';

interface LevelGraphProps {
  registrations: IRegistration[],
  level: string
}

export const LevelGraph: FunctionComponent<LevelGraphProps> = (props) => {
  const numLeads = props.registrations.filter(r => r.LeadFollow === 'Lead').length;
  const numFollows = props.registrations.filter(r => r.LeadFollow === 'Follow').length;
  const { level } = props;

  const total = numLeads + numFollows;

  const leadsStyle = {
    height: numLeads/total * 100 + '%',
    background: 'blue',
    width: '100%',
  };

  const followsStyle = {
    height: numFollows/total * 100 + '%',
    background: 'red',
    width: '100%',
  };

  return (
    <div>
      <h1>{level}</h1>
      <p>Leads: {numLeads}</p>
      <p>Follows: {numFollows}</p>

      <div className="graph-container flex-row">
        <div style={leadsStyle}>
        </div>
        <div style={followsStyle}>
        </div>
      </div>

    </div>
  );
}

import * as React from 'react';
import { FunctionComponent } from 'react';
import { IRegistration } from '../../../data/interfaces';

interface MercuryGraphProps {
  registrations: IRegistration[],
}

export const MercuryGraph: FunctionComponent<MercuryGraphProps> = (props) => {
  const numLeads = props.registrations.filter(r => r.LeadFollow === 'Lead').length;
  const numFollows = props.registrations.filter(r => r.LeadFollow === 'Follow').length;

  return (
    <div className="container form-container">
      <h1 className="text-center">Mercury</h1>
      <p>Leads: {numLeads}</p>
      <p>Follows: {numFollows}</p>
    </div>
  );
}

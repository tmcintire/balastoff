import * as React from 'react';
import { FunctionComponent } from 'react';
import { IRegistration } from '../../../data/interfaces';

interface ParticipantProps {
  registration: IRegistration,
}

export const Participant: FunctionComponent<ParticipantProps> = (props) => {
  const handleClick = (id) => {
    window.location.href = `#/admin/editparticipant/${id}`;
  }
  const { registration } = props;
  return (
    <div className="admin-participant flex-row flex-justify-space-between" onClick={() => handleClick(registration.BookingID)}>
      <span className="col-xs-2">{registration.BookingID}</span>
      <span className="col-xs-3">{registration.FirstName}</span>
      <span className="col-xs-3">{registration.LastName}</span>
      <span className="col-xs-2">{registration.Level}</span>
      <span className="col-xs-2">{registration.HasLevelCheck ? 'Yes' : 'No'}</span>
    </div>
  );
}

import * as api from '../../../data/api';
import * as React from 'react';
import { FunctionComponent, useState, useEffect } from 'react';
import { IRegistration } from '../../../data/interfaces';

interface LevelCheckInfoProps {
  registration: IRegistration,
  updated: boolean
}

export const LevelCheckInfo: FunctionComponent<LevelCheckInfoProps> = (props) => {
  const handleUpdate = (id) => {
    api.updateRegistration(id, {
      BadgeUpdated: this.badgeUpdatedCheckbox.checked,
    })
  }
  const checkUpdated = () => {
    if (props.updated) {
      return 'updated-badges';
    }
  }

  const { registration } = props;
  return (
    <div className={`container level-check-info ${checkUpdated()} flex-row`}>
      <span>{registration.BookingID}</span>
      <span>{registration.FirstName}</span>
      <span>{registration.LastName}</span>
      <span>{registration.Level}</span>
      <input
        type="checkbox"
        checked={registration.BadgeUpdated}
        ref={(ref) => { this.badgeUpdatedCheckbox = ref; }}
        onChange={() => handleUpdate(registration.BookingID)}
      />
    </div>
  );
}

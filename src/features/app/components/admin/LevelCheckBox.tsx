import * as React from 'react';
import { FunctionComponent, useState, useEffect } from 'react';
import * as api from '../../../data/api';
import { IRegistration } from '../../../data/interfaces';

interface LevelCheckBoxProps {
  registration: IRegistration,
}

export const LevelCheckBox: FunctionComponent<LevelCheckBoxProps> = (props) => {
  const { registration } = props;
  const [level, setLevel] = useState<string>('');
  const [highlighted, sethighlighted] = useState<boolean>(false);

  useEffect(() => {
    if (registration) {
      setLevel(registration.OriginalLevel);
    }
  }, [registration]);

  const acceptLevel = () => {
    const confirm = window.confirm(`Accept ${level} for number ${registration.BookingID}`);

    if (confirm === true) {
      api.updateRegistration(registration.BookingID, {
        LevelChecked: true,
        MissedLevelCheck: false,
        Level: level,
      });
    }
  };

  const missedLevelCheck = () => {
    const confirm = window.confirm(`Mark number ${registration.BookingID} as "Missed Level Check"?`);

    if (confirm === true) {
      api.updateRegistration(registration.BookingID, {
        MissedLevelCheck: true,
      });
    }
  };

  return (
    <div 
      className={`container level-check-form flex-col ${highlighted ? 'highlighted' : ''}`}>
      <div className="flex-row flex-align-center"  onClick={() => sethighlighted(!highlighted)}>
        <span className="levelcheck-box-id">{registration.BookingID}</span>
        <span className="levelcheck-box-name">{registration.FirstName} {registration.LastName}</span>
      </div>
      <div className="flex-row">
        <select
          className="level-check-dropdown form-control"
          value={level}
          onChange={e => setLevel(e.target.value)}
        >
          <option value="Beginner">Beginner</option>
          <option value="Mercury">Mercury</option>
          <option value="Gemini">Gemini</option>
          <option value="Apollo">Apollo</option>
          <option value="Skylab">Skylab</option>
          <option value="SpaceX">Space-X</option>
        </select>

        <i className="fa fa-check accept-level" aria-hidden="true" onClick={() => acceptLevel()} />
        <i className="fa fa-times no-level-check" aria-hidden="true" onClick={() => missedLevelCheck()} />
      </div>
    </div>
  );
};  

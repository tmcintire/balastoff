import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import * as api from '../../../data/api';
import { IRegistration, IMissionGearIssue } from '../../../data/interfaces';

interface MissionGearProps {
  issues: IMissionGearIssue[],
  id: number,
  saved: () => void,
  registration: IRegistration
}

export const MissionGear: FunctionComponent<MissionGearProps> = (props: MissionGearProps) => {
  const { id, saved, issues, registration } = props;
  const [showReportMissionGearIssue, setshowReportMissionGearIssue] = useState<boolean>(false); 
  const [issue, setIssue] = useState<string>(''); 

  const updateMerchCheckbox = (e, type) => {
    const object: IRegistration = {
      [type]: e.target.checked,
    };
    api.updateRegistration(id, object);
    saved();
  }

  const reportMissionGearIssue = (e) => {
    e.preventDefault();
    const { BookingID } = registration;

    const newIssue: IMissionGearIssue = {
      Issue: issue,
      Resolved: false,
      BookingID: BookingID,
    }

    api.reportMissionGearIssue(newIssue);
    setIssue('');
    saved();
  }

  const onKeyDown = (e) => {
    e.persist();
    if (e.keyCode === 13) {
      e.preventDefault();
      reportMissionGearIssue(e);
    }
  }

  const renderShirts = () => {
    if (registration.TShirts) {
      return (
        <tr>
          <td>{registration.TShirts}</td>
          <td>{registration.AllSizes1 || registration.LimitedSizes1}</td>
          <td className="text-center">
            <input
              className="no-outline"
              checked={registration.Shirt1}
              type="checkbox"
              onChange={e => updateMerchCheckbox(e, 'Shirt1')}
            />
          </td>
        </tr>
      );
    }
  };
  const renderAdditionalShirts = () => {
    if (registration.AdditionalTShirts) {
      return (
        <tr>
          <td>{registration.AdditionalTShirts}</td>
          <td>{registration.AllSizes2 || registration.LimitedSizes2}</td>
          <td className="text-center">
            <input
              className="no-outline"
              checked={registration.Shirt2}
              type="checkbox"
              onChange={e => updateMerchCheckbox(e, 'Shirt2')}
            />
          </td>
        </tr>
      );
    }
  };

  const renderReportMissionGearIssue = () => {
    if (showReportMissionGearIssue) {
      return (
        <div className="flex-col">
          <textarea
            value={issue}
            onChange={e => setIssue(e.target.value)}
            onKeyDown={e => onKeyDown(e)}
          />
          <button
            disabled={!issue}
            className="btn btn-primary"
            onClick={e => reportMissionGearIssue(e)}
          >
          Submit</button>
        </div>
      );
    }
  };

  const renderMissionGear = () => {
    if (!registration.TShirts && !registration.AdditionalTShirts && !registration['Limited Edition Patch']) {
      return (
        <h4>No mission gear ordered</h4>
      );
    }
    return (
      <div className="merch-container">
        <table className="table custom-table">
          <thead>
            <th>T-Shirt</th>
            <th>Size</th>
            <th>Picked Up</th>
          </thead>
          <tbody>
            {renderShirts()}
            {renderAdditionalShirts()}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
        <h3><strong>Mission Gear</strong></h3>
        {renderMissionGear()}
        <span className="link" onClick={() => setshowReportMissionGearIssue(!showReportMissionGearIssue)}>Report Mission Gear Issue</span>
        {renderReportMissionGearIssue()}
      </div>
  );
}

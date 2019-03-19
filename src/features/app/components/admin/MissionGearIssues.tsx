import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import { IMissionGearIssue, IRegistration } from '../../../data/interfaces';
import { toggleResolved } from '../../../data/helpers';

interface MissionGearIssuesProps {
  registrations: IRegistration[],
  issues: IMissionGearIssue[]
}

export const MissionGearIssues: FunctionComponent<MissionGearIssuesProps> = (props: MissionGearIssuesProps) => {
  const { issues, registrations } = props;
  const [showSaved, setShowSaved] = useState<boolean>(false); 

  const renderIssues = () => Object.keys(issues).map(key => {
    const issue: IMissionGearIssue = issues[key];

    if (!issue.Resolved) {
      const { FirstName, LastName } = registrations[issue.BookingID];
      return (
        <div key={key} className="flex-row">
          <span className="col-xs-1">{issue.BookingID}</span>
          <span className="col-xs-2">{FirstName}</span>
          <span className="col-xs-2">{LastName}</span>
          <span className="col-xs-5">{issue.Issue}</span>
          <span className="col-xs-2">
            <input
              type="checkbox"
              checked={issue.Resolved}
              onChange={e => {
                toggleResolved(issues, key);
                saved();
              }}
            />
          </span>
        </div>
      );
    }
    return null;
  });

  const renderResolvedIssues = () => Object.keys(issues).map(key => {
    const issue: IMissionGearIssue = issues[key];

    if (issue.Resolved) {
      const { FirstName, LastName } = registrations[issue.BookingID];
      return (
        <div key={key} className="flex-row resolved-class">
          <span className="col-xs-1">{issue.BookingID}</span>
          <span className="col-xs-2">{FirstName}</span>
          <span className="col-xs-2">{LastName}</span>
          <span className="col-xs-5">{issue.Issue}</span>
          <span className="col-xs-2">
            <input
              type="checkbox"
              checked={issue.Resolved}
              onChange={e => toggleResolved(issues, key)}
            />
          </span>
        </div>
      );
    }
    return null;
  });

  const saved = () => {
    setShowSaved(true);

    setTimeout(() => {
      setShowSaved(false);
    }, 2000);
  }

  const Saved = () => (showSaved ? <h4 className="saved-message">Saved</h4> : null);

  return (
    <div className="container mission-gear-issues">
        <Saved />
        <h1>Mission Gear Issues</h1>
        <div className="row issues-table-header">
          <span className="col-xs-1">ID</span>
          <span className="col-xs-2">First Name</span>
          <span className="col-xs-2">Last Name</span>
          <span className="col-xs-5">Issue</span>
          <span className="col-xs-2">Resolved</span>
        </div>
        <hr />
        <div className="issues-table row">
          {
            issues && renderIssues()
          }
        </div>

        <h1>Resolved Mission Gear Issues</h1>
        <div className="row issues-table-header">
          <span className="col-xs-1">ID</span>
          <span className="col-xs-2">First Name</span>
          <span className="col-xs-2">Last Name</span>
          <span className="col-xs-5">Issue</span>
          <span className="col-xs-2">Resolved</span>
        </div>
        <hr />
        <div className="issues-table row">
          {
            issues && renderResolvedIssues()
          }
        </div>
      </div>
  );
}

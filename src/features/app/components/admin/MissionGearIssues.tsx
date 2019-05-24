import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';
import * as _ from 'lodash';
import { Link } from 'react-router';
import * as api from '../../../data/api';
import { IMissionGearIssue, IRegistration } from '../../../data/interfaces';

const Loading = require('react-loading-animation');

interface MissionGearIssuesProps {
  registrations: IRegistration[],
}

interface MissionGearIssuesState {
  issues: IMissionGearIssue[],
  resolvedIssues: IMissionGearIssue[],
  showSaved: boolean,
}

export const MissionGearIssues: FunctionComponent<MissionGearIssuesProps> = (props) => {
  const { registrations } = props;
  const [issues, setIssues] = useState<IMissionGearIssue[]>([]);
  const [resolvedIssues, setResolvedIssues] = useState<IMissionGearIssue[]>([]);
  const [showSaved, setShowSaved] = useState<boolean>(false);


  useEffect(() => {
    if (registrations && registrations.length > 0) {
      setupState(registrations);
    }
  }, registrations);

  const setupState = (registrations: IRegistration[]) => {
    const issues = [];
    const resolvedIssues: IMissionGearIssue[] = [];
    _.forEach(registrations, (r) => {
      if (r) {
        if (r.MissionGearIssues) {
          _.forEach(r.MissionGearIssues, (i, index) => {
            if (i.Resolved === false) {
              issues.push(i);
            } else if (i.Resolved === true) {
              resolvedIssues.push(i);
            }
          });
        }
      }
    });

    setShowSaved(false);    
    setIssues(issues);
    setResolvedIssues(resolvedIssues);
  };


  const saved = () => {
    setShowSaved(true);
    setTimeout(() => {
      setShowSaved(false);
    }, 2000);
  };

  const toggleResolved = (bookingId: number, issueId: string) => {
    const registration = _.find(registrations, r => r && r.BookingID === bookingId);

    if (registration) {
      let updatedReg = {
        ...registration,
        MissionGearIssues: registration.MissionGearIssues.map(i => {
          return i.IssueId === issueId ? {...i, Resolved: !i.Resolved } : i;
        })
      }
  
      api.updateRegistration(bookingId, updatedReg);
      saved();
    }
  };

  const renderIssues = () => {
    if (issues) {
      return issues.map((issue) =>
        <div key={issue.IssueId} className="flex-row">
          <span className="col-xs-1">{issue.BookingID}</span>
          <span className="col-xs-2">{issue.FirstName}</span>
          <span className="col-xs-2">{issue.LastName}</span>
          <span className="col-xs-5">{issue.Issue}</span>
          <span className="col-xs-2">
            <input
              type="checkbox"
              checked={issue.Resolved}
              onChange={e => toggleResolved(issue.BookingID, issue.IssueId)}
            />
          </span>
        </div>
      );
    }
    return (
      <h3>No Issues</h3>
    );
  };

  const renderResolvedIssues = () => {
    if (resolvedIssues) {
      return resolvedIssues.map((issue) =>
        <div key={issue.IssueId} className="flex-row resolved-class">
          <span className="col-xs-1">{issue.BookingID}</span>
          <span className="col-xs-2">{issue.FirstName}</span>
          <span className="col-xs-2">{issue.LastName}</span>
          <span className="col-xs-5">{issue.Issue}</span>
          <span className="col-xs-2">
            <input
              type="checkbox"
              checked={issue.Resolved}
              onChange={e => toggleResolved(issue.BookingID, issue.IssueId)}
            />
          </span>
        </div>
      );
    }
    return (
      <h3>No Issues</h3>
    );
  };

  const renderSaved = () => (showSaved ? <h4 className="saved-message">Saved</h4> : null);
  return (
    <div className="container mission-gear-issues">
      {renderSaved()}
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
        {renderIssues()}
        {renderResolvedIssues()}
      </div>
    </div>
  );
};

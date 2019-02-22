import * as React from 'react';
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

export class MissionGearIssues extends React.Component<MissionGearIssuesProps, MissionGearIssuesState> {
  constructor(props) {
    super(props);

    if (props.registrations) {
      this.setupState(props.registrations);
    } else {
      this.state = {
        issues: [],
        resolvedIssues: [],
        showSaved: false,
      };
    }
  }

  componentDidUpdate(nextProps) {
    if (!_.isEqual(nextProps.registrations, this.props.registrations)) {
      this.setupState(nextProps.registrations);
    }
  }

  setupState(registrations: IRegistration[]) {
    const issues = [];
    const resolvedIssues: IMissionGearIssue[] = [];
    _.forEach(registrations, (r) => {
      if (r) {
        if (r.MissionGearIssues) {
          _.forEach(r.MissionGearIssues, (i, index) => {
            const issue: IMissionGearIssue = {
              IssueId: i.IssueId,
              BookingID: r.BookingID,
              FirstName: r.FirstName,
              LastName: r.LastName,
              Issue: i.Issue,
              Resolved: i.Resolved,
            };
            if (i.Resolved === false) {
              issues.push(issue);
            } else if (i.Resolved === true) {
              resolvedIssues.push(issue);
            }
          });
        }
      }
    });

    this.state = {
      issues,
      showSaved: false,
      resolvedIssues,
    };
  }

  saved = () => {
    this.setState({
      showSaved: true,
    });
    setTimeout(() => {
      this.setState({
        showSaved: false,
      });
    }, 2000);
  }

  toggleResolved = (bookingId: number, issueId: string) => {
    const registration = _.find(this.props.registrations, r => r && r.BookingID === bookingId);

    if (registration) {
      let updatedReg = {
        ...registration,
        MissionGearIssues: registration.MissionGearIssues.map(i => {
          return i.IssueId === issueId ? {...i, Resolved: !i.Resolved } : i;
        })
      }
  
      api.updateRegistration(bookingId, updatedReg);
      this.saved();
    }
  }

  render() {
    const renderIssues = () => {
      if (this.state.issues) {
        return this.state.issues.map((issue) =>
          <div key={issue.IssueId} className="flex-row">
            <span className="col-xs-1">{issue.BookingID}</span>
            <span className="col-xs-2">{issue.FirstName}</span>
            <span className="col-xs-2">{issue.LastName}</span>
            <span className="col-xs-5">{issue.Issue}</span>
            <span className="col-xs-2">
              <input
                type="checkbox"
                checked={issue.Resolved}
                onChange={e => this.toggleResolved(issue.BookingID, issue.IssueId)}
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
      if (this.state.resolvedIssues) {
        return this.state.resolvedIssues.map((issue) =>
          <div key={issue.IssueId} className="flex-row resolved-class">
            <span className="col-xs-1">{issue.BookingID}</span>
            <span className="col-xs-2">{issue.FirstName}</span>
            <span className="col-xs-2">{issue.LastName}</span>
            <span className="col-xs-5">{issue.Issue}</span>
            <span className="col-xs-2">
              <input
                type="checkbox"
                checked={issue.Resolved}
                onChange={e => this.toggleResolved(issue.BookingID, issue.IssueId)}
              />
            </span>
          </div>
        );
      }
      return (
        <h3>No Issues</h3>
      );
    };

    const renderSaved = () => (this.state.showSaved ? <h4 className="saved-message">Saved</h4> : null);
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
  }
}

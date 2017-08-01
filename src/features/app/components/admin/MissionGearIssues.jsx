import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import * as api from '../../../data/api';

const Loading = require('react-loading-animation');

export class MissionGearIssues extends React.Component {
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.registrations) {
      this.setupState(nextProps.registrations);
    }
  }

  setupState(registrations) {
    const issues = [];
    const resolvedIssues = [];
    _.forEach(registrations, (r) => {
      if (r) {
        if (r.MissionGearIssues) {
          _.forEach(r.MissionGearIssues, (i, index) => {
            const object = {
              index,
              BookingID: r.BookingID,
              'First Name': r['First Name'],
              'Last Name': r['Last Name'],
              Issue: i.Issue,
              Resolved: i.Resolved,
            };
            if (i.Resolved === false) {
              issues.push(object);
            } else if (i.Resolved === true) {
              resolvedIssues.push(object);
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

  toggleResolved = (e, id, index) => {
    const issue = this.props.registrations.filter(r => r.BookingID === id)[0].MissionGearIssues[index];
    const object = {
      MissionGearIssues: {
        [index]: {
          Issue: issue.Issue,
          Resolved: !issue.Resolved,
        },
      },
    };

    api.updateRegistration(id, object);
    this.saved();
  }

  render() {
    const renderIssues = () => {
      if (this.state.issues) {
        return this.state.issues.map((issue, index) =>
          <div key={index} className="flex-row">
            <span className="col-xs-1">{issue.BookingID}</span>
            <span className="col-xs-2">{issue['First Name']}</span>
            <span className="col-xs-2">{issue['Last Name']}</span>
            <span className="col-xs-5">{issue.Issue}</span>
            <span className="col-xs-2">
              <input
                type="checkbox"
                checked={issue.Resolved}
                onChange={e => this.toggleResolved(e, issue.BookingID, issue.index)}
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
        return this.state.resolvedIssues.map((issue, index) =>
          <div key={index} className="flex-row resolved-class">
            <span className="col-xs-1">{issue.BookingID}</span>
            <span className="col-xs-2">{issue['First Name']}</span>
            <span className="col-xs-2">{issue['Last Name']}</span>
            <span className="col-xs-5">{issue.Issue}</span>
            <span className="col-xs-2">
              <input
                type="checkbox"
                checked={issue.Resolved}
                onChange={e => this.toggleResolved(e, issue.BookingID, issue.index)}
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

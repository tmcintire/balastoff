import React from 'react';
import { Link } from 'react-router';
import * as api from '../../../data/api';
import { LevelCheckBox } from './LevelCheckBox';

const Loading = require('react-loading-animation');

export class MissedLevelCheck extends React.Component {
  constructor() {
    super();
    this.state = {
      filteredLeads: {},
      filteredFollows: {},
      loading: true,
    };
  }

  componentWillMount() {
    if (this.props.registrations) {
      const filteredLeads = this.props.registrations.filter(r =>
        r.HasLevelCheck === 'Yes' &&
        r.LeadFollow === 'Lead' &&
        r.LevelChecked === false &&
        r.MissedLevelCheck === true);

      const filteredFollows = this.props.registrations.filter(r =>
        r.HasLevelCheck === 'Yes' &&
        r.LeadFollow === 'Follow' &&
        r.LevelChecked === false &&
        r.MissedLevelCheck === true);

      this.setState({
        filteredLeads,
        filteredFollows,
        loading: false,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.registrations) {
      const filteredLeads = nextProps.registrations.filter(r =>
        r.HasLevelCheck === 'Yes' &&
        r.LeadFollow === 'Lead' &&
        r.LevelChecked === false &&
        r.MissedLevelCheck === true);

      const filteredFollows = nextProps.registrations.filter(r =>
        r.HasLevelCheck === 'Yes' &&
        r.LeadFollow === 'Follow' &&
        r.LevelChecked === false &&
        r.MissedLevelCheck === true);

      this.setState({
        filteredLeads,
        filteredFollows,
        loading: false,
      });
    }
  }


  render() {
    const renderLeads = () => {
      if (Object.keys(this.state.loading === false && this.state.filteredLeads).length > 0) {
        return this.state.filteredLeads.map((registration, index) => {
          if (registration) {
            return (
              <LevelCheckBox key={index} registration={registration} />
            );
          }
        });
      }
      return (
        <h3>None to show</h3>
      );
    };
    const renderFollows = () => {
      if (Object.keys(this.state.loading === false && this.state.filteredFollows).length > 0) {
        return this.state.filteredFollows.map((registration, index) => {
          if (registration) {
            return (
              <LevelCheckBox key={index} registration={registration} />
            );
          }
        });
      }
      return (
        <h3>None to show</h3>
      );
    };
    return (
      <div className="container form-container">
        <h1 className="text-center">Missed Level Check</h1>
        <div className="header-links">
          <Link to="/admin"><button className="btn btn-primary">Back to Admin</button></Link>
        </div>
        <hr />
        <div className="level-check-container flex-row flex-justify-space-between">
          <div className="leads-container">
            <h3 className="text-center">Leads</h3>
            {renderLeads()}
          </div>
          <div className="follows-container">
            <h3 className="text-center">Follows</h3>
            {renderFollows()}
          </div>
        </div>
      </div>
    );
  }
}

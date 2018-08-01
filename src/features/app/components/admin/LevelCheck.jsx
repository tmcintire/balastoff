import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { LevelCheckBox } from './LevelCheckBox';
import * as api from '../../../data/api';

const Loading = require('react-loading-animation');

export class LevelCheck extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.registrations) {
      const filteredLeads = nextProps.registrations.filter(r =>
        r.HasLevelCheck &&
        r.LeadFollow.toLowerCase() === 'lead' &&
        r.LevelChecked === false &&
        r.MissedLevelCheck === false &&
        r.CheckedIn === true &&
        _.includes(prevState.currentFilter, r.OriginalLevel));
      const filteredFollows = nextProps.registrations.filter(r =>
        r.HasLevelCheck &&
        r.LeadFollow.toLowerCase() === 'follow' &&
        r.LevelChecked === false &&
        r.MissedLevelCheck === false &&
        r.CheckedIn === true &&
        _.includes(prevState.currentFilter, r.OriginalLevel));
      return {
        filteredLeads,
        filteredFollows,
        loading: false,
      };
    }

    return null;
  }
  constructor(props) {
    super(props);

    this.state = {
      filteredLeads: {},
      filteredFollows: {},
      geminiFilter: ['Gemini'],
      apolloSkylabFilter: ['Apollo', 'Skylab'],
      mercuryFilter: ['Mercury'],
      currentFilter: ['Gemini'],
      showLeads: true,
      title: 'Gemini',
      loading: true,
    };
  }

  changeFilter = () => {
    const filter = _.includes(this.state.currentFilter, 'Gemini') ? this.state.apolloSkylabFilter : this.state.geminiFilter;

    const filteredLeads = this.props.registrations.filter(r => {
      return (
        _.includes(filter, r.OriginalLevel) &&
        r.LeadFollow === 'Lead' &&
        r.HasLevelCheck &&
        r.LevelChecked === false &&
        r.MissedLevelCheck === false &&
        r.CheckedIn === true
      );
    });

    const filteredFollows = this.props.registrations.filter(r => {
      return (
        _.includes(filter, r.OriginalLevel) &&
        r.LeadFollow === 'Follow' &&
        r.HasLevelCheck &&
        r.LevelChecked === false &&
        r.MissedLevelCheck === false &&
        r.CheckedIn === true
      );
    });
    
    const title = filter === this.state.geminiFilter ? 'Gemini' : 'Apollo/Skylab';

    this.setState({
      filteredLeads,
      filteredFollows,
      currentFilter: filter,
      title,
    });
  }

  toggleLeadFollow = () => {
    this.setState({
      showLeads: !this.state.showLeads,
    });
  }

  acceptAllLevels = () => {
    const level = _.includes(this.state.currentFilter, 'Apollo') ? 'Apollo' : 'Gemini';
    const leadFollow = this.state.showLeads ? 'leads' : 'follows';
    const confirm = window.confirm(`Place ALL remaining ${this.state.showLeads ? 'leads' : 'follows'} into ${level} ?`);

    if (confirm === true) {
      const reallyConfirm = window.confirm('Are you really sure?');

      // panic time, make a backup of the current registrations when anyone hits this button
      api.backupRegistrations(level, leadFollow);

      if (reallyConfirm === true) {
        if (this.state.showLeads) {
          _.forEach(this.state.filteredLeads, (lead) => {
            api.updateRegistration(lead.BookingID, {
              LevelChecked: true,
              MissedLevelCheck: false,
              Level: level,
            });
          });
        } else {
          _.forEach(this.state.filteredFollows, (follow) => {
            api.updateRegistration(follow.BookingID, {
              LevelChecked: true,
              MissedLevelCheck: false,
              Level: level,
            });
          });
        }
      }
    }
  }

  render() {
    const level = _.includes(this.state.currentFilter, 'Apollo') ? 'Apollo' : 'Gemini';
    const leadFollow = this.state.showLeads ? 'leads' : 'follows';
    
    const renderLeads = () => {
      if (Object.keys(this.state.loading === false && this.state.filteredLeads).length > 0) {
        return this.state.filteredLeads.map((registration) => {
          if (registration) {
            return (
              <LevelCheckBox key={registration.BookingID} registration={registration} />
            );
          }
        });
      }
      return (
        <h3>No Leads to show</h3>
      );
    };
    const renderFollows = () => {
      if (Object.keys(this.state.loading === false && this.state.filteredFollows).length > 0) {
        return this.state.filteredFollows.map((registration) => {
          if (registration) {
            return (
              <LevelCheckBox key={registration.BookingID} registration={registration} />
            );
          }
        });
      }
      return (
        <h3>No Follows to show</h3>
      );
    };
    return (
      <div className="container form-container">
        <div className="header-links">
          <Link to="/admin"><button className="btn btn-primary">Back</button></Link>
        </div>
        <div className="level-check-filters">
          <span onClick={() => this.changeFilter()}>Level</span>
          <span>|</span>
          <span onClick={() => this.toggleLeadFollow()}>Lead/Follow</span>
        </div>
        <div className="level-check-title text-center">{this.state.title} <span className="capitalize">{leadFollow}</span></div>
        <hr />
        <div className="level-check-container flex-row flex-justify-space-between">
          <div className={`leads-container ${!this.state.showLeads ? 'hidden' : ''}`}>
            {renderLeads()}
          </div>
          <div className={`follows-container ${this.state.showLeads ? 'hidden' : ''}`}>
            {renderFollows()}
          </div>
        </div>
        <div className="accept-all-btn  flex-row flex-justify-center">
          <div className="btn btn-danger" onClick={this.acceptAllLevels}>Place ALL remaining {leadFollow} in {level}</div>
        </div>
      </div>
    );
  }
}

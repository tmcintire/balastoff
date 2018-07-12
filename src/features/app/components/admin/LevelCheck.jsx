import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import * as api from '../../../data/api';
import { LevelCheckBox } from './LevelCheckBox';

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
      apolloFilter: ['Apollo'],
      skylabFilter: ['Skylab'],
      mercuryFilter: ['Mercury'],
      currentFilter: ['Gemini'],
      showLeads: true,
      title: 'Gemini',
      loading: true,
    };
  }

  changeFilter = (filter) => {
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

    this.setState({
      filteredLeads,
      filteredFollows,
      currentFilter: filter,
      title: filter[0],
    });
  }

  handleValueChange = (e) => {
    e.preventDefault();
    const target = e.target.value;
    const { registrations } = this.props;

    let filteredLeads = registrations.filter(reg => {
      if (reg) {
        return (
          _.isEqual(reg.BookingID, target)
        );
      }
    });

    let filteredFollows = registrations.filter(reg => {
      if (reg) {
        return (
          _.isEqual(reg.BookingID, target)
        );
      }
    });

    if (target === '') {
      filteredRegistrations = registrations;
    }

    this.setState({
      filteredRegistrations,
    });
  }


  toggleLeadFollow = () => {
    this.setState({
      showLeads: !this.state.showLeads,
    });
  }

  render() {
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
        <Loading />
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
        <Loading />
      );
    };
    return (
      <div className="container form-container">
        <h1 className="text-center">{this.state.title} Level Check</h1>
        <div className="header-links">
          <Link to="/admin"><button className="btn btn-primary">Back to Admin</button></Link>
          <Link to="/admin/levelcheckupdates">View Completed Level Checks</Link>
        </div>
        <div className="level-check-filters">
          <span onClick={() => this.toggleLeadFollow()}>Toggle Lead/Follow</span>
          <span onClick={() => this.changeFilter(this.state.geminiFilter)}>Gemini</span>
          <span onClick={() => this.changeFilter(this.state.apolloFilter)}>Apollo</span>
          <span onClick={() => this.changeFilter(this.state.skylabFilter)}>Skylab</span>

        </div>
        <hr />
        <div className="level-check-container flex-row flex-justify-space-between">
          <div className={`leads-container ${!this.state.showLeads ? 'hidden' : ''}`}>
            <h3 className="text-center">Leads</h3>
            {renderLeads()}
          </div>
          <div className={`follows-container ${this.state.showLeads ? 'hidden' : ''}`}>
            <h3 className="text-center">Follows</h3>
            {renderFollows()}
          </div>
        </div>
      </div>
    );
  }
}

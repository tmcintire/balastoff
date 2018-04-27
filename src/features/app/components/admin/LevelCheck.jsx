import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import * as api from '../../../data/api';
import { LevelCheckBox } from './LevelCheckBox';

const Loading = require('react-loading-animation');

export class LevelCheck extends React.Component {
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

  componentWillMount() {
    if (this.props.registrations) {
      const filteredLeads = this.props.registrations.filter(r =>
        r.HasLevelCheck === 'Yes' &&
        r.LeadFollow === 'Lead' &&
        r.LevelChecked === false &&
        r.MissedLevelCheck === false &&
        _.includes(this.state.currentFilter, r.OriginalLevel));
      const filteredFollows = this.props.registrations.filter(r =>
        r.HasLevelCheck === 'Yes' &&
        r.LeadFollow === 'Follow' &&
        r.LevelChecked === false &&
        r.MissedLevelCheck === false &&
        _.includes(this.state.currentFilter, r.OriginalLevel));
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
        r.MissedLevelCheck === false &&
        _.includes(this.state.currentFilter, r.OriginalLevel));
      const filteredFollows = nextProps.registrations.filter(r =>
        r.HasLevelCheck === 'Yes' &&
        r.LeadFollow === 'Follow' &&
        r.LevelChecked === false &&
        r.MissedLevelCheck === false &&
        _.includes(this.state.currentFilter, r.OriginalLevel));
      this.setState({
        filteredLeads,
        filteredFollows,
        loading: false,
      });
    }
  }

  changeFilter = (filter) => {
    const filteredLeads = this.props.registrations.filter(r => {
      return (
        _.includes(filter, r.OriginalLevel) &&
        r.LeadFollow === 'Lead' &&
        r.HasLevelCheck === 'Yes' &&
        r.LevelChecked === false &&
        r.MissedLevelCheck === false
      );
    });

    const filteredFollows = this.props.registrations.filter(r => {
      return (
        _.includes(filter, r.OriginalLevel) &&
        r.LeadFollow === 'Follow' &&
        r.HasLevelCheck === 'Yes' &&
        r.LevelChecked === false &&
        r.MissedLevelCheck === false
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
          <span onClick={() => this.changeFilter(this.state.apolloSkylabFilter)}>Apollo/Skylab</span>
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

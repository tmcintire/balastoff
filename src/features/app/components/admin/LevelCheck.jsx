import React from 'react';
import { Link } from 'react-router';
import * as api from '../../../data/api';
import { LevelCheckBox } from './LevelCheckBox';

const Loading = require('react-loading-animation');

export class LevelCheck extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filteredLeads: {},
      filteredFollows: {},
      filter: '',
      loading: true,
    };
  }

  componentWillMount() {
    if (this.props.registrations) {
      const filteredLeads = this.props.registrations.filter(r =>
        r.HasLevelCheck === 'Yes' &&
        r.LeadFollow === 'Lead' &&
        r.LevelChecked === false);
      const filteredFollows = this.props.registrations.filter(r =>
        r.HasLevelCheck === 'Yes' &&
        r.LeadFollow === 'Follow' &&
        r.LevelChecked === false);
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
        r.LevelChecked === false);
      const filteredFollows = nextProps.registrations.filter(r =>
        r.HasLevelCheck === 'Yes' &&
        r.LeadFollow === 'Follow' &&
        r.LevelChecked === false);
      this.setState({
        filteredLeads,
        filteredFollows,
        loading: false,
      });
    }
  }

  changeFilter = (filter) => {
    let tracks = [];
    if (filter === 'Gemini') {
      tracks = ['Gemini'];
    } else {
      tracks = ['Apollo', 'Skylab'];
    }
    const filteredLeads = this.props.registrations.filter(r => {
      return (
        (r.Level === tracks[0] || r.Level === tracks[1]) &&
        r.LeadFollow === 'Lead' &&
        r.HasLevelCheck === 'Yes' &&
        r.LevelChecked === false
      );
    });

    const filteredFollows = this.props.registrations.filter(r => {
      return (
        (r.Level === tracks[0] || r.Level === tracks[1]) &&
        r.LeadFollow === 'Follow' &&
        r.HasLevelCheck === 'Yes' &&
        r.LevelChecked === false
      );
    });

    this.setState({
      filteredLeads,
      filteredFollows,
      filter,
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
        <Loading />
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
        <Loading />
      );
    };
    return (
      <div className="container form-container">
        <h1 className="text-center">Level Check</h1>
        <div className="header-links">
          <Link to="/admin"><button className="btn btn-primary">Back to Admin</button></Link>
          <Link to="/admin/levelcheckupdates">View Completed Level Checks</Link>
        </div>
        <div className="level-check-filters">
          <span onClick={() => this.changeFilter('Gemini')}>Gemini</span>
          <span onClick={() => this.changeFilter('Apollo')}>Apollo/Skylab</span>
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

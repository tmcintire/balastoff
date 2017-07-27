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
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.registrations) {
      const filteredLeads = nextProps.registrations.filter(r => r.HasLevelCheck === 'Yes' && r.LeadFollow === 'Lead');
      const filteredFollows = nextProps.registrations.filter(r => r.HasLevelCheck === 'Yes' && r.LeadFollow === 'Follow');
      this.setState({
        filteredLeads,
        filteredFollows,
      });
    }
  }

  changeFilter = (filter) => {
    const filteredLeads = this.props.registrations.filter(r => {
      return (
        r.Level === filter &&
        r.LeadFollow === 'Lead' &&
        r.HasLevelCheck === 'Yes'
      );
    });

    const filteredFollows = this.props.registrations.filter(r => {
      return (
        r.Level === filter &&
        r.LeadFollow === 'Follow' &&
        r.HasLevelCheck === 'Yes'
      );
    });

    this.setState({
      filteredLeads,
      filteredFollows,
    });
  }

  removeFilter = () => {
    this.setState({
      filteredLeads: this.props.registrations.filter(r => r.LeadFollow === 'Lead'),
      filteredFollows: this.props.registrations.filter(r => r.LeadFollow === 'Follow'),
    });
  }

  handleValueChange = (e) => {
    e.preventDefault();
    const target = e.target.value;
    const { registrations } = this.props;

    let filteredRegistrations = registrations.filter(reg => {
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
      if (this.props.loading === false && this.state.filteredLeads !== undefined) {
        return this.state.filteredLeads.map((registration, index) => {
          if (registration) {
            return (
              <LevelCheckBox key={index} registration={registration} />
            );
          }
        });
      }
      return true;
    };
    const renderFollows = () => {
      if (this.props.loading === false && this.state.filteredFollows !== undefined) {
        return this.state.filteredFollows.map((registration, index) => {
          if (registration) {
            return (
              <LevelCheckBox key={index} registration={registration} />
            );
          }
        });
      }
      return true;
    };
    return (
      <div className="container form-container">
        <h1 className="text-center">Level Check</h1>
        <div className="level-check-filters">
          <span onClick={() => this.removeFilter()}>All</span>
          <span onClick={() => this.changeFilter('Gemini')}>Gemini</span>
          <span onClick={() => this.changeFilter('Apollo')}>Apollo</span>
          <span onClick={() => this.changeFilter('Skylab')}>Skylab</span>
        </div>
        <label htmlFor="search">Search Registrations</label>
        <input className="search" id="search" type="text" onChange={this.handleValueChange} />
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

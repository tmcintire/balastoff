import React from 'react';
import { Link } from 'react-router';
import * as api from '../../../data/api';
import { LevelCheckInfo } from './LevelCheckInfo';
import { GeminiBadges } from './GeminiBadges';

const Loading = require('react-loading-animation');

export class LevelCheckUpdates extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      updatedRegistrations: {},
      pendingRegistrations: {},
      loading: true,
      filter: ['Gemini'],
      title: 'Gemini',
    };
  }

  componentWillMount() {
    if (this.props.registrations) {
      const updatedRegistrations = this.props.registrations.filter(r =>
        r.LevelChecked === true &&
        r.BadgeUpdated === true &&
        r.Level === this.state.filter &&
        r.MissedLevelCheck === false);
      const pendingRegistrations = this.props.registrations.filter(r =>
        r.LevelChecked === true &&
        r.BadgeUpdated === false &&
        r.Level === this.state.filter &&
        r.MissedLevelCheck === false);

      this.setState({
        updatedRegistrations,
        pendingRegistrations,
        loading: false,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.registrations) {
      const updatedRegistrations = nextProps.registrations.filter(r =>
        r.LevelChecked === true &&
        r.BadgeUpdated === true &&
        r.MissedLevelCheck === false &&
        (r.Level === this.state.filter[0] || r.Level === this.state.filter[1]));
      const pendingRegistrations = nextProps.registrations.filter(r =>
        r.LevelChecked === true &&
        r.BadgeUpdated === false &&
        r.MissedLevelCheck === false &&
        (r.Level === this.state.filter[0] || r.Level === this.state.filter[1]));

      this.setState({
        updatedRegistrations,
        pendingRegistrations,
        loading: false,
      });
    }
  }

  changeFilter = (filter) => {
    let newFilter = [];
    if (filter === 'Gemini') {
      newFilter = ['Gemini'];
    } else {
      newFilter = ['Apollo', 'Skylab'];
    }
    const updatedRegistrations = this.props.registrations.filter(r =>
      (r.Level === newFilter[0] || r.Level === newFilter[1]) &&
      r.HasLevelCheck === 'Yes' &&
      r.LevelChecked === true &&
      r.BadgeUpdated === true &&
      r.MissedLevelCheck === false
    );

    const pendingRegistrations = this.props.registrations.filter(r => {
      return (
        (r.Level === newFilter[0] || r.Level === newFilter[1]) &&
        r.HasLevelCheck === 'Yes' &&
        r.LevelChecked === true &&
        r.BadgeUpdated === false &&
        r.MissedLevelCheck === false
      );
    });

    let title = '';
    if (filter === 'Apollo') {
      title = 'Apollo/Skylab';
    } else if (filter === 'Gemini') {
      title = 'Gemini';
    }

    this.setState({
      updatedRegistrations,
      pendingRegistrations,
      filter: newFilter,
      title,
    });
  }

  render() {
    const renderUpdatedRegistrations = () =>
      this.state.updatedRegistrations.map((registration, index) => {
        if (registration) {
          return (
            <LevelCheckInfo updated key={index} registration={registration} />
          );
        }
      });

    const renderPendingRegistrations = () =>
      this.state.pendingRegistrations.map((registration, index) => {
        if (registration) {
          return (
            <LevelCheckInfo updated={false} key={index} registration={registration} />
          );
        }
      });

    const renderRegistrations = () => {
      if (this.state.loading === false) {
        return (
          <div>
            <h3 className="text-center">Pending Badge Updates</h3>
            <hr />
            {renderPendingRegistrations()}

            <h3 className="text-center">Updated Badges</h3>
            <hr />
            {renderUpdatedRegistrations()}
          </div>
        );
      }
      return (
        <Loading />
      );
    };

    return (
      <div className="container form-container">
        <Link to="/admin/levelcheck"><button className="btn btn-primary">Back to Level Check</button></Link>
          <div className="level-check-filters">
            <span onClick={() => this.changeFilter('Gemini')}>Gemini</span>
            <span onClick={() => this.changeFilter('Apollo')}>Apollo/Skylab</span>
          </div>
        <h1 className="text-center">{this.state.title}</h1>
        {renderRegistrations()}
      </div>
    );
  }
}

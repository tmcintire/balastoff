import React from 'react';
import { Link } from 'react-router';
import { LevelCheckInfo } from './LevelCheckInfo';

const Loading = require('react-loading-animation');

export class LevelCheckUpdates extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.registrations) {
      const updatedRegistrations = nextProps.registrations.filter(r =>
        r.LevelChecked === true &&
        r.BadgeUpdated === true &&
        r.MissedLevelCheck === false &&
        (r.OriginalLevel === prevState.filter[0] || r.OriginalLevel === prevState.filter[1]));
      const pendingRegistrations = nextProps.registrations.filter(r =>
        r.LevelChecked === true &&
        r.BadgeUpdated === false &&
        r.MissedLevelCheck === false &&
        (r.OriginalLevel === prevState.filter[0] || r.OriginalLevel === prevState.filter[1]));

      return {
        updatedRegistrations,
        pendingRegistrations,
        loading: false,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      updatedRegistrations: {},
      pendingRegistrations: {},
      loading: true,
      filter: ['Gemini'],
      title: 'Complete Gemini Level Checks',
    };
  }

  changeFilter = (filter) => {
    let newFilter = [];
    if (filter === 'Gemini') {
      newFilter = ['Gemini'];
    } else {
      newFilter = ['Apollo', 'Skylab'];
    }
    const updatedRegistrations = this.props.registrations.filter(r =>
      (r.OriginalLevel === newFilter[0] || r.OriginalLevel === newFilter[1]) && r.HasLevelCheck && r.LevelChecked && r.BadgeUpdatede && !r.MissedLevelCheck
    );

    const pendingRegistrations = this.props.registrations.filter(r => {
      return (
        (r.OriginalLevel === newFilter[0] || r.OriginalLevel === newFilter[1]) && r.HasLevelCheck && r.LevelChecked && !r.BadgeUpdated && !r.MissedLevelCheck
      );
    });

    let title = '';
    if (filter === 'Gemini') {
      title = 'Complete Gemini Level Checks';
    } else {
      title = 'Complete Apollo/Skylab Level Checks';
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
        <h1 className="text-center">{this.state.title}</h1>
        <div className="header-links">
          <Link to="admin/levelcheck"><button className="btn btn-primary">Back to Level Checks</button></Link>
        </div>
        <div className="level-check-filters">
          <span onClick={() => this.changeFilter('Gemini')}>Gemini</span>
          <span onClick={() => this.changeFilter('Apollo')}>Apollo/Skylab</span>
        </div>
        {renderRegistrations()}
      </div>
    );
  }
}

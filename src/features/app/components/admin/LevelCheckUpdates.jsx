import React from 'react';
import { LevelCheckInfo } from './LevelCheckInfo';

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
        r.OriginalLevel === this.state.filter &&
        r.MissedLevelCheck === false);
      const pendingRegistrations = this.props.registrations.filter(r =>
        r.LevelChecked === true &&
        r.BadgeUpdated === false &&
        r.OriginalLevel === this.state.filter &&
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
        (r.OriginalLevel === this.state.filter[0] || r.OriginalLevel === this.state.filter[1]));
      const pendingRegistrations = nextProps.registrations.filter(r =>
        r.LevelChecked === true &&
        r.BadgeUpdated === false &&
        r.MissedLevelCheck === false &&
        (r.OriginalLevel === this.state.filter[0] || r.OriginalLevel === this.state.filter[1]));

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
    } else if (filter === 'Apollo') {
      newFilter = ['Apollo'];
    } else {
      newFilter = ['Skylab'];
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
    if (filter === 'Apollo') {
      title = 'Apollo';
    } else if (filter === 'Gemini') {
      title = 'Gemini';
    } else if (filter === 'Skylab') {
      title = 'Skylab';
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
          <div className="level-check-filters">
            <span onClick={() => this.changeFilter('Gemini')}>Gemini</span>
            <span onClick={() => this.changeFilter('Apollo')}>Apollo</span>
            <span onClick={() => this.changeFilter('Skylab')}>Skylab</span>
          </div>
        <h1 className="text-center">{this.state.title}</h1>
        {renderRegistrations()}
      </div>
    );
  }
}

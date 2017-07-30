import React from 'react';
import { Link } from 'react-router';
import * as api from '../../../data/api';
import { LevelCheckInfo } from './LevelCheckInfo';

const Loading = require('react-loading-animation');

export class LevelCheckUpdates extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      updatedRegistrations: {},
      pendingRegistrations: {},
      loading: true,
    };
  }

  componentWillMount() {
    if (this.props.registrations) {
      const updatedRegistrations = this.props.registrations.filter(r =>
        r.LevelChecked === true && r.BadgeUpdated === true);
      const pendingRegistrations = this.props.registrations.filter(r =>
        r.LevelChecked === true && r.BadgeUpdated === false);

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
        r.LevelChecked === true && r.BadgeUpdated === true);
      const pendingRegistrations = nextProps.registrations.filter(r =>
        r.LevelChecked === true && r.BadgeUpdated === false);

      this.setState({
        updatedRegistrations,
        pendingRegistrations,
        loading: false,
      });
    }
  }
  render() {
    const renderUpdatedRegistrations = () =>
      this.state.updatedRegistrations.map((registration, index) => {
        if (registration) {
          return (
            <LevelCheckInfo key={index} registration={registration} />
          );
        }
      });

    const renderPendingRegistrations = () =>
      this.state.pendingRegistrations.map((registration, index) => {
        if (registration) {
          return (
            <LevelCheckInfo key={index} registration={registration} />
          );
        }
      });

    const renderRegistrations = () => {
      if (this.state.loading === false) {
        return (
          <div>
            <h1 className="text-center">Pending Badge Updates</h1>
            <hr />
            {renderPendingRegistrations()}

            <h1 className="text-center">Updated Badges</h1>
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
        {renderRegistrations()}
      </div>
    );
  }
}

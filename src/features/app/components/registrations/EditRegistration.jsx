import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import * as api from '../../../data/api';

import { Comps } from './Comps';
import { MissionGear } from './MissionGear';
import { Level } from './Level';

const Loading = require('react-loading-animation');

export class EditRegistration extends React.Component {
  constructor() {
    super();
    this.state = {
      registration: {},
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.registrations) {
      const registration = nextProps.registrations.filter(reg =>
        reg.BookingID === nextProps.params.id)[0];
      this.setState({
        registration,
      });
    }
  }

  saveForm(e) {
    e.preventDefault();
    let hasComments;

    if (!_.isEmpty(this.comments.value)) {
      hasComments = true;
    } else {
      hasComments = false;
    }
    const object = {
      Comments: this.comments.value,
      HasComments: hasComments,
    };
    api.updateRegistration(this.props.params.id, object);
  }

  backToRegistrations = () => {
    window.location('/');
  }
  render() {
    const {registration} = this.state;
    const renderRegistration = () => {
      if (this.props.loading) {
        return (
          <Loading />
        );
      }
      return (
        <div>
          <Link to={'/'}><button className="btn btn-primary custom-buttons">Back to Registrations</button></Link>
          <h1 className="text-center">View Registration</h1>
          <h3 className="text-center">{registration['First Name']} {registration['Last Name']}</h3>

          <hr />
          <div className="flex-row flex-justify-space-around">
            <Comps registration={registration} />
            <Level
              level={registration.Level}
              hasLevelCheck={registration.HasLevelCheck}
            />
          </div>

          <hr />
          <div className="flex-row flex-justify-space-around">
            <MissionGear registration={registration} />
          </div>

        </div>
      );
    };
    return (
      <div className="container">
        {renderRegistration()}
      </div>
    );
  }
}

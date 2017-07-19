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
      loading: true,
      showSaved: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.registrations) {
      const registration = nextProps.registrations.filter(reg =>
        reg.BookingID === nextProps.params.id)[0];
      this.setState({
        registration,
        loading: false,
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

  saved = () => {
    this.setState({
      showSaved: true,
    });
    setTimeout(() => {
      this.setState({
        showSaved: false,
      });
    }, 2000);
  }
  render() {
    const {registration} = this.state;
    const renderSaved = () => (this.state.showSaved ? <h4 className="saved-message">Saved</h4> : null);
    const renderRegistration = () => {
      if (this.state.loading) {
        return (
          <Loading />
        );
      }
      return (
        <div>
          {renderSaved()}
          <Link to={'/'}><button className="btn btn-primary custom-buttons">Back to Registrations</button></Link>
          <h1 className="text-center">View Registration</h1>
          <h3 className="text-center">{registration['First Name']} {registration['Last Name']}</h3>

          <hr />
          <div className="flex-row flex-justify-space-around">
            <Comps
              id={this.props.params.id}
              registration={registration}
            />
            <Level
              saved={this.saved}
              id={this.props.params.id}
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

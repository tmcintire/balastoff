import React from 'react';
import { Link } from 'react-router';
import * as api from '../../../data/api';

const Loading = require('react-loading-animation');

export class LevelCheckBox extends React.Component {

  handleChange(e) {
    const object = {
      LevelCheckTrack: e.target.value,
      Level: e.target.value,
      LevelChecked: true,
    };
    api.updateRegistration(this.props.registration.BookingID, object);
  }

  acceptLevel = () => {
    const confirm = window.confirm(`Accept ${this.props.registration.Level} for number ${this.props.registration.BookingID}`);

    if (confirm === true) {
      api.updateRegistration(this.props.registration.BookingID, {
        LevelChecked: true,
      });
    } else if (confirm === false) {
      this.AcceptLevel.checked = false;
    }
  }

  render() {
    return (
      <div className="container level-check-form flex-row">
        <span>{this.props.registration.BookingID}</span>
        <select className="level-check-dropdown form-control"
          value={this.props.registration.Level}
          onChange={e => this.handleChange(e)}
        >
          <option value="Beginner">Beginner</option>
          <option value="Mercury">Mercury</option>
          <option value="Gemini">Gemini</option>
          <option value="Apollo">Apollo</option>
          <option value="Skylab">Skylab</option>
          <option value="Space-X">Space-X</option>
        </select>

        <i className="fa fa-check accept-level" aria-hidden="true" onClick={() => this.acceptLevel()} />
      </div>
    );
  }
}

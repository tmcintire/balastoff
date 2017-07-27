import React from 'react';
import { Link } from 'react-router';
import * as api from '../../../data/api';

const Loading = require('react-loading-animation');

export class LevelCheckBox extends React.Component {

  handleChange(e) {
    const object = {
      LevelCheckTrack: e.target.value,
      Level: e.target.value,
    }
    api.updateRegistration(this.props.registration.BookingID, object);
  }
  render() {
    return (
      <div className="container level-check-form flex-row">
        {this.props.registration.BookingID}
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
      </div>
    );
  }
}

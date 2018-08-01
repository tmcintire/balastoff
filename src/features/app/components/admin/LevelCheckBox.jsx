import React from 'react';
import * as api from '../../../data/api';

export class LevelCheckBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      level: props.registration.OriginalLevel,
      highlighted: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.registration) {
      this.setState({
        level: nextProps.registration.OriginalLevel,
      });
    }
  }

  handleChange(e) {
    this.setState({
      level: e.target.value,
    });
  }

  acceptLevel = () => {
    const confirm = window.confirm(`Accept ${this.state.level} for number ${this.props.registration.BookingID}`);

    if (confirm === true) {
      api.updateRegistration(this.props.registration.BookingID, {
        LevelChecked: true,
        MissedLevelCheck: false,
        Level: this.state.level,
      });
    }
  }

  missedLevelCheck = () => {
    const confirm = window.confirm(`Mark number ${this.props.registration.BookingID} as "Missed Level Check"?`);

    if (confirm === true) {
      api.updateRegistration(this.props.registration.BookingID, {
        MissedLevelCheck: true,
      });
    }
  }

  highlight = () => {
    this.setState({
      highlighted: !this.state.highlighted,
    });
  }

  render() {
    return (
      <div className={`container level-check-form flex-col ${this.state.highlighted ? 'highlighted' : ''}`}>
        <div className="flex-row flex-align-center" onClick={() => this.highlight()}>
          <span className="levelcheck-box-id">{this.props.registration.BookingID}</span>
          <span className="levelcheck-box-name">{this.props.registration['First Name']} {this.props.registration['Last Name']}</span>
        </div>
        <div className="flex-row">
          <select
            className="level-check-dropdown form-control"
            value={this.state.level}
            onChange={e => this.handleChange(e)}
          >
            <option value="Beginner">Beginner</option>
            <option value="Mercury">Mercury</option>
            <option value="Gemini">Gemini</option>
            <option value="Apollo">Apollo</option>
            <option value="Skylab">Skylab</option>
            <option value="SpaceX">Space-X</option>
          </select>

          <i className="fa fa-check accept-level" aria-hidden="true" onClick={() => this.acceptLevel()} />
          <i className="fa fa-times no-level-check" aria-hidden="true" onClick={() => this.missedLevelCheck()} />
        </div>
      </div>
    );
  }
}

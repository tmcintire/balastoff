import React from 'react';
import { Link } from 'react-router';
import * as api from '../../../data/api';

const Loading = require('react-loading-animation');

export class EditParticipant extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      track: '',
    };
  }

  handleValueChange = (e) => {
    e.preventDefault();
    this.setState({
      track: e.target.value,
    });
  }

  handleUpdate = (e, id, level) => {
    e.preventDefault();

    api.updateTrack(id, level);
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    const renderForm = () => {
      if (this.props.loading === true) {
        return (
          <Loading />
        );
      }
      if (this.props.loading === false) {
        const participant = this.props.registrations.filter((reg) => {
          return reg.BookingID === this.props.params.id;
        })[0];

        // const { name, type, time, fee, max_fee, band_minimum, cash } = this.props.event;
        // const { id } = this.props.params;
        return (
          <div>
            <div className="form-container">
              <Link to={'admin'}><button className="btn btn-primary custom-buttons">Back to Participants</button></Link>
              <h1 className="text-center">Modify Participant</h1>
              <h4 className="text-center">{participant['First Name']} {participant['Last Name']}</h4>
              <div className="form-group">
                <form>
                  <label htmlFor="type">Track</label>
                  <select className="form-control" id="type" defaultValue={participant.Level} onChange={this.handleValueChange}>
                    <option value="Beginner">Beginner</option>
                    <option value="Mercury">Mercury</option>
                    <option value="Gemini">Gemini</option>
                    <option value="Apollo">Apollo</option>
                    <option value="Skylab">Skylab</option>
                    <option value="Space-X">Space-X</option>
                  </select>

                  <button onClick={e => this.handleCancel(e)} className="btn btn-danger custom-buttons">Cancel</button>
                  <button onClick={e => this.handleUpdate(e, this.props.params.id, participant.level)} className="btn btn-success custom-buttons">Update</button>
                  <br />
                </form>
              </div>
            </div>
          </div>
        );
      }
      return true;
    };
    return (
      <div className="form-container">
        {renderForm()}
      </div>
    );
  }
}

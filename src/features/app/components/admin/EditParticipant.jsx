import React from 'react';
import { Link } from 'react-router';
import * as api from '../../../data/api';

const Loading = require('react-loading-animation');

export class EditParticipant extends React.Component {
  handleValueChange = (e) => {
    e.preventDefault();
    this.setState({
      track: e.target.value,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const object = {
      Level: this.Level.value,
      HasLevelCheck: this.HasLevelCheck.value,
      LeadFollow: this.LeadFollow.value,
      'Amount Owed': this.AmountOwed.value,
      HasPaid: this.HasPaid.value,
    };

    api.updateRegistration(this.props.params.id, object);
    window.location = ('#/admin');
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
                  <select className="form-control" id="type" defaultValue={participant.Level} ref={(ref) => { this.Level = ref; }}>
                    <option value="DancePass">Dance Pass</option>
                    <option value="Staff">Staff</option>
                    <option value="Other">Other</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Mercury">Mercury</option>
                    <option value="Gemini">Gemini</option>
                    <option value="Apollo">Apollo</option>
                    <option value="Skylab">Skylab</option>
                    <option value="Space-X">Space-X</option>
                  </select>
                  <label htmlFor="type">Has Level Check</label>
                  <select className="form-control" defaultValue={participant.HasLevelCheck} ref={(ref) => { this.HasLevelCheck = ref; }} >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  <label htmlFor="type">Lead/Follow</label>
                  <select className="form-control" defaultValue={participant.LeadFollow} ref={(ref) => { this.LeadFollow = ref; }} >
                    <option value="Lead">Lead</option>
                    <option value="Follow">Follow</option>
                  </select>
                  <label htmlFor="type">Amount Owed</label>
                  <input className="form-control" type="text" defaultValue={participant['Amount Owed']} ref={(ref) => { this.AmountOwed = ref; }} />

                  <label htmlFor="type">Paid in full</label>
                  <select className="form-control" defaultValue={participant.HasPaid} ref={(ref) => { this.HasPaid = ref; }} >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>

                  <button className="btn btn-danger custom-buttons"><Link to="/admin">Cancel</Link></button>
                  <button onClick={e => this.handleSubmit(e)} className="btn btn-success custom-buttons">Update</button>
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

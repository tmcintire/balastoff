import React from 'react';
import { Link } from 'react-router';
import * as api from '../../../data/api';

const Loading = require('react-loading-animation');

export class AddParticipant extends React.Component {
  handleValueChange = (e) => {
    e.preventDefault();
    this.setState({
      track: e.target.value,
    });
  }

  addParticipant = (e, id) => {
    e.preventDefault();
    const level = this.Level.value;
    let levelCheck = '';
    if (level === 'Gemini' || level === 'Apollo' || level === 'Skylab') {
      levelCheck = 'Yes';
    } else {
      levelCheck = 'No';
    }

    const object = {
      'First Name': this['First Name'].value,
      BookingID: this.BookingID.value,
      'Last Name': this['Last Name'].value,
      Level: this.Level.value,
      HasPaid: this.HasPaid.checked,
      Open: 'No',
      'Amateur Couples': 'No',
      AdNov: 'No',
      HasLevelCheck: levelCheck,
      'Amount Owed': '0.00',
      CheckedIn: false,
      Paid: this.Paid.value,
    };

    api.addRegistration(id, object).then(() => {
      window.location = `#/editregistration/${id}`;
    });
    this.clearValues();
  }

  clearValues = () => {
    this['First Name'].value = '';
    this['Last Name'].value = '';
    this.Level.value = '';
    this.HasPaid.checked = false;
    this.Paid.value = '0.00';
    this.BookingID = this.BookingID + 1;
  }

  handleCancel = (e) => {
    e.preventDefault();

    window.location = '#/';
  }
  render() {
    const renderForm = () => {
      if (this.props.loading === false) {
        const id = parseInt(api.getLastBookingId(), 10) + 1;
        return (
          <div>
            <div className="form-container">
              <Link to={'/'}><button className="btn btn-primary custom-buttons">Back to Participants</button></Link>
              <h1 className="text-center">Add Participant</h1>
              <div className="form-group">
                <form>
                  <label htmlFor="type">BookingID</label>
                  <input disabled className="form-control" type="text" defaultValue={id} ref={(ref) => { this.BookingID = ref; }} />
                  <label htmlFor="type">First</label>
                  <input className="form-control" type="text" ref={(ref) => { this['First Name'] = ref; }} />
                  <label htmlFor="type">Last</label>
                  <input className="form-control" type="text" ref={(ref) => { this['Last Name'] = ref; }} />
                  <label htmlFor="type">Level</label>
                  <select className="form-control" ref={(ref) => { this.Level = ref; }} >
                    <option value="Staff">Staff</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Mercury">Mercury</option>
                    <option value="Gemini">Gemini</option>
                    <option value="Apollo">Apollo</option>
                    <option value="Skylab">Skylab</option>
                    <option value="Space-X">Space-X</option>
                  </select>

                  <label htmlFor="type">Fully Paid</label>
                  <input className="form-control" type="checkbox" ref={(ref) => { this.HasPaid = ref; }} />

                  <label htmlFor="type">Amount Paid</label>
                  <input className="form-control" type="text" ref={(ref) => { this.Paid = ref; }} />

                  <button onClick={e => this.handleCancel(e)} className="btn btn-danger custom-buttons">Cancel</button>
                  <button onClick={e => this.addParticipant(e, id)} className="btn btn-success custom-buttons">Add</button>
                  <br />
                </form>
              </div>
            </div>
          </div>
        );
      }
      return (
        <Loading />
      );
    };
    return (
      <div className="container form-container">
        {renderForm()}
      </div>
    );
  }
}

import React from 'react';
import { Link } from 'react-router';
import * as _ from 'lodash';
import * as api from '../../../data/api';

const Loading = require('react-loading-animation');

export class EditParticipant extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.fields) {
      let sortedFields = _.orderBy(nextProps.fields, 'sortOrder');
      return { sortedFields, fieldsLoaded: true };
    }

    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      sortedFields: {},
      fieldsLoaded: false,
    };
  }
  

  handleValueChange = (e) => {
    e.preventDefault();
    this.setState({
      track: e.target.value,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const object = {};

    _.forEach(this.state.sortedFields, (field) => {
      let value = this[field.key].value;

      if (value === 'true' || value === 'false') {
        value = value === 'true'; // turn the value into a boolean
      }
      object[field.key] = value;
    });

    api.updateRegistration(this.props.params.id, object);
    window.location = ('#/admin');
  }

  renderSelectOptions = (options) => {
    return options.map(option => {
      return <option value={option.value}>{option.label}</option>;
    });
  }

  renderDynamicForm = (participant) => {
    return this.state.sortedFields.map((field, index) => {
      if (field.type === 'select') {
        return (
          <React.Fragment>
            <label htmlFor="type">{field.label}</label>
            <select key={index} className="form-control" defaultValue={participant[field.key]} ref={(ref) => { this[field.key] = ref; }} >
              {this.renderSelectOptions(field.options)}
            </select>
            
          </React.Fragment>
        );
      } else if (field.type === 'text') {
        return (
          <React.Fragment>
            <label htmlFor="type">{field.label}</label>
            <input type="text" className="form-control" defaultValue={participant[field.key]} ref={(ref) => { this[field.key] = ref; }} />
          </React.Fragment>

        )
      }
    });
  }

  render() {
    const renderForm = () => {
      if (this.state.loading === true || this.state.fieldsLoaded === false) {
        return (
          <Loading />
        );
      }
      if (this.props.loading === false && this.state.fieldsLoaded === true) {
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
                  {this.renderDynamicForm(participant)}
                  {/* <label htmlFor="type">Track</label>
                  <select className="form-control" id="type" defaultValue={participant.Level.level} ref={(ref) => { this.Level = ref; }}>
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
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>

                  <label htmlFor="type">Missed Level Check</label>
                  <select className="form-control" defaultValue={participant.MissedLevelCheck} ref={(ref) => { this.MissedLevelCheck = ref; }} >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
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

                  <label htmlFor="type">Checked In</label>
                  <select className="form-control" defaultValue={participant.CheckedIn} ref={(ref) => { this.CheckedIn = ref; }} >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select> */}

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

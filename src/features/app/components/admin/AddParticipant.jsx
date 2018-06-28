import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import * as api from '../../../data/api';
import * as helpers from '../../../data/helpers';

const Loading = require('react-loading-animation');

export class AddParticipant extends React.Component {
  constructor() {
    super();

    this.state = {
      bookingId: parseInt(api.getLastBookingId(), 10) + 1,
      firstName: '',
      lastName: '',
      leadFollow: '',
      price: '',
      hasPaid: false,
      pass: '',
      level: '',
      displayMessage: false,
      errors: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.prices) {
      const price = this.lookupPrice(this.state.level, nextProps.prices);

      this.setState({
        price,
      });
    }
    if (nextProps.registrations) {
      this.setState({
        bookingId: parseInt(api.getLastBookingId(), 10) + 1,
      });
    }
  }

  validate = (firstName, lastName, leadFollow, price, pass, hasPaid) => {
    // true means invalid, so our conditions got reversed
    return {
      firstName: firstName.length === 0,
      lastName: lastName.length === 0,
      leadFollow: leadFollow.length === 0,
      price: price.length === 0,
      pass: pass.length === 0,
      hasPaid: !hasPaid,
    };
  }

  addParticipant = (e, id) => {
    e.preventDefault();
    if (!this.state.hasPaid) {
      this.setState({
        displayMessage: true,
      });
      return;
    }
    const errors = this.validate(
      this.state.firstName,
      this.state.lastName,
      this.state.leadFollow,
      this.state.price,
      this.state.pass,
      this.state.hasPaid);

    this.setState({ errors, hasErrors: false }); // set state as false for now

    if (_.some(errors, err => err === true)) {
      this.setState({ hasErrors: true });
      return;
    }

    const moneyLog = {
      bookingId: this.state.bookingId,
      amount: this.state.price,
      details: [{
        item: `New registration - ${this.state.pass.name}`,
        quantity: 1,
        price: this.state.price,
      }],
    };
    api.updateMoneyLog(moneyLog);

    const object = {
      'First Name': this.state.firstName,
      BookingID: JSON.stringify(this.state.bookingId),
      'Last Name': this.state.lastName,
      Level: this.state.level || { level: 'NA', name: 'NA' },
      HasLevelCheck: this.state.level.level === 'Gemini' || this.state.level.level === 'Apollo' || this.state.level.level === 'Skylab',
      LevelChecked: false,
      LevelUpdated: false,
      MissedLevelCheck: false,
      OriginalLevel: this.state.level.level || 'NA',
      HasPaid: this.state.hasPaid,
      LeadFollow: this.state.leadFollow,
      Open: 'No',
      AdNov: 'No',
      'Amount Owed': this.state.hasPaid ? '0.00' : this.state.price,
      'Original Amount Owed': this.state.price,
      CheckedIn: false,
      WalkIn: true,
      TicketType: this.state.pass.name,
    };

    if (this.HasPaid) {
      const newTotal = this.state.price;
      api.updateTotalCollected(newTotal);
    }

    api.addRegistration(id, object);
    window.location = `#/editregistration/${id}`;
  }

  clearValues = () => {
    this['First Name'].value = '';
    this['Last Name'].value = '';
    this.Level.value = '';
    this.HasPaid.checked = false;
    this.Paid.value = '0.00';
    this.BookingID = this.BookingID + 1;
  }

  createSelectPassItems() {
    let items = [];
    let passes = helpers.sortTracks(this.props.passes);    
    _.forIn(passes, (p, index) => {
      items.push(<option key={index} value={p.name}>{p.name}</option>);
    });
    return items;
  }

  createSelectLevelItems() {
    let items = [];
    let tracks = helpers.sortTracks(this.props.tracks);    
    _.forIn(tracks, (t, index) => {
      items.push(<option key={index} value={t.level}>{t.name}</option>);
    });
    return items;
  }

  handleChange = (e) => {
    let pass;
    let level;
    const target = e.target.name;
    switch (target) {
      case 'pass':
        pass = _.filter(this.props.passes, p => p.name === e.target.value)[0];
        this.setState({ [target]: pass, price: pass ? pass.price: '' });
        break;
      case 'level':
        level = _.filter(this.props.tracks, t => t.level === e.target.value)[0];
        this.setState({ [target]: level });
        break;
      case 'hasPaid':
        this.setState({ [target]: e.target.checked });
        break;
      default:
        this.setState({ [target]: e.target.value });
        break;
    }

    if (this.state.hasErrors) {
      const errors = this.validate(
        this.state.firstName,
        this.state.lastName,
        this.state.leadFollow,
        this.state.price,
        this.state.hasPaid);

      if (errors) {
        this.setState({
          hasErrors: true,
          errors,
        });
        return;
      }
    }
  }

  handleCancel = (e) => {
    e.preventDefault();

    window.location = '#/';
  }
  render() {
    const  { displayMessage } = this.state;
    const renderDisplayMessage = () => {
      if (displayMessage) {
        return (
          <h3 className="error-message">Participants must pay the full amount before entering</h3>
        );
      }
    };

    const renderErrorMessage = this.state.hasErrors ? (<h4 className="error-message">Plese check the form for errors</h4>) : '';

    const renderForm = () => {
      if (this.props.tracksLoading === false && this.props.passesLoading === false) {
        const id = this.state.bookingId;
        return (
          <div>
            <div className="form-container">
              <Link to={'/'}><button className="btn btn-primary custom-buttons">Back to Participants</button></Link>
              <h1 className="text-center">Add Participant</h1>
              <div className="form-group">
                <form>
                  <label htmlFor="type">BookingID</label>
                  <input disabled className="form-control" type="text" value={id} onChange={this.handleChange} autoFocus />
                  <label htmlFor="type">First</label>
                  <input name="firstName" onChange={this.handleChange} className={`form-control ${this.state.errors.firstName ? 'error' : ''}`} type="text" />
                  <label htmlFor="type">Last</label>
                  <input name="lastName" onChange={this.handleChange} className={`form-control ${this.state.errors.lastName ? 'error' : ''}`} type="text" />
                  <label htmlFor="type">Lead/Follow</label>
                  <select name="leadFollow" onChange={this.handleChange} className={`form-control ${this.state.errors.leadFollow ? 'error' : ''}`} >
                    <option value="" />
                    <option value="Lead">Lead</option>
                    <option value="Follow">Follow</option>
                  </select>
                  <label htmlFor="type">Pass</label>
                  <select name="pass" onChange={this.handleChange} className={`form-control ${this.state.errors.pass ? 'error' : ''}`} >
                    <option value="" />
                    {this.createSelectPassItems()}
                  </select>
                  <label htmlFor="type">Level</label>
                  <select name="level" onChange={this.handleChange} className={`form-control ${this.state.errors.level ? 'error' : ''}`} >
                    <option value="" />
                    {this.createSelectLevelItems()}
                  </select>

                  <label htmlFor="type">Price</label>
                  <input onChange={this.handleChange} name="price" className={`form-control ${this.state.errors.price ? 'error' : ''}`} type="text" value={this.state.price} />

                  <label htmlFor="type">Fully Paid</label>
                  <input onChange={this.handleChange} name="hasPaid" className="form-control" type="checkbox" />

                  {renderDisplayMessage()}
                  {renderErrorMessage}
                  <div className="form-submit-buttons flex-row flex-justify-space-between">
                    <button onClick={e => this.handleCancel(e)} className="btn btn-danger custom-buttons">Cancel</button>
                    <button onClick={e => this.addParticipant(e, id)} className="btn btn-success custom-buttons">Add</button>
                  </div>

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

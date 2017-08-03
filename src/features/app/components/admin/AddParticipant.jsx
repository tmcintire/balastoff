import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import * as api from '../../../data/api';

const Loading = require('react-loading-animation');

export class AddParticipant extends React.Component {
  constructor() {
    super();

    this.state = {
      level: 'Beginner',
      displayMessage: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.prices) {
      const price = this.lookupPrice(this.state.level, nextProps.prices);

      this.setState({
        price,
      });
    }
  }

  addParticipant = (e, id) => {
    e.preventDefault();
    if (!this.HasPaid.checked) {
      this.setState({
        displayMessage: true,
      });
      return;
    }
    const level = this.Level.value;
    let levelCheck = 'No';
    if (level === 'Gemini' || level === 'Apollo' || level === 'Skylab') {
      levelCheck = 'Yes';
    }
    const amount = this.HasPaid.checked ? '0.00' : this.state.price;
    api.updateTotalCollected(parseInt(amount, 10));

    const moneyLog = {
      bookingId: this.BookingID.value,
      amount: this.state.price,
      reason: `Fully Paid - New registration - ${this.Level.value}`,
    };
    api.updateMoneyLog(moneyLog);

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
      'Amount Owed': amount,
      'Original Amount Owed': this.state.price,
      CheckedIn: false,
      WalkIn: true,
    };

    if (this.HasPaid.checked) {
      const newTotal = parseInt(this.state.price, 10) + parseInt(this.props.totalCollected, 10);
      api.updateTotalCollected(newTotal);
    }

    api.addRegistration(id, object);
    window.location = `#/editregistration/${id}`;
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

  lookupPrice = (level, prices) => {
    return _.filter(prices, (p, index) => {
      return index === level;
    })[0].price;
  }

  handleLevelChange = (e) => {
    const level = e.target.value;
    const price = this.lookupPrice(level, this.props.prices);

    this.setState({
      price,
    });
  }

  handlePriceChange = (e) => {
    this.setState({
      price: e.target.value,
    });
  }

  createSelectItems() {
    let items = [];
    _.forIn(this.props.prices, (p, index) => {
      items.push(<option key={index} value={index}>{p.label}</option>);
    });
    return items;
  }

  handleCancel = (e) => {
    e.preventDefault();

    window.location = '#/';
  }
  render() {
    const  { displayMessage } = this.state;
    const renderDisplayMessage = () => {
      if (this.state.displayMessage) {
        return (
          <h3 className="error-message">Participants must pay the full amount before entering</h3>
        );
      }
    };

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
                  <select className="form-control" onChange={e => this.handleLevelChange(e)} ref={(ref) => { this.Level = ref; }} >
                    {this.createSelectItems()}
                  </select>

                  <label htmlFor="type">Price</label>
                  <input className="form-control" type="text" onChange={e => this.handlePriceChange(e)} value={this.state.price} />

                  <label htmlFor="type">Fully Paid</label>
                  <input className="form-control" type="checkbox" ref={(ref) => { this.HasPaid = ref; }} />

                  {renderDisplayMessage()}
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

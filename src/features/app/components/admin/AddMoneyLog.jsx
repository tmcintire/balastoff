import React from "react";
import PropTypes from "prop-types";
import * as api from "../../../data/api";

export class AddMoneyLog extends React.Component {
  constructor() {
    super();

    this.state = {
      showVoidConfirmation: false,
      transactionToVoid: null,
      entries: [''],
    };
  }

  addEntry = (e) => {
    e.preventDefault();
    this.setState({
      entries: this.state.entries.concat(['']),
    });
  }

  submitForm = (e) => {
    e.preventDefault();
    const object = {
      bookingId: this.state.bookingId ? this.state.bookingId : null,
      amount: this.state.amount,
      details: _.compact(this.state.entries),
    };

    api.updateTotalCollected(this.state.amount);

    api.updateMoneyLog(object);
    this.props.showMoneyLog();
  }

  chooseRegistrant = (bookingId) => {
    this.setState({ bookingId });
  }

  handleEntryChange = (key, index, value) => {
    const entries = this.state.entries;
    let newValue = value;

    if (key === 'price' || key === 'quantity') {
      newValue = parseInt(value, 10);
    }
    entries[index] = {
      ...entries[index],
      [key]: newValue,
    };

    const amount = _.sumBy(entries, (entry) => {
      let total = 0;
      if (entry.price && entry.quantity) {
        total = entry.price * entry.quantity;
      }
      return total;
    });

    this.setState({
      entries,
      amount,
    });
  }

  renderEntries = () => {
    return this.state.entries.map((entry, index) => {
      return (
        <div className="row custom-form-div">
          <input className="col-xs-8 form-control-override" placeholder="Description" type="text" defaultValue={entry.item} onChange={e => this.handleEntryChange('item', index, e.target.value)} />
          <input className="col-xs-2 form-control-override" placeholder="Price" type="text" defaultValue={entry.price} onChange={e => this.handleEntryChange('price', index, e.target.value)} />
          <input className="col-xs-2 form-control-override" placeholder="Quantity" type="number" defaultValue={entry.quantity} onChange={e => this.handleEntryChange('quantity', index, e.target.value)} />
        </div>
      );
    });
  }

  renderRegistrationsDropdown = () => {
    return this.props.registrations.map(reg => {
      return (
        <option value={reg.BookingID}>{reg.BookingID}-{reg['First Name']} {reg['Last Name']}</option>
      );
    });
  }

  render() {
    return (
      <div className="add-money-log">
        <form className="form">
          <label htmlFor="text">Booking ID</label>
          <select onChange={e => this.chooseRegistrant(e.target.value)}className="form-control">
            <option value="" />
            {this.renderRegistrationsDropdown()}
          </select>

          <label htmlFor="text">Details</label>
          {this.renderEntries()}
          <button onClick={(e) => this.addEntry(e)}>Add Entry</button>

          <div>
            <h3>${this.state.amount > 0 ? this.state.amount.toFixed(2) : '0.00'}</h3>
          </div>

          <button onClick={e => this.submitForm(e)} className="btn btn-primary">Submit</button>
        </form>
      </div>
    );
  }
}

AddMoneyLog.propTypes = {
  log: PropTypes.object,
  totalCollected: PropTypes.number,
};

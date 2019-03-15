import * as React from "react";
import * as api from "../../../data/api";
import * as _ from 'lodash';
import { IMoneyLogEntryItem, IMoneyLogEntry } from '../../../data/interfaces';

interface AddMoneyLogProps {
  showMoneyLog: () => void;
  registrations: any;
}

interface AddMoneyLogState {
  showVoidConfirmation: boolean;
  entries: IMoneyLogEntryItem[];
  amount: number;
  bookingId: number;
}

export class AddMoneyLog extends React.Component<AddMoneyLogProps, AddMoneyLogState> {
  constructor(props) {
    super(props);

    this.state = {
      showVoidConfirmation: false,
      entries: [{
        item: '',
        price: 0,
        quantity: 1
      }],
      amount: 0,
      bookingId: null
    };
  }

  addEntry = (e) => {
    e.preventDefault();
    this.setState({
      entries: this.state.entries.concat([{
        item: '',
        price: 0,
        quantity: 1
      }]),
    });
  }

  submitForm = (e) => {
    e.preventDefault();
    const object: IMoneyLogEntry = {
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

  handleEntryChange = (key: string, index: number, value: any) => {
    const entries = this.state.entries;
    let newValue = value;

    entries[index] = {
      ...entries[index],
      [key]: newValue,
    };

    const amount = _.sumBy(entries, (entry: IMoneyLogEntryItem) => {
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
    return this.state.entries.map((entry: IMoneyLogEntryItem, index) => {
      return (
        <div className="row custom-form-div">
          <input className="col-xs-8 form-control-override" placeholder="Description" type="text" defaultValue={entry.item} onChange={e => this.handleEntryChange('item', index, e.target.value)} />
          <input className="col-xs-2 form-control-override" placeholder="Price" type="number" defaultValue={entry.price.toString()} onChange={e => this.handleEntryChange('price', index, parseFloat(e.target.value))} />
          <input className="col-xs-2 form-control-override" placeholder="Quantity" type="number" defaultValue={entry.quantity.toString()} onChange={e => this.handleEntryChange('quantity', index, parseInt(e.target.value, 10))} />
        </div>
      );
    });
  }

  renderRegistrationsDropdown = () => {
    return this.props.registrations.map(reg => {
      return (
        <option value={reg.BookingID}>{reg.BookingID}-{reg.FirstName} {reg.LastName}</option>
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
          {
            this.renderEntries()
          }
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

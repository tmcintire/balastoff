import * as React from "react";
import { FunctionComponent, useState, useEffect, useRef } from 'react';
import * as api from "../../../data/api";
import * as _ from 'lodash';
import { IMoneyLogEntryItem, IMoneyLogEntry, MoneyLogEntryType, IRegistration } from '../../../data/interfaces';

interface AddMoneyLogProps {
  showMoneyLog: () => void;
  registrations: IRegistration[];
}

interface AddMoneyLogState {
  showVoidConfirmation: boolean;
  entries: IMoneyLogEntryItem[];
  amount: number;
  bookingId: number;
}

export const AddMoneyLog: FunctionComponent<AddMoneyLogProps> = (props) => { 
  const {showMoneyLog, registrations} = props;

  const bookingIdRef = useRef<HTMLSelectElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);

  const [showVoidConfirmation, setShowVoidConfirmation] = useState<boolean>(false);
  const [entries, setEntries] = useState<IMoneyLogEntryItem[]>([{
    item: '',
    price: 0,
    quantity: 1
  }]);
  const [amount, setAmount] = useState<number>(0);

  const addEntry = (e) => {
    e.preventDefault();
    const newEntries = entries.concat([{
      item: '',
      price: 0,
      quantity: 1
    }]);

    setEntries(newEntries);
  }

  const submitForm = (e) => {
    e.preventDefault();
    let bookingId = null;
    if (bookingIdRef.current && typeof bookingIdRef.current.value === 'number') {
      bookingId = bookingIdRef.current.value;
    } 

    const object: IMoneyLogEntry = {
      bookingId,
      amount: amount,
      details: _.compact(entries),
      type: typeRef.current.value ? parseInt(typeRef.current.value) : null
    };

    api.updateTotalCollected(amount);

    api.updateMoneyLog(object);
    showMoneyLog();
  }

  const handleEntryChange = (key: string, index: number, value: any) => {
    const updatedEntries = _.cloneDeep(entries);
    let newValue = value;

    updatedEntries[index] = {
      ...updatedEntries[index],
      [key]: newValue,
    };

    const amount = _.sumBy(updatedEntries, (entry: IMoneyLogEntryItem) => {
      let total = 0;
      if (entry.price && entry.quantity) {
        total = entry.price * entry.quantity;
      }
      return total;
    });

    setEntries(updatedEntries);
    setAmount(amount);
  }

  const renderEntries = () => {
    return entries.map((entry: IMoneyLogEntryItem, index) => {
      return (
        <div className="row custom-form-div">
          <input className="col-xs-6 form-control-override" placeholder="Description" type="text" defaultValue={entry.item} onChange={e => handleEntryChange('item', index, e.target.value)} />
          <input className="col-xs-2 form-control-override" placeholder="Price" type="number" defaultValue={entry.price.toString()} onChange={e => handleEntryChange('price', index, parseFloat(e.target.value))} />
          <input className="col-xs-2 form-control-override" placeholder="Quantity" type="number" defaultValue={entry.quantity.toString()} onChange={e => handleEntryChange('quantity', index, parseInt(e.target.value, 10))} />
          <select ref={typeRef}> 
            <option value={MoneyLogEntryType.Cash}>{MoneyLogEntryType[MoneyLogEntryType.Cash]}</option>
            <option value={MoneyLogEntryType.Check}>{MoneyLogEntryType[MoneyLogEntryType.Check]}</option>
            <option value={MoneyLogEntryType.Paypal}>{MoneyLogEntryType[MoneyLogEntryType.Paypal]}</option>
          </select>
        </div>
      );
    });
  }

  const renderRegistrationsDropdown = () => {
    return registrations.map(reg => {
      return (
        <option value={reg.BookingID}>{reg.BookingID}-{reg.FirstName} {reg.LastName}</option>
      );
    });
  }

  return (
    <div className="add-money-log">
      <form className="form">
        <label htmlFor="text">Booking ID</label>
        <select ref={bookingIdRef} className="form-control">
          <option value="" />
          {renderRegistrationsDropdown()}
        </select>

        <label htmlFor="text">Details</label>
        {
          renderEntries()
        }
        <button onClick={(e) => addEntry(e)}>Add Entry</button>

        <div>
          <h3>${amount > 0 ? amount.toFixed(2) : '0.00'}</h3>
        </div>

        <button onClick={e => submitForm(e)} className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

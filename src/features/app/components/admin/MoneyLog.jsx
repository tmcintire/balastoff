import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import * as api from '../../../data/api';

import { VoidTransaction } from './VoidTransaction';

export class MoneyLog extends React.Component {
  constructor() {
    super();

    this.state = {
      showMoneyLog: false,
      showVoidConfirmation: false,
      transactionToVoid: null,
    };
  }

  showMoneyLog = () => {
    this.setState({
      showMoneyLog: !this.state.showMoneyLog,
    });
  }

  closePopup = () => {
    this.setState({
      showVoidConfirmation: false,
    });
  }


  submitForm = (e) => {
    e.preventDefault();
    const object = {
      bookingId: this.bookingId.value,
      amount: this.amount.value,
      details: this.details.value,
    };

    api.updateTotalCollected(this.amount.value);

    api.updateMoneyLog(object);
    this.setState({
      showMoneyLog: false,
    });
  }

  voidTransaction = (transactionId) => {
    this.setState({
      showVoidConfirmation: true,
      transactionToVoid: {
        id: transactionId,
        data: this.props.log[transactionId],
      },
    });
  }

  render() {
    const renderDetails = (details) => {
      return details.map(d => {
        return (
          <span>{d.quantity} - {d.item} | ${d.price.toFixed(2)}</span>
        );
      });
    };

    const renderLogs = () => {
      if (this.props.log) {
        return Object.keys(this.props.log).map((l) => {
          const eachLog = this.props.log[l];
          return (
            <div className="money-log flex-row flex-align-center" key={l}>
              <span className="col-xs-1">
                <Link to={`editregistration/${eachLog.bookingId}`}>{eachLog.bookingId}</Link>
              </span>
              <div className="col-xs-5 flex-col money-log-details">
                {renderDetails(eachLog.details)}
              </div>
              <span className="col-xs-2">${eachLog.amount.toFixed(2)}</span>
              {eachLog.status === 'Voided' ?
                <span className="voided col-xs-3">{eachLog.status} by {eachLog.initials}</span>
                :
                <span className="col-xs-3">{eachLog.status}</span>
              }
              <i className="col-xs-1 fa fa-times-circle" onClick={() => this.voidTransaction(l)} />
            </div>
          );
        });
      }
    };

    const renderAddMoneyLog = () => {
      if (this.state.showMoneyLog) {
        return (
          <div className="add-money-log">
            <form className="form">
              <label htmlFor="text">Booking ID</label>
              <input className="form-control" type="text" ref={(ref) => { this.bookingId = ref; }} />

              <label htmlFor="text">Details</label>
              <input className="form-control" type="text" ref={(ref) => { this.details = ref; }} />

              <label htmlFor="text">Amount</label>
              <input className="form-control" type="text" ref={(ref) => { this.amount = ref; }} />

              <button onClick={e => this.submitForm(e)} className="btn btn-primary">Submit</button>
            </form>
          </div>
        );
      }
    };
    const renderVoidTransaction = () => {
      if (this.state.showVoidConfirmation) {
        return (
          <VoidTransaction closePopup={this.closePopup} transaction={this.state.transactionToVoid} pw={this.props.config.voidPassword} />
        );
      }
      return null;
    };

    return (
      <div className="container">
        <span className="show-money-log" onClick={() => this.showMoneyLog()}>Log Money</span>
        <h1 className="text-center">Money Log</h1>
        <hr />
        <div className="money-log-wrapper flex-col">
          <div className="money-log-header">  
            <span className="col-xs-1">ID</span>
            <span className="col-xs-5">Details</span>
            <span className="col-xs-2">Amount</span>
            <span className="col-xs-3">Status</span>
            <span className="col-xs-1">Void?</span>
          </div>
          <div className="money-log-body flex-col">
            {renderLogs()}
          </div>
        </div>
        <h2>Total Collected: ${this.props.totalCollected}</h2>
        {renderAddMoneyLog()}
        {renderVoidTransaction()}
      </div>
    );
  }
}

MoneyLog.propTypes = {
  log: PropTypes.object,
  totalCollected: PropTypes.number,
};

import React from 'react';
import { Link } from 'react-router';
import * as api from '../../../data/api';

export class MoneyLog extends React.Component {
  constructor() {
    super();

    this.state = {
      showMoneyLog: false,
    };
  }

  showMoneyLog = () => {
    this.setState({
      showMoneyLog: !this.state.showMoneyLog,
    });
  }

  submitForm = (e) => {
    e.preventDefault();
    const object = {
      bookingId: this.bookingId.value,
      amount: this.amount.value,
      reason: this.reason.value,
    };

    api.updateTotalCollected(this.amount.value);

    api.updateMoneyLog(object);
    this.setState({
      showMoneyLog: false,
    });
  }

  render() {
    const renderLogs = () => {
      if (this.props.log) {
        return Object.keys(this.props.log).map((l) => {
          const eachLog = this.props.log[l]
          return (
            <div className="money-log" key={l}>
              <span className="col-xs-4">
                <Link to={`editregistration/${eachLog.bookingId}`}>{eachLog.bookingId}</Link>
              </span>
              <span className="col-xs-4">{eachLog.reason}</span>
              <span className="col-xs-4">${eachLog.amount}</span>
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

              <label htmlFor="text">Reason</label>
              <input className="form-control" type="text" ref={(ref) => { this.reason = ref; }} />

              <label htmlFor="text">Amount</label>
              <input className="form-control" type="text" ref={(ref) => { this.amount = ref; }} />

              <button onClick={e => this.submitForm(e)} className="btn btn-primary">Submit</button>
            </form>
          </div>
        );
      }
    };

    return (
      <div className="container">
        <span className="show-money-log" onClick={() => this.showMoneyLog()}>Log Money</span>
        <h1 className="text-center">Money Log</h1>
        <hr />
        <div className="money-log-wrapper flex-col">
          <div className="money-log-header">
            <span className="col-xs-4">Booking ID</span>
            <span className="col-xs-4">Reason</span>
            <span className="col-xs-4">Amount</span>
          </div>
          <div className="money-log-body flex-col">
            {renderLogs()}
          </div>
        </div>
        {renderAddMoneyLog()}
      </div>
    );
  }
}

MoneyLog.propTypes = {
  log: React.PropTypes.object,
  loading: React.PropTypes.bool,
};

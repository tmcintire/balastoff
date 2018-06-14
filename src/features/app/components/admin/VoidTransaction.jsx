import React from 'react';
import * as api from '../../../data/api';

export class VoidTransaction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      typedPassword: null,
      confirmPassword: props.pw,
      initials: null,
    };
  }

  confirmVoidTransaction() {
    if (this.state.typedPassword === this.state.confirmPassword) {
      // if its already void, reverse it
      if (this.props.transaction.data.void) {
        api.updateTotalCollected(this.props.transaction.data.amount);
        api.unvoidTransaction(this.props.transaction.id, this.state.initials);
      } else {
        api.updateTotalCollected(-(this.props.transaction.data.amount));
        api.voidTransaction(this.props.transaction.id, this.state.initials);
      }
      
    }

    this.props.closePopup();
  }

  handlePasswordEntry = (e) => this.setState({ typedPassword: e.target.value });

  handleInitialsChanged = (e) => this.setState({ initials: e.target.value });

  render() {
    const { id, data } = this.props.transaction;
    return (
      <div className="confirmation-container">
        <div className="confirmation-inner flex-col flex-align-center">
          <div className="close-popup" onClick={() => this.props.closePopup()}>
            x
          </div>
          <h1 className="text-center">{!data.void ? 'Void Transaction' : 'Reinstate Transaction'}</h1>
          <div className="flex-col flex-align-start">
            <span>TransactionId: {id}</span>
            <span>Amount: ${data.amount}</span>
            <span>Reason: {data.reason}</span>
          </div>
          
          <label htmlFor="password" >Confirmation Password</label>
          <input type="password" className="form-control" name="password" onChange={this.handlePasswordEntry} />
          
          <label htmlFor="initials" >Initials</label>
          <input type="text" className="form-control" name="initials" onChange={this.handleInitialsChanged} />

          <button className="confirm-btn btn btn-success" onClick={() => this.confirmVoidTransaction()}>Void Transaction</button>
        </div>
      </div>
    );
  }
}

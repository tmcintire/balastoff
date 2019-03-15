import * as React from 'react';
import * as api from '../../../data/api';
import { IMoneyLogEntry } from '../../../data/interfaces';

interface VoidTransactionProps {
  pw: string,
  transaction: IMoneyLogEntry,
  id: string,
  closePopup: () => void
}

interface VoidTransactionState {
  typedPassword: string,
  confirmPassword: string,
  initials: string,
  reason: string
}

export class VoidTransaction extends React.Component<VoidTransactionProps, VoidTransactionState> {
  constructor(props) {
    super(props);

    this.state = {
      typedPassword: null,
      confirmPassword: props.pw,
      initials: null,
      reason: null
    };
  }

  confirmVoidTransaction() {
    if (this.state.typedPassword === this.state.confirmPassword) {
      // if its already void, reverse it
      if (this.props.transaction.void) {
        api.updateTotalCollected(this.props.transaction.amount);
        api.unvoidTransaction(this.props.id, this.state.initials, this.state.reason);
      } else {
        api.updateTotalCollected(-(this.props.transaction.amount));
        api.voidTransaction(this.props.id, this.state.initials, this.state.reason);
      }
      
    }

    this.props.closePopup();
  }

  handlePasswordEntry = (e) => this.setState({ typedPassword: e.target.value });
  handleInitialsChanged = (e) => this.setState({ initials: e.target.value });
  handleVoidReason = (e) => this.setState({ reason: e.target.value });

  render() {
    const { amount, reason } = this.props.transaction;
    const { id } = this.props;
    return (
      <div className="confirmation-container">
        <div className="confirmation-inner flex-col flex-align-center">
          <div className="close-popup" onClick={() => this.props.closePopup()}>
            x
          </div>
          <h1 className="text-center">{!this.props.transaction.void ? 'Void Transaction' : 'Reinstate Transaction'}</h1>
          <div className="flex-col flex-align-start">
            <span>TransactionId: {id}</span>
            <span>Amount: ${amount}</span>
          </div>
          
          <label htmlFor="reason" >Void reason</label>
          <input autoComplete='false' type="reason" className="form-control" name="reason" onChange={this.handleVoidReason} />

          <label htmlFor="initials" >Initials</label>
          <input autoComplete='false' type="text" className="form-control" name="initials" onChange={this.handleInitialsChanged} />

          <label htmlFor="password" >Confirmation Password</label>
          <input autoComplete='false' type="password" className="form-control" name="password" onChange={this.handlePasswordEntry} />

          <button className="confirm-btn btn btn-success" onClick={() => this.confirmVoidTransaction()}>Void Transaction</button>
        </div>
      </div>
    );
  }
}

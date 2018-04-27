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
      // void the transaction

      api.updateTotalCollected(-(this.props.transaction.data.amount));

      api.voidTransaction(this.props.transaction.id, this.state.initials);
    }

    this.props.closePopup();
    // this.props.purchaseToast({ total: amount, quantity: this.state.amount, name: this.props.item.name });
  }

  handlePasswordEntry = (e) => this.setState({ typedPassword: e.target.value });

  handleInitialsChanged = (e) => this.setState({ initials: e.target.value });

  render() {
    return (
      <div className="confirmation-container">
        <div className="confirmation-inner flex-col flex-align-center">
          <div className="close-popup" onClick={() => this.props.closePopup()}>
            x
          </div>
          <h1 className="text-center">Void Transaction</h1>
          <div className="flex-col flex-align-start">
            <span>TransactionId: {this.props.transaction.id}</span>
            <span>Amount: ${this.props.transaction.data.amount}</span>
            <span>Reason: {this.props.transaction.data.reason}</span>
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

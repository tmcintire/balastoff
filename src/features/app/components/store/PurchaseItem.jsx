import React from 'react';
import * as api from '../../../data/api';

export class PurchaseItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 1,
    };
  }

  handleAdd = () => this.setState({ amount: this.state.amount + 1 });
  handleMinus = () => {
    const newAmount = this.state.amount === 0 ? 0 : this.state.amount - 1;
    this.setState({
      amount: newAmount,
    });
  }

  confirmPurchase() {
    const amount = parseInt(this.state.amount * this.props.item.price, 10);
    api.updateTotalCollected(amount);
    const moneyLog = {
      bookingId: null,
      amount,
      details: [{
        item: this.props.item.name,
        quantity: this.state.amount,
        price: this.props.item.price,
      }],
    };
    api.updateMoneyLog(moneyLog);
    api.updateStoreItemCount(this.props.itemIndex, (this.state.amount + this.props.item.count));
    this.props.closePopup();
    this.props.purchaseToast({ total: amount, quantity: this.state.amount, name: this.props.item.name });
  }

  render() {
    return (
      <div className="confirmation-container">
        <div className="confirmation-inner flex-col flex-align-center">
          <div className="close-popup" onClick={() => this.props.closePopup()}>
            x
          </div>
          <h1>Confirm Purchase</h1>
          <p>{this.props.item.name} - ${this.props.item.price}</p>
          <div className="item-amount-container flex-row">
            <span className="current-amount">{this.state.amount}</span>

            <div className="amount-btns flex-col">
              <i className="fa fa-plus-square" onClick={() => this.handleAdd()} />
              <i className="fa fa-minus-square" onClick={() => this.handleMinus()} />
            </div>
          </div>

          <div className="final-total">
            <span>Total: ${this.state.amount * this.props.item.price}</span>
          </div>

          <button className="confirm-btn btn btn-success" onClick={() => this.confirmPurchase()}>Confirm Purchase</button>
        </div>
      </div>
    );
  }
}

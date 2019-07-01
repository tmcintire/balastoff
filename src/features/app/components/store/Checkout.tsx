import * as React from 'react';
import { FunctionComponent, useRef } from 'react';
import { IStore, MoneyLogEntryType } from '../../../data/interfaces';

interface CheckoutProps {
  pendingItems: IStore[],
  addItem: (item: IStore) => void,
  removeItem: (item: IStore) => void,
  toggleCheckout: () => void,
  confirmPurchase: () => void,
  setType: (type: MoneyLogEntryType) => void;
  cartTotal: number
}

export const Checkout: FunctionComponent<CheckoutProps> = (props) => {
  const { addItem, removeItem, pendingItems, toggleCheckout, confirmPurchase, setType, cartTotal } = props;
  const typeRef = useRef(null);

  const Cart = () => {
    if (pendingItems.length > 0) {
      return pendingItems.map(item => {
        return (
          <div className="row">
            <span className="col-xs-4">{item.name}</span>
            <span className="col-xs-2">${item.price.toFixed(2)}</span>
            <span className="col-xs-2">{item.quantity}</span>
            <div onClick={() => addItem(item)} className="col-xs-2 flex-row flex-align-center flex-justify-content-center">
              <i className="fa fa-2x fa-plus" />
            </div>
            <div onClick={() => removeItem(item)} className="col-xs-2 flex-row flex-align-center flex-justify-content-center">
              <i className="fa fa-2x fa-minus" />
            </div>
          </div>
        );
      });
    }

    return (
      <div className="empty-cart">
        <h3>The cart is empty</h3>
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-inner checkout flex-col flex-align-center">
        <div className="close-popup" onClick={() => toggleCheckout()}>
          x
        </div>
        <h1>Checkout</h1>
        <div className="cart-checkout">
          <div className="row">
            <span className="col-xs-4">Name</span>
            <span className="col-xs-2">Price</span>
            <span className="col-xs-2">Qty</span>
            <span className="col-xs-2 flex-row flex-align-center flex-justify-content-center">Add</span>
            <span className="col-xs-2 flex-row flex-align-center flex-justify-content-center">Remove</span>
          </div>
          {Cart()}
        </div>
        <div className="cart-total">
        <h2>${cartTotal.toFixed(2)}</h2>
        </div>

        <select ref={typeRef} onChange={(e) => setType(parseInt(e.target.value))}> 
          <option value={MoneyLogEntryType.Cash}>{MoneyLogEntryType[MoneyLogEntryType.Cash]}</option>
          <option value={MoneyLogEntryType.Check}>{MoneyLogEntryType[MoneyLogEntryType.Check]}</option>
          <option value={MoneyLogEntryType.Paypal}>{MoneyLogEntryType[MoneyLogEntryType.Paypal]}</option>
        </select>

        {
          (typeRef.current && parseInt(typeRef.current.value) === MoneyLogEntryType.Paypal) &&
          <>
            <img src="./src/images/kadiepaypal.jpg"/>
            <p>kadiepangburn@gmail.com</p>
          </>
        }
        <button className="confirm-btn btn btn-success" disabled={pendingItems.length === 0} onClick={() => confirmPurchase()}>Confirm Purchase</button>
      </div>
    </div>
  );
}

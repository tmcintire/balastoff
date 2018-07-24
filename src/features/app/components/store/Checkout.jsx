import React from 'react';

export const Checkout = props => {
  const Cart = () => {
    if (props.pendingItems.length > 0) {
      return props.pendingItems.map(item => {
        return (
          <div className="row">
            <span className="col-xs-4">{item.name}</span>
            <span className="col-xs-2">${item.price.toFixed(2)}</span>
            <span className="col-xs-2">{item.cartQuantity}</span>
            <div onClick={() => props.addItem(item)} className="col-xs-2 flex-row flex-align-center flex-justify-content-center">
              <i className="fa fa-2x fa-plus" />
            </div>
            <div onClick={() => props.removeItem(item)} className="col-xs-2 flex-row flex-align-center flex-justify-content-center">
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
        <div className="close-popup" onClick={() => props.toggleCheckout()}>
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
          <Cart />
        </div>
        <div className="cart-total">
        <h2>${props.cartTotal.toFixed(2)}</h2>
        </div>

        <button className="confirm-btn btn btn-success" disabled={props.pendingItems.length === 0} onClick={() => props.confirmPurchase()}>Confirm Purchase</button>
      </div>
    </div>
  );
}

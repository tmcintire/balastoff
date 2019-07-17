import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import * as _ from 'lodash';
import { Checkout } from './Checkout';
import * as api from '../../../data/api';
import { IStore, MoneyLogEntryType, IMoneyLogEntry } from '../../../data/interfaces';

const Loading = require('react-loading-animation');

interface IStoreProps {
  store: IStore[],
}

export const Store: FunctionComponent<IStoreProps> = (props) => {
  const {store} = props;

  const [pendingItems, setPendingItems] = useState<IStore[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [showToastMessage, setShowToastMessage] = useState<boolean>(false);
  const [moneyLogEntryType, setMoneyLogEntryType] = useState<MoneyLogEntryType>(MoneyLogEntryType.Cash);

  const Store = () => {
    if (!store) {
      return (
        <Loading />
      );
    }
    return Object.keys(store).map((key) => {
      const item = store[key];
      return (
        <div className="store-item">
          <span className="item-name">{item.name}</span>
          <span className="item-price">${item.price}</span>
          <button className="store-btn btn btn-primary" onClick={() => addItem(item)}>Add To Cart</button>
        </div>
      );
    });
  };

  const renderCart = () => {
    return pendingItems.map(item => {
      return (
        <p>{item.name} - {item.quantity}</p>
      );
    });
  }

  const ToastMessage = () => (
    <div className="purchase-toast">
      <span>Success!</span>
    </div>
  );

  const confirmPurchase = () => {
    api.updateTotalCollected(cartTotal);
    const details = pendingItems.map(item => {
      return {
        item: item.name,
        quantity: item.quantity,
        price: item.price,
      };
    });
    const moneyLog: IMoneyLogEntry = {
      bookingId: null,
      amount: cartTotal,
      details,
      type: moneyLogEntryType
    };
    api.updateMoneyLog(moneyLog);
    const newStorequantitys = updateStoreItemCount();
    api.updateStoreItemCount(newStorequantitys);
    setShowCheckout(!showCheckout);
    purchaseToast();
    clearCart();
  };

  const updateStoreItemCount = () => {
    let storeObject = _.cloneDeep(store);
 
    _.forEach(store, (item, key) => {
      const pendingItem = _.find(pendingItems, i => i.name === item.name);

      if (pendingItem) {
        storeObject[key].quantity = storeObject[key].quantity + pendingItem.quantity;
      }
    });

    return storeObject;
  }
  
  const removeItem = (storeItem) => {
    const cartQuantity = _.find(pendingItems, item => item.name === storeItem.name).quantity - 1;
    let newPendingItems;
    if (cartQuantity === 0) {
      newPendingItems = pendingItems.filter(item => item.name !== storeItem.name);
    } else {
      newPendingItems = pendingItems.map(item => item.name === storeItem.name ? {
        ...item, quantity: cartQuantity } : item
      );
    }

    setPendingItems(newPendingItems);
    setCartTotal(getCartTotal(newPendingItems));
  }

  const addItem = (storeItem) => {
    let newPendingItems: IStore[];
    if (_.find(pendingItems, p => p.name === storeItem.name)) {
      // the item is already in the cart, update the quantity only
      newPendingItems = pendingItems.map((item, index) => {
        if (item.name === storeItem.name) {
          return {
            ...pendingItems[index],
            quantity: pendingItems[index].quantity + 1,
          };
        }
        return { ...pendingItems[index] };
      });
    } else {
      const newItem: IStore = { ...storeItem, quantity: 1 };
      newPendingItems = pendingItems.concat([newItem]);
    }

    setCartTotal(getCartTotal(newPendingItems));
    setPendingItems(newPendingItems);
  };

  const getCartTotal = (pendingItems) => {
    const cartTotal = _.sumBy(pendingItems, (item: IStore) => {
      let total = 0;
      if (item.price && item.quantity) {
        total = item.price * item.quantity;
      }
      return total;
    });

    return cartTotal;
  }

  const clearCart = () => {
    setPendingItems([]);
    setCartTotal(0);
    setMoneyLogEntryType(MoneyLogEntryType.Cash);
  };

  const purchaseToast = () => {
    setShowToastMessage(true);
    setTimeout(() => {
      setShowToastMessage(false);
    }, 2000);
  }

  const CartItems = () => {
    const totalItems = _.sumBy(pendingItems, 'cartQuantity');
    if (totalItems > 0) {
      return (
        <h2> ({totalItems} items)</h2>
      );
    }

    return null;    
  }

  return (
    <div className="container">
      <h1 className="text-center">BalastOff! Store</h1>
      <div className="flex-wrap flex-row flex-justify-space-between">
        {Store()}
      </div>
      <div className="cart">
        <div className="flex-row">
          <h2>Cart Total - ${cartTotal.toFixed(2)}&nbsp;</h2>
          <CartItems />
        </div>
        {renderCart()}
        <div className="store-btns flex-row flex-justify-space-between">
          <button disabled={pendingItems.length === 0} className="btn btn-danger flex-grow" onClick={clearCart}>Clear Cart</button>
          <button 
            disabled={pendingItems.length === 0} 
            className="btn btn-success flex-grow" 
            onClick={() => setShowCheckout(!showCheckout)}>
            Checkout
          </button>
        </div>
        { showCheckout &&
          <Checkout
            pendingItems={pendingItems}
            cartTotal={cartTotal}
            setType={setMoneyLogEntryType}
            toggleCheckout={() => setShowCheckout(!showCheckout)}
            addItem={addItem}
            removeItem={removeItem}
            confirmPurchase={confirmPurchase}
          />
        }
      </div>
      { showToastMessage && <ToastMessage /> }
    </div>
  );
};
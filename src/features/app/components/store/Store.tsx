import * as React from 'react';
import * as _ from 'lodash';
import { Checkout } from './Checkout';
import * as api from '../../../data/api';
import { IStore, MoneyLogEntryType, IMoneyLogEntry } from '../../../data/interfaces';

const Loading = require('react-loading-animation');

interface StoreProps {
  store: IStore[],
}

interface StoreState {
  pendingItems: IStore[],
  loading: boolean,
  cartTotal: number,
  showCheckout: boolean,
  showToastMessage: boolean
  moneyLogEntryType: MoneyLogEntryType,
}

export class Store extends React.Component<StoreProps, StoreState> {
  constructor(props) {
    super(props);

    this.state = {
      moneyLogEntryType: MoneyLogEntryType.Cash,
      loading: true,
      cartTotal: 0,
      showCheckout: false,
      pendingItems: [],
      showToastMessage: false,
    };
  }

  componentWillMount() {
    if (this.props.store) {
      this.setState({
        loading: false,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.store) {
      this.setState({
        loading: false,
      });
    }
  }

  rowRenderer = ({ key, index, style}) => {
    return (
      <div
        key={key}
        style={style}
      >
        {this.props.store[index].name}
      </div>
    );
  }

  confirmPurchase = () => {
    api.updateTotalCollected(this.state.cartTotal);
    const details = this.state.pendingItems.map(item => {
      return {
        item: item.name,
        quantity: item.quantity,
        price: item.price,
      };
    });
    const moneyLog: IMoneyLogEntry = {
      bookingId: null,
      amount: this.state.cartTotal,
      details,
      type: this.state.moneyLogEntryType
    };
    api.updateMoneyLog(moneyLog);
    const newStoreCounts = this.updateStoreItemCounts();
    api.updateStoreItemCount(newStoreCounts);
    this.toggleCheckout();
    this.purchaseToast();
    this.clearCart();
  };

  updateStoreItemCounts = () => {
    let storeObject = _.cloneDeep(this.props.store);
 
    _.forEach(this.props.store, (item, key) => {
      const pendingItem = _.find(this.state.pendingItems, i => i.name === item.name);

      if (pendingItem) {
        storeObject[key].quantity = storeObject[key].quantity + pendingItem.quantity;
      }
    });

    return storeObject;
  }
  
  removeItem = (storeItem) => {
    const cartQuantity = _.find(this.state.pendingItems, item => item.name === storeItem.name).quantity - 1;
    let pendingItems;
    if (cartQuantity === 0) {
      pendingItems = this.state.pendingItems.filter(item => item.name !== storeItem.name);
    } else {
      pendingItems = this.state.pendingItems.map(item => item.name === storeItem.name ? {
        ...item, quantity: cartQuantity } : item
      );
    }

    this.setState({
      cartTotal: this.getCartTotal(pendingItems),
      pendingItems,
    });
  }

  addItem = (storeItem) => {
    let pendingItems: IStore[];
    if (_.find(this.state.pendingItems, p => p.name === storeItem.name)) {
      // the item is already in the cart, update the quantity only
      pendingItems = this.state.pendingItems.map((item, index) => {
        if (item.name === storeItem.name) {
          return {
            ...this.state.pendingItems[index],
            quantity: this.state.pendingItems[index].quantity + 1,
          };
        }
        return { ...this.state.pendingItems[index] };
      });
    } else {
      const newItem: IStore = { ...storeItem, quantity: 1 };
      pendingItems = this.state.pendingItems.concat([newItem]);
    }

    this.setState({
      cartTotal: this.getCartTotal(pendingItems),
      pendingItems,
    });
  };

  getCartTotal = (pendingItems) => {
    const cartTotal = _.sumBy(pendingItems, (item: IStore) => {
      let total = 0;
      if (item.price && item.quantity) {
        total = item.price * item.quantity;
      }
      return total;
    });

    return cartTotal;
  }

  clearCart = () => this.setState({ pendingItems: [], cartTotal: 0, moneyLogEntryType: MoneyLogEntryType.Cash });
  toggleCheckout = () => this.setState({ showCheckout: !this.state.showCheckout });

  purchaseToast = () => {
    this.setState({
      showToastMessage: true,
    });
    setTimeout(() => {
      this.setState({
        showToastMessage: false,
      });
    }, 2000);
  }

  setType = (type: MoneyLogEntryType) => {
    this.setState({
      moneyLogEntryType: type
    });
  }

  CartItems = () => {
    const totalItems = _.sumBy(this.state.pendingItems, 'cartQuantity');
    if (totalItems > 0) {
      return (
        <h2> ({totalItems} items)</h2>
      );
    }

    return null;    
  }

  Store = () => {
    if (this.state.loading) {
      return (
        <Loading />
      );
    }
    return Object.keys(this.props.store).map((key) => {
      const item = this.props.store[key];
      return (
        <div className="store-item">
          <span className="item-name">{item.name}</span>
          <span className="item-price">${item.price}</span>
          <button className="store-btn btn btn-primary" onClick={() => this.addItem(item)}>Add To Cart</button>
        </div>
      );
    });
  };

  renderCart = () => {
    return this.state.pendingItems.map(item => {
      return (
        <p>{item.name} - {item.quantity}</p>
      );
    });
  }

  ToastMessage = () => (
    <div className="purchase-toast">
      <span>Success!</span>
    </div>
  );

  render() {
    const { cartTotal, pendingItems } = this.state;

    return (
      <div className="container">
        <h1 className="text-center">BalastOff! Store</h1>
        <div className="flex-wrap flex-row flex-justify-space-between">
          {this.Store()}
        </div>
        <div className="cart">
          <div className="flex-row">
            <h2>Cart Total - ${this.state.cartTotal.toFixed(2)}&nbsp;</h2>
            <this.CartItems />
          </div>
          {this.renderCart()}
          <div className="store-btns flex-row flex-justify-space-between">
            <button disabled={this.state.pendingItems.length === 0} className="btn btn-danger flex-grow" onClick={this.clearCart}>Clear Cart</button>
            <button disabled={this.state.pendingItems.length === 0} className="btn btn-success flex-grow" onClick={this.toggleCheckout}>Checkout</button>
          </div>
          { this.state.showCheckout &&
            <Checkout
              pendingItems={pendingItems}
              cartTotal={cartTotal}
              setType={this.setType}
              toggleCheckout={this.toggleCheckout}
              addItem={this.addItem}
              removeItem={this.removeItem}
              confirmPurchase={this.confirmPurchase}
            />
          }
        </div>
        { this.state.showToastMessage && <this.ToastMessage /> }
      </div>
    );
  }

}

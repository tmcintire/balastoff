import React from 'react';
import _ from 'lodash';
import { Column, Table, AutoSizer } from 'react-virtualized';
import { PurchaseItem } from './PurchaseItem';

const Loading = require('react-loading-animation');

export class Store extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      showPurchaseItem: false,
      purchasingItem: null,
      itemIndex: null,
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

  purchaseItem = (storeItem, index) => {
    this.setState({
      showPurchaseItem: true,
      purchasingItem: storeItem,
      itemIndex: index,
    });
  };

  closePopup = () => {
    this.setState({
      showPurchaseItem: false,
      purchasingItem: null,
      itemIndex: null,
    });
  }

  purchaseToast = (obj) => {
    this.setState({
      toastMessage: `Sold ${obj.quantity} ${obj.name} for $${obj.total}`,
      showToastMessage: true,
    });
    setTimeout(() => {
      this.setState({
        toastMessage: null,
        showToastMessage: false,
      });
    }, 2000);
  }

  render() {
    const renderStore = () => {
      if (this.state.loading) {
        return (
          <Loading />
        );
      }
      return this.props.store.map((s, index) => {
        return (
          <div className="store-item">
            <span className="item-name">{s.name}</span>
            <span className="item-price">${s.price}</span>
            <button className="store-btn btn btn-primary" onClick={() => this.purchaseItem(s, index)}>Buy</button>
          </div>
        );
      });
    };

    const renderPurchaseItem = () => {
      if (this.state.showPurchaseItem) {
        return (
          <PurchaseItem
            item={this.state.purchasingItem}
            itemIndex={this.state.itemIndex}
            closePopup={this.closePopup}
            purchaseToast={this.purchaseToast}
          />
        );
      }
      return null;
    };

    const renderToastMessage = () => {
      if (this.state.showToastMessage) {
        return (
          <div className="purchase-toast">
            <span>{this.state.toastMessage}</span>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="container">
        <h1 className="text-center">BalastOff! Store</h1>
        <div className="flex-wrap flex-row flex-justify-space-between">
          {renderStore()}
        </div>
        {renderPurchaseItem()}
        {renderToastMessage()}
      </div>
    );
  }

}

Store.propTypes = {
  children: React.PropTypes.node,
};

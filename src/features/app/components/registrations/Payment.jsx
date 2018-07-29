import React from 'react';
import PropTypes from 'prop-types';

export const Payment = props => {
  let style = {};
  if (props.amountOwed > 0) {
    style = {
      color: 'red',
    };
  }
  const renderPay = () => {
    if (!props.fullyPaid) {
      return (
        <span className="full-width"><strong>Paid: </strong>
          <input type="checkbox" checked={props.fullyPaid} onChange={props.togglePaid} />
        </span>
      );
    }
  };

  const renderRefund = () => {
    if (props.amountOwed < 0) {
      return (
        <span className="full-width"><strong>Refunded: </strong>
          <input type="checkbox" checked={props.amountOwed === 0} onChange={props.togglePaid} />
        </span>
      );
    }
  };

  return (
    <div>
      <div className="level-container">
        <h3><strong><u>Payment Information</u></strong></h3>
        <div className="info-container">
          <p className="full-width"><strong>Amount Owed: </strong><span style={style}>${props.amountOwed.toFixed(2)}</span></p>
          {renderPay()}
          {renderRefund()}
        </div>

      </div>
    </div>
  );
};

Payment.propTypes = {
  amountOwed: PropTypes.number,
  fullyPaid: PropTypes.boolean,
  togglePaid: PropTypes.function,
};

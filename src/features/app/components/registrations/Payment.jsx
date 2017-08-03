import React from 'react';

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
  return (
    <div>
      <div className="level-container">
        <h3><strong><u>Payment Information</u></strong></h3>
        <div className="info-container">
          <p className="full-width"><strong>Amount Owed: </strong><span style={style}>${props.amountOwed}</span></p>
          {renderPay()}
        </div>

      </div>
    </div>
  );
};

Payment.propTypes = {
  amountOwed: React.PropTypes.string,
  fullyPaid: React.PropTypes.boolean,
  togglePaid: React.PropTypes.function,
};

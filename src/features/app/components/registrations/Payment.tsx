import * as React from 'react';
import { FunctionComponent } from 'react';

interface PaymentProps {
  amountOwed: number,
  fullyPaid: boolean,
  togglePaid: (e) => void
}

export const Payment: FunctionComponent<PaymentProps> = (props) => {
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

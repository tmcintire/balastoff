import * as React from 'react';
import { FunctionComponent } from 'react';
import { MoneyLogEntryType } from '../../../data/interfaces';

interface PaymentProps {
  amountOwed: number,
  fullyPaid: boolean,
  togglePaid: (e) => void,
  setType: (type: MoneyLogEntryType) => void;
  type: MoneyLogEntryType;
}

export const Payment: FunctionComponent<PaymentProps> = (props) => {
  const { amountOwed, fullyPaid, togglePaid, setType, type } = props;

  let style = {};
  if (amountOwed > 0) {
    style = {
      color: 'red',
    };
  }
  const renderPay = () => {
    if (!fullyPaid) {
      return (
        <span className="full-width"><strong>Paid: </strong>
          <input type="checkbox" checked={fullyPaid} onChange={togglePaid} />
          <select onChange={(e) => setType(parseInt(e.target.value))}> 
            <option value={MoneyLogEntryType.Cash}>{MoneyLogEntryType[MoneyLogEntryType.Cash]}</option>
            <option value={MoneyLogEntryType.Check}>{MoneyLogEntryType[MoneyLogEntryType.Check]}</option>
            <option value={MoneyLogEntryType.Paypal}>{MoneyLogEntryType[MoneyLogEntryType.Paypal]}</option>
          </select>
          {
            (type === MoneyLogEntryType.Paypal) &&
            <>
              <img src="./src/images/kadiepaypal.jpg"/>
              <p>kadiepangburn@gmail.com</p>
            </>
          }
        </span>
      );
    }
  };

  const renderRefund = () => {
    if (amountOwed < 0) {
      return (
        <span className="full-width"><strong>Refunded: </strong>
          <input type="checkbox" checked={amountOwed === 0} onChange={togglePaid} />
        </span>
      );
    }
  };

  return (
    <div>
      <div className="level-container">
        <h3><strong><u>Payment Information</u></strong></h3>
        <div className="info-container">
          <p className="full-width"><strong>Amount Owed: </strong><span style={style}>${amountOwed.toFixed(2)}</span></p>
          {renderPay()}
          {renderRefund()}
        </div>
      </div>
    </div>
  );
};

import React from 'react';

export const Payment = props => (
  <div>
    <div className="level-container">
      <h3><strong><u>Payment Information</u></strong></h3>
      <div className="info-container">
        <span className="full-width"><strong>Amount Owed: </strong>{props.amountOwed} </span>
        <span className="full-width"><strong>Fully Paid: </strong>
          <input type="checkbox" checked={props.fullyPaid} onChange={props.togglePaid} />
        </span>
      </div>

    </div>
  </div>
);

Payment.propTypes = {
  amountOwed: React.PropTypes.string,
  fullyPaid: React.PropTypes.boolean,
  togglePaid: React.PropTypes.function,
};

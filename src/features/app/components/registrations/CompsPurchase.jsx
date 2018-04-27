import React from 'react';
import PropTypes from 'prop-types';

export const CompsPurchase = (props) => {
  const renderCompsList = () => props.unregisteredComps.map((c, index) => (
    <div key={index} className="info-container">
      <div className="comp-info flex-align-center flex-row">
        <input type="checkbox" onChange={e => props.compSelectionChange(e, c)} />
        <span className="full-width">{c.name}(${c.price}): </span>
      </div>
    </div>
  ));
  return (
    <div className="confirmation-container">
      <div className="confirmation-inner flex-col flex-align-center">
        <div className="close-popup" onClick={props.closePopup}>
        x
        </div>
        <h1>Confirm Purchase</h1>
        <div className="flex-col flex-align-start">
          {renderCompsList()}
        </div>

        <div className="final-total">
          <span>Total: ${props.purchasingAmount}</span>
        </div>

        <button className="confirm-btn btn btn-success" onClick={props.confirmPurchase}>Confirm Purchase</button>
      </div>
    </div>

  );
};

CompsPurchase.propTypes = {
  confirmPurchase: PropTypes.func,
  closePopup: PropTypes.func,
  compSelectionChange: PropTypes.func,
  unregisteredComps: PropTypes.array,
  purchasingAmount: PropTypes.number,
};

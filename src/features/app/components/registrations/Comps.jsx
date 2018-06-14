import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import * as api from '../../../data/api';

import { CompsPurchase } from './CompsPurchase';

export class Comps extends React.Component {
  constructor(props) {
    super(props);

    // const comps = this.getComps();

    this.state = {
      hasPaid: props.registration.HasPaid,
      originalAmountOwed: props.registration['Amount Owed'],
      showAddComps: false,
      registrantComps: [],
    };
  }

  handleValueChange = (e, comp, role, amount) => {
    let amountOwed = 0;
    let object = {};
    if (role === 'AdNovDrawRole') {
      object = {
        [role]: e.target.value,
      };
    } else {
      const compDecision = e.target.value;
      const owed = parseInt(this.props.registration['Amount Owed'], 10);
      if (compDecision === 'Yes') {
        amountOwed = owed + amount;
        this.props.updateMoneyLogComment('Comp added');
      } else if (compDecision === 'No') {
        amountOwed = owed - amount;
        this.props.updateMoneyLogComment('Comp removed');
      }

      object = {
        [comp]: e.target.value,
        'Amount Owed': amountOwed,
        HasPaid: !amountOwed > 0,
      };
    }

    this.setState({
      amountOwed,
    });

    api.updateRegistration(this.props.id, object);
    this.props.saved();
  }

  timer = () => null;

  startTimer(object) {
    this.timer = setTimeout(() => {
      this.props.saved();
      api.updateRegistration(this.props.id, object);
    }, 1000);
  }

  handlePartnerChange = (e, partnerType) => {
    const object = {
      [partnerType]: e.target.value,
    };

    clearTimeout(this.timer);
    this.startTimer(object);
  }

  showAddComps = () => this.setState({ showAddComps: true });
  closePopup = () => this.setState({ showAddComps: false });

  modifyComps = (purchasingComps) => {
    const registration = {};
    _.forEach(purchasingComps, (c) => {
      registration[c.comp] = c.IsCompeting ? 'Yes' : 'No';
    });

    /////*** need to modify this to update comps object on the registration */
    api.updateRegistrationComps(this.props.id, registration);
  };

  confirmPurchase = (purchasingComps, purchaseAmount) => {
    api.updateRegistrationComps(this.props.id, purchasingComps).then(() => {
      this.setState({
        showAddComps: false,
      });
    });

    const details = [];

    let comps = purchasingComps.filter(pc => {
      return !_.some(this.props.comps, c => c.Key === pc.Key);
    });

    if (purchaseAmount > 0) {
      _.forEach(comps, c => {
        details.push({
          item: c.Name,
          quantity: 1,
          price: this.findCompPrice(c.Key),
        });
      });

      const moneyLog = {
        bookingId: this.props.id,
        amount: purchaseAmount,
        details,
        void: false,
      };

      api.updateMoneyLog(moneyLog);
    }
  }

  findCompPrice = comp => _.find(this.props.allComps, c => c.Key === comp).Price;

  render() {
    const { registration } = this.props;

    const amCouplesPartner = () => {
      if (registration['Amateur Couples'] === 'Yes') {
        return (
          <div className="partner-input flex-row flex-justify-space-between">
            <label>Partner: </label>
            <input className="form-control ad-nov-role" type="text" defaultValue={registration['Amateur Partner']} onChange={e => this.handlePartnerChange(e, 'Amateur Partner')} />
          </div>
        );
      }
    };
    const openPartner = () => {
      if (registration.Open === 'Yes') {
        return (
          <div className="partner-input flex-row flex-justify-space-between">
            <label>Partner: </label>
            <input className="form-control ad-nov-role" type="text" defaultValue={registration.Partner} onChange={e => this.handlePartnerChange(e, 'Partner')} />
          </div>
        );
      }
    };

    const adNovRoleSelect = () => {
      if (registration.AdNov === 'Yes') {
        return (
          <div className="partner-input flex-row flex-justify-space-between">
            <label>Role: </label>
            <select className="form-control ad-nov-role" id="type" defaultValue={registration.AdNovDrawRole} onChange={e => this.handleValueChange(e, 'AdNov', 'AdNovLeadFollow')}>
              <option value="" />
              <option value="Lead">Lead</option>
              <option value="Follow">Follow</option>
            </select>
          </div>
        );
      }
    };

    const renderComps = () => {
      if (!_.isEmpty(this.props.comps)) {
        return this.props.comps.map((c) => {
          return (
            <div className="info-container">
              {
                c.Key === 'AdNov' || c.Key === 'AmateurDraw' ?
                  <span>{c.Name} - {c.Role}</span>
                :
                  <span>{c.Name} - {c.Partner}</span>
              }
            </div>
          );
        });
      }
      return (
        <h4>No Comps Selected </h4>
      );
    };

    const renderCompPurchase = () => {
      if (this.state.showAddComps) {
        return (
          <CompsPurchase
            confirmPurchase={this.confirmPurchase}
            closePopup={this.closePopup}
            allComps={this.props.allComps}
            comps={this.props.comps}
            compSelectionChange={this.compSelectionChange}
            purchasingAmount={this.state.purchaseAmount}
          />
        );
      }

      return null;
    };

    return (
      <div>
        <div className="comp-container">
          <h3><strong><u>Comps</u></strong></h3>
          {renderComps()}
          <button className="btn btn-primary" onClick={() => this.showAddComps()}>Edit Comps</button>
        </div>
        {renderCompPurchase()}
      </div>
    );
  }
}

Comps.propTypes = {
  registration: PropTypes.array,
  partner: PropTypes.string,
  updateMoneyLogComment: PropTypes.func,
};

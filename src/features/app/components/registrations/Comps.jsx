import React from 'react';
import _ from 'lodash';
import * as api from '../../../data/api';

import { CompsPurchase } from './CompsPurchase';

export class Comps extends React.Component {
  constructor(props) {
    super(props);

    const comps = this.getComps();

    this.state = {
      hasPaid: props.registration.HasPaid,
      originalAmountOwed: props.registration['Amount Owed'],
      showAddComps: false,
      comps,
      purchasingComps: [],
      purchaseAmount: 0,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log(nextProps);
  }

  getComps = () => {
    const comps = [];
    if (this.props.registration.AdNov === 'Yes') {
      comps.push({ comp: 'AdNov', role: this.props.registration.AdNovDrawRole, partner: null });
    }
    if (this.props.registration['Amateur Couples'] === 'Yes') {
      comps.push({ comp: 'Amateur Couples', role: null, partner: this.props.registration['Amateur Partner'] });
    }
    if (this.props.registration.Open === 'Yes') {
      comps.push({ comp: 'Open', role: null, partner: this.props.registration.Partner });
    }

    return comps;
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

  compSelectionChange = (e, comp) => {
    const checked = e.target.checked;

    if (checked) {
      if (comp.key === 'AdNov') {
        this.setState({ showAdNovRole: true });
      } else if (comp.key === 'Open') {
        this.setState({ showOpenPartner: true });
      } else {
        this.setState({ showAmateurPartner: true });
      }

      this.setState({
        purchasingComps: this.state.purchasingComps.concat(comp),
        purchaseAmount: this.state.purchaseAmount + comp.price,
      });
    } else {
      this.setState({
        purchasingComps: _.without(this.state.purchasingComps, comp),
        purchaseAmount: this.state.purchaseAmount - comp.price,
      });
    }
  }

  modifyComps = () => {
    const registration = {};
    _.forEach(this.state.purchasingComps, c => {
      registration[c.key] = 'Yes';
    });

    api.updateRegistration(this.props.id, registration);
  };

  confirmPurchase = () => {
    this.modifyComps();

    const details = [];

    _.forEach(this.state.purchasingComps, (c) => {
      details.push({
        item: c.name,
        quantity: 1,
        price: c.price,
      });
    });

    const moneyLog = {
      bookingId: this.props.id,
      amount: this.state.purchaseAmount,
      details,
    };

    const comps = this.getComps();

    api.updateMoneyLog(moneyLog);
  }

  render() {
    const { registration } = this.props;

    const unregisteredComps = _.filter(this.props.comps, (c => {
      return !_.some(this.state.comps, uc => c.key === uc.comp);
    }));
  
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
      if (!_.isEmpty(this.state.comps)) {
        return this.state.comps.map(c => (
          <div className="info-container">
            {
              c.comp === 'AdNov Draw' ?
                <span>{c.comp} - {c.role}</span>
              :
                <span>{c.comp} - {c.partner}</span>
            }
          </div>
        ));

        // return (
        //   <div>
        //     <div className="info-container flex-col">
        //       <span>
        //     </div>
        //     <div className="info-container flex-col">
        //       <div className="comp-info flex-row">
        //         <span className="full-width">AdNov Comp ($5): </span>
        //         <select className="comp-select form-control" id="type" defaultValue={registration.AdNov} onChange={e => this.handleValueChange(e, 'AdNov', null, 5)}>
        //           <option value="Yes">Yes</option>
        //           <option value="No">No</option>
        //         </select>
        //       </div>
        //       {adNovRoleSelect()}
        //     </div>
        //     <div className="info-container flex-col">
        //       <div className="comp-info flex-row">
        //         <span className="full-width">Amateur Couples ($20): </span>
        //         <select className="comp-select form-control" id="type" defaultValue={registration['Amateur Couples']} onChange={e => this.handleValueChange(e, 'Amateur Couples', null, 20)}>
        //           <option value="Yes">Yes</option>
        //           <option value="No">No</option>
        //         </select>
        //       </div>
        //       {amCouplesPartner()}
        //     </div>
        //     <div className="info-container flex-col">
        //       <div className="comp-info flex-row">
        //         <span className="full-width">Three Stage Open ($40): </span>
        //         <select className="comp-select form-control" id="type" defaultValue={registration.Open} onChange={e => this.handleValueChange(e, 'Open', null, 40)}>
        //           <option value="Yes">Yes</option>
        //           <option value="No">No</option>
        //         </select>
        //       </div>
        //       {openPartner()}
        //     </div>
        //   </div>
        // );
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
            unregisteredComps={unregisteredComps}
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
          <button className="btn btn-primary" onClick={() => this.showAddComps()}>Add Comps</button>
        </div>
        {renderCompPurchase()}
      </div>
    );
  }
}

Comps.propTypes = {
  registration: React.PropTypes.array,
  partner: React.PropTypes.string,
  updateMoneyLogComment: React.PropTypes.function,
};

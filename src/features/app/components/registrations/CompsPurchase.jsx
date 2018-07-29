import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as api from '../../../data/api';

class NewComp {
  constructor(key, name, partner, role) {
    this.Key = key;
    this.Name = name;
    this.Partner = partner;
    this.Role = role;
  }
}

export class CompsPurchase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pendingMoneyLogDetails: [],
    };
  }

  // Handle whether nor not a comp is selected for purchase
  compSelectionChange = (e, comp) => {
    const isCompeting = e.target.checked;
    let pendingMoneyLogDetails = [];
    let purchaseAmount = this.props.pendingMoneyLog.amount;
    
    const newComp = new NewComp(comp.Key, comp.Name, '', '');
    let comps;
    if (isCompeting) {
      comps = this.props.registrationComps.concat(newComp);
      purchaseAmount = this.props.pendingMoneyLog.amount + comp.Price;
      
      // Handle the money log details. If it's not in the money log we need to add it
      pendingMoneyLogDetails = this.props.pendingMoneyLog.details.concat([{
        item: `Added Comp - ${comp.Name}`,
        price: comp.Price,
      }]);
    } else {
      comps = this.props.registrationComps.filter(c => c.Key !== newComp.Key);

      // if this comp was pending to go in then we need to remove it from pending, otherwise itw as already paid
      // for and the money log needs to be modified
      const foundInMoneyLog = _.some(this.props.pendingMoneyLog.details, d => d.item === `Added Comp - ${comp.Name}`);

      if (foundInMoneyLog) {
        pendingMoneyLogDetails = this.props.pendingMoneyLog.details.filter(d => d.item !== `Added Comp - ${comp.Name}`);
      } else {
        pendingMoneyLogDetails = this.props.pendingMoneyLog.details.concat([{
          item: `Removed Comp - ${comp.Name}`,
          price: -(comp.Price),
        }]);
      }

      purchaseAmount = this.props.pendingMoneyLog.amount - comp.Price; // reduce the price from the pending purchases
    }

    this.props.updatePendingMoneyLog(pendingMoneyLogDetails, purchaseAmount);
    api.updateRegistration(this.props.id, { 'Amount Owed': purchaseAmount, HasPaid: purchaseAmount <= 0 });

    api.updateRegistrationComps(this.props.id, comps);


    // let purchaseAmount;
    // let newComp;
    // let updatedComps;
    // if (IsCompeting) {
    //   purchaseAmount = this.state.purchaseAmount ? this.state.purchaseAmount + comp.Price : comp.Price;
    //   newComp = new NewComp(comp.Key, comp.Name, '', '');
    //   if (this.state.updatedComps) {
    //     updatedComps = this.state.updatedComps.concat(newComp);
    //   } else {
    //     updatedComps = [newComp];
    //   }
    // } else {
    //   purchaseAmount = this.state.purchaseAmount ? this.state.purchaseAmount - comp.Price : -comp.Price;

    //   // find the comp that was unselsected and remove it
    //   updatedComps = _.filter(this.state.comps, c => c.Key !== comp.Key);
    // }

    // this.setState({ updatedComps, purchaseAmount });
  }

  handlePartnerChange = (Partner, key) => {
    const updatedComps = this.props.registrationComps.map(comp => comp.Key === key ? { ...comp, Partner } : comp);
    api.updateRegistrationComps(this.props.id, updatedComps);
  }

  handleRoleChange = (Role, key) => {
    const updatedComps = this.props.registrationComps.map(comp => comp.Key === key ? { ...comp, Role } : comp);
    api.updateRegistrationComps(this.props.id, updatedComps);
  }

  confirmPurchase = (updatedComps, purchaseAmount) => {
    // api.updateRegistrationComps(this.props.id, updatedComps).then(() => {
    //   this.setState({
    //     showAddComps: false,
    //   });
    // });

    // const newAmountOwed = parseInt(this.props.amountOwed, 10) + purchaseAmount;
    // api.updateRegistration(this.props.id, { 'Amount Owed': newAmountOwed, HasPaid: newAmountOwed === 0 });

    // const details = _.cloneDeep(this.props.pendingMoneyLog.details);
    // const addedComps = _.difference(updatedComps, this.props.registrationComps);
    // const removedComps = _.difference(this.props.registrationComps, updatedComps);

    // _.forEach(addedComps, comp => {
    //   const c = _.find(this.props.allComps, ac => ac.Key === comp.Key);

    //   details.push({
    //     item: `Added Comp - ${comp.Name}`,
    //     price: c.Price,
    //     quantity: 1,
    //   });
    // });

    // _.forEach(removedComps, comp => {
    //   if (details.length > 0) {
    //     // we have money logs already, so we need to find the one and remove it
    //     _.remove(details, d => _.includes(d.item, comp.Name));
    //   } else {
    //     // we are just removing comps
    //     const c = _.find(this.props.allComps, ac => ac.Key === comp.Key);

    //     details.push({
    //       item: `Removed Comp - ${comp.Name}`,
    //       price: -(c.Price),
    //       quantity: 1,
    //     });
    //   }
    // });

    // this.props.updatePendingMoneyLog(details, purchaseAmount);
    this.props.toggleAddComps();
  }

  findCompPrice = comp => _.find(this.props.allComps, c => c.Key === comp).Price;

  CompsList = () => this.props.allComps.map((comp, index) => {
    const isSelected = _.some(this.props.registrationComps, rc => rc.Key === comp.Key);

    return (
      <div key={index} className="info-container">
        <div className="comp-info flex-align-center flex-row flex-justify-space-between">
          <div className="flex-row">
            <input type="checkbox" checked={isSelected} onChange={e => this.compSelectionChange(e, comp)} />
            <span>{comp.Name}(${comp.Price}): </span>
          </div>
          <div className="partner-role-container">
            <this.PartnerOrRole comp={comp} />
          </div>
        </div>
      </div>
    );
  });

  PartnerOrRole = ({ comp }) => {
    const compData = _.find(this.props.allComps, c => c.Key === comp.Key);
    const found = _.find(this.props.registrationComps, c => c.Key === comp.Key);
    if (found) {
      if (compData.Partner) {
        return (
          <input type="text" value={found.Partner} onChange={e => this.handlePartnerChange(e.target.value, comp.Key)} />
        );
      } else if (compData.Role) {
        return (
          <select value={found.Role} onChange={e => this.handleRoleChange(e.target.value, comp.Key)}>
            <option value=""></option>
            <option value="Lead">Lead</option>
            <option value="Follow">Follow</option>
          </select>
        );
      }
    }
    return null;
  };

  render() {
    return (
      <div className="confirmation-container">
        <div className="confirmation-inner flex-col flex-align-center">
          <div className="close-popup" onClick={this.props.toggleAddComps}>
          x
          </div>
          <h1>Confirm Purchase</h1>
          <div className="flex-col flex-align-start full-width">
            <this.CompsList />
          </div>

          <button
            className="confirm-btn btn btn-success"
            onClick={() => this.props.toggleAddComps()}
          >
            Done
          </button>
        </div>
      </div>

    );
  }
}

CompsPurchase.propTypes = {
  confirmPurchase: PropTypes.func,
  closePopup: PropTypes.func,
  purchaseAmount: PropTypes.number,
};

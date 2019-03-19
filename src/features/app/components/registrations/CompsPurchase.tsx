import * as React from 'react';
import * as _ from 'lodash';
import * as api from '../../../data/api';
import { IMoneyLogEntry, IComps } from '../../../data/interfaces';

class NewComp implements IComps {
  constructor(key, name, partner, role) {
    this.key = key;
    this.name = name;
    this.partner = partner;
    this.role = role;
  }

  public key: string;
  public name: string;
  public partner: string;
  public role: string;
}

interface CompsPurchaseProps {
  pendingMoneyLog: IMoneyLogEntry,
  registrationComps: IComps[],
  updatePendingMoneyLog: (pendingMoneyLog: IMoneyLogEntry[], purchaseAmount: number ) => void,
  id: number,
  allComps: IComps[],
  toggleAddComps: () => void,
}

interface CompsPurchaseState {
  pendingMoneyLogDetails: IMoneyLogEntry[]
}

export class CompsPurchase extends React.Component<CompsPurchaseProps, CompsPurchaseState> {
  constructor(props) {
    super(props);

    this.state = {
      pendingMoneyLogDetails: [],
    };
  }

  // Handle whether nor not a comp is selected for purchase
  compSelectionChange = (e, comp: IComps) => {
    const isCompeting = e.target.checked;
    let pendingMoneyLogDetails = [];
    let purchaseAmount = this.props.pendingMoneyLog.amount;
    
    const newComp = new NewComp(comp.key, comp.name, '', '');
    let comps;
    if (isCompeting) {
      comps = this.props.registrationComps.concat(newComp);
      purchaseAmount = this.props.pendingMoneyLog.amount + comp.price;
      
      // Handle the money log details. If it's not in the money log we need to add it
      pendingMoneyLogDetails = this.props.pendingMoneyLog.details.concat([{
        item: `Added Comp - ${comp.name}`,
        price: comp.price,
        quantity: 1
      }]);
    } else {
      comps = this.props.registrationComps.filter(c => c.key !== newComp.key);

      // if this comp was pending to go in then we need to remove it from pending, otherwise itw as already paid
      // for and the money log needs to be modified
      const foundInMoneyLog = _.some(this.props.pendingMoneyLog.details, d => d.item === `Added Comp - ${comp.name}`);

      if (foundInMoneyLog) {
        pendingMoneyLogDetails = this.props.pendingMoneyLog.details.filter(d => d.item !== `Added Comp - ${comp.name}`);
      } else {
        pendingMoneyLogDetails = this.props.pendingMoneyLog.details.concat([{
          item: `Removed Comp - ${comp.name}`,
          price: -(comp.price),
          quantity: 1
        }]);
      }

      purchaseAmount = this.props.pendingMoneyLog.amount - comp.price; // reduce the price from the pending purchases
    }

    this.props.updatePendingMoneyLog(pendingMoneyLogDetails, purchaseAmount);
    api.updateRegistration(this.props.id, { AmountOwed: purchaseAmount, HasPaid: purchaseAmount <= 0 });

    api.updateRegistrationComps(this.props.id, comps);
  }

  handlePartnerChange = (partner: string, key: string) => {
    const updatedComps = this.props.registrationComps.map(comp => comp.key === key ? { ...comp, partner } : comp);
    api.updateRegistrationComps(this.props.id, updatedComps);
  }

  handleRoleChange = (role: string, key: string) => {
    const updatedComps = this.props.registrationComps.map(comp => comp.key === key ? { ...comp, role } : comp);
    api.updateRegistrationComps(this.props.id, updatedComps);
  }

  confirmPurchase = (updatedComps, purchaseAmount) => {
    this.props.toggleAddComps();
  }

  findCompPrice = comp => _.find(this.props.allComps, c => c.key === comp).price;

  CompsList = () => this.props.allComps.map((comp, index) => {
    const isSelected = _.some(this.props.registrationComps, rc => rc.key === comp.key);

    return (
      <div key={index} className="info-container">
        <div className="comp-info flex-align-center flex-row flex-justify-space-between">
          <div className="flex-row">
            <input type="checkbox" checked={isSelected} onChange={e => this.compSelectionChange(e, comp)} />
            <span>{comp.name}(${comp.price}): </span>
          </div>
          <div className="partner-role-container">
            <this.PartnerOrRole comp={comp} />
          </div>
        </div>
      </div>
    );
  });

  PartnerOrRole = (props: { comp: IComps }) => {
    const { comp } = props;
    const compData = _.find(this.props.allComps, c => c.key === comp.key);
    const found = _.find(this.props.registrationComps, c => c.key === comp.key);
    if (found) {
      if (compData.partner) {
        return (
          <input type="text" value={found.partner} onChange={e => this.handlePartnerChange(e.target.value, comp.key)} />
        );
      } else if (compData.role) {
        return (
          <select value={found.role} onChange={e => this.handleRoleChange(e.target.value, comp.key)}>
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
            { this.CompsList() }
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

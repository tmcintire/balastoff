import * as React from 'react';
import { FunctionComponent, useState, useEffect } from 'react';
import * as _ from 'lodash';
import * as api from '../../../data/api';
import { IMoneyLogEntry, IComps, IStore } from '../../../data/interfaces';
import { CompsList } from './CompsList';

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


export const CompsPurchase: FunctionComponent<CompsPurchaseProps> = (props: CompsPurchaseProps) => { 
  const { pendingMoneyLog, registrationComps, updatePendingMoneyLog, id, allComps, toggleAddComps } = props;

  const [pendingMoneyLogDetails, setPendingMoneyLogDetails] = useState<IMoneyLogEntry[]>([]);

  // Handle whether nor not a comp is selected for purchase
  const compSelectionChange = (e, comp: IComps) => {
    const isCompeting = e.target.checked;
    let pendingMoneyLogDetails = [];
    let purchaseAmount = pendingMoneyLog.amount;
    
    const newComp = new NewComp(comp.key, comp.name, '', '');
    let comps;
    if (isCompeting) {
      comps = registrationComps.concat(newComp);
      purchaseAmount = pendingMoneyLog.amount + comp.price;
      
      // Handle the money log details. If it's not in the money log we need to add it
      pendingMoneyLogDetails = pendingMoneyLog.details.concat([{
        item: `Added Comp - ${comp.name}`,
        price: comp.price,
        quantity: 1
      }]);
    } else {
      comps = registrationComps.filter(c => c.key !== newComp.key);

      // if this comp was pending to go in then we need to remove it from pending, otherwise itw as already paid
      // for and the money log needs to be modified
      const foundInMoneyLog = _.some(pendingMoneyLog.details, d => d.item === `Added Comp - ${comp.name}`);

      if (foundInMoneyLog) {
        pendingMoneyLogDetails = pendingMoneyLog.details.filter(d => d.item !== `Added Comp - ${comp.name}`);
      } else {
        pendingMoneyLogDetails = pendingMoneyLog.details.concat([{
          item: `Removed Comp - ${comp.name}`,
          price: -(comp.price),
          quantity: 1
        }]);
      }

      purchaseAmount = pendingMoneyLog.amount - comp.price; // reduce the price from the pending purchases
    }

    updatePendingMoneyLog(pendingMoneyLogDetails, purchaseAmount);
    api.updateRegistration(id, { AmountOwed: purchaseAmount, HasPaid: purchaseAmount <= 0 });

    api.updateRegistrationComps(id, comps);
  }

  const handlePartnerChange = (partner: string, key: string) => {
    const updatedComps = registrationComps.map(comp => comp.key === key ? { ...comp, partner } : comp);
    api.updateRegistrationComps(id, updatedComps);
  }

  const handleRoleChange = (role: string, key: string) => {
    const updatedComps = registrationComps.map(comp => comp.key === key ? { ...comp, role } : comp);
    api.updateRegistrationComps(id, updatedComps);
  }

  const confirmPurchase = (updatedComps, purchaseAmount) => {
    toggleAddComps();
  }

  const findCompPrice = comp => _.find(allComps, c => c.key === comp).price;

  return (
    <div className="confirmation-container">
      <div className="confirmation-inner flex-col flex-align-center">
        <div className="close-popup" onClick={toggleAddComps}>
        x
        </div>
        <h1>Confirm Purchase</h1>
        <div className="flex-col flex-align-start full-width">
          <CompsList 
            allComps={allComps}
            registrationComps={registrationComps}
            compSelectionChange={compSelectionChange}
            handlePartnerChange={handlePartnerChange}
            handleRoleChange={handleRoleChange}
          />
        </div>

        <button
          className="confirm-btn btn btn-success"
          onClick={() => toggleAddComps()}
        >
          Done
        </button>
      </div>
    </div>

  );
}

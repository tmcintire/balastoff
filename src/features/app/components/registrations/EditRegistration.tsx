import * as React from 'react';
import { FunctionComponent, useState, useEffect } from 'react';
import * as _ from 'lodash';
import { Link, RouteInfo } from 'react-router';
import * as api from '../../../data/api';

import { Comps } from './Comps';
import { MissionGear } from './MissionGear';
import { Level } from './Level';
import { Comments } from './Comments';
import { Payment } from './Payment';
import { EditMissionGearIssues } from './EditMissionGearIssues';
import { CompsPurchase } from './CompsPurchase';
import { IRegistration, ILevels, IAdminMissionPasses, IMoneyLogEntry, IComps, IMissionGearIssue, IStore, MoneyLogEntryType } from '../../../data/interfaces';

const Loading = require('react-loading-animation');

interface EditRegistrationProps {
  registrations: IRegistration[],
  tracks: ILevels,
  passes: IAdminMissionPasses[],
  params: RouteInfo
  allComps: IComps[],
  issues: IMissionGearIssue[]
}

interface EditRegistrationState {
  pendingMoneyLog: IMoneyLogEntry,
  registrationComps: IComps[],
  registration: IRegistration,
  showSaved: boolean,
  showAddComps: boolean,
  purchaseAmount: number,
  error: string,
  partner: string,
  comps: IComps[],
  moneyLogEntryType: MoneyLogEntryType
}

export const EditRegistration: FunctionComponent<EditRegistrationProps> = (props: EditRegistrationProps) => { 
  const { registrations, tracks, passes, params, allComps, issues } = props;

  const [pendingMoneyLog, setPendingMoneyLog] = useState<IMoneyLogEntry>(null);
  const [registration, setRegistration] = useState<IRegistration>(null);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showAddComps, setShowAddComps] = useState<boolean>(false);
  const [showSaved, setShowSaved] = useState<boolean>(false);
  const [moneyLogEntryType, setMoneyLogEntryType] = useState<MoneyLogEntryType>(MoneyLogEntryType.Cash);

  // Effect to setup api handling
  useEffect(() => {
    const handleRegistrationUpdate = (registration: IRegistration) => {
      setRegistration(registration);
    }

    api.subscribeToRegistration(params.id, handleRegistrationUpdate);
  }, []);

  // Effect for initializing the first time the registration comes back, needed to setup the initial money log if there
  // is money owed
  useEffect(() => {
    if (registration && !initialized) {
      let updatedMoneyLog: IMoneyLogEntry = {
        bookingId: registration.BookingID,
        amount: 0,
        details: [],
      }
      
      // if the registrant owes money, then we need to add details
      if (registration.AmountOwed !== 0) {
        updatedMoneyLog.amount = registration.AmountOwed;
        updatedMoneyLog.details.push({
          item: 'Original Amount Owed',
          price: registration.AmountOwed,
          quantity: 1,
        });
      }

      setPendingMoneyLog(updatedMoneyLog);
      setInitialized(true);
    }
  }, [registration]);

  const toggleCheckedIn = (e) => {
    if (registration.AmountOwed !== 0) {
      setError('Registration must be paid before checking in' );
      return;
    }

    saved();
    api.updateRegistration(params.id, { CheckedIn: e.target.checked });

    window.location.href = '/#';
  }

  const changePaidCheckBox = (e) => {
    const tempOwed = registration.AmountOwed;
    let confirm;
    if (tempOwed > 0) {
      confirm = window.confirm(`Confirm payment of $${tempOwed} for ${registration.FirstName} ${registration.LastName}`);
    } else {
      confirm = window.confirm(`Confirm refund of $${tempOwed} to ${registration.FirstName} ${registration.LastName}`);
    }

    if (confirm === true) {
      const checked = e.target.checked;
      const owed = e.target.checked ? 0 : tempOwed;

      const object = {
        HasPaid: checked,
        AmountOwed: owed,
      };

      saved();
      api.updateRegistration(params.id, object);
      api.updateMoneyLog({...pendingMoneyLog, type: moneyLogEntryType});
      setPendingMoneyLog({
        amount: 0,
        details: [],
        bookingId: null,
        type: moneyLogEntryType
      });
      setMoneyLogEntryType(MoneyLogEntryType.Cash);
    }
  }

  const backToRegistrations = () => {
    window.location.href = '/';
  }

  const updatePendingMoneyLog = (details, amount) => {
    setPendingMoneyLog({
      bookingId: registration.BookingID,
      amount,
      details
    });
  }

  const saved = () => {
    setShowSaved(true);
    setTimeout(() => {
      setShowSaved(false);
    }, 2000);
  }

  const renderSaved = () => (showSaved ? <h4 className="saved-message">Saved</h4> : null);
  const renderError = error !== '' ? error : '';

  const renderRegistration = () => {
    if (!registration) {
      return (
        <Loading />
      );
    }
    return (
      <div>
        {renderSaved()}
        <Link className="back" to={'/'}><i className="fa fa-arrow-left" aria-hidden="true" />Back to Registrations</Link>
        <h1 className="text-center">{registration.BookingID} - {registration.FirstName} {registration.LastName}</h1>
        <div className="flex-row option flex-justify-content-center">
          <span>Check In!</span>
          <input className="no-outline" type="checkbox" checked={registration.CheckedIn} onChange={e => toggleCheckedIn(e)} />
        </div>

        <p className="error-text">{renderError}</p>

        <hr />
        <div className="flex-row flex-wrap flex-justify-space-between">
          <Level
            level={registration.Level}
            shuffleShops={registration.ShuffleShops}
            hasLevelCheck={registration.HasLevelCheck}
          />
          <Comps
            comps={registration.Comps}
            toggleAddComps={() => setShowAddComps(!showAddComps)}
          />
          <Payment
            amountOwed={registration.AmountOwed}
            fullyPaid={registration.HasPaid}
            togglePaid={changePaidCheckBox}
            setType={(type: MoneyLogEntryType) => setMoneyLogEntryType(type)}
            type={moneyLogEntryType}
          />
        </div>

        <hr />
        <div className="flex-row flex-wrap flex-justify-space-between">
          <MissionGear
            issues={issues}
            saved={saved}
            id={params.id}
            registration={registration}
          />
          <EditMissionGearIssues
            id={params.id}
            issues={issues}
            saved={saved}
          />
          <Comments
            saved={saved}
            id={params.id}
            registration={registration}
          />
        </div>
        {
        showAddComps &&
          <CompsPurchase
            toggleAddComps={() => setShowAddComps(!showAddComps)}
            allComps={allComps}
            id={params.id}        
            registrationComps={registration.Comps || []}
            pendingMoneyLog={pendingMoneyLog}
            updatePendingMoneyLog={updatePendingMoneyLog}
          />
        }
      </div>
    );
  };


  return (
    <div className="container">
      {renderRegistration()}
    </div>
  );
}

import * as React from 'react';
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
import { IRegistration, ILevels, IAdminMissionPasses, IMoneyLogEntry, IComps } from '../../../data/interfaces';

const Loading = require('react-loading-animation');

interface EditRegistrationProps {
  registrations: IRegistration[],
  tracks: ILevels,
  passes: IAdminMissionPasses[],
  params: RouteInfo
  allComps: IComps[]
}

interface EditRegistrationState {
  pendingMoneyLog: IMoneyLogEntry,
  moneyLogInitialized: boolean,
  registrationComps: IComps[],
  registration: IRegistration,
  loading: boolean,
  showSaved: boolean,
  showAddComps: boolean,
  purchaseAmount: number,
  error: string,
  partner: string,
  comps: IComps[],
}

export class EditRegistration extends React.Component<EditRegistrationProps, EditRegistrationState> {
  static getDerivedStateFromProps(nextProps: EditRegistrationProps, prevState: EditRegistrationState) {
    if (nextProps.registrations && nextProps.tracks) {
      const registration = nextProps.registrations.filter(reg =>
        reg.BookingID === parseInt(nextProps.params.id, 10))[0];

      let pendingMoneyLog = _.cloneDeep(prevState.pendingMoneyLog);
      if (registration.AmountOwed !== 0 && !prevState.moneyLogInitialized) {
        pendingMoneyLog = {
          bookingId: registration.BookingID,
          amount: registration.AmountOwed,
          details: [
            {
              item: 'Original Amount Owed',
              price: registration.AmountOwed,
              quantity: 1,
            },
          ],
        };
      }

      return {
        registration,
        registrationComps: registration.Comps ? registration.Comps : [],
        loading: false,
        pendingMoneyLog,
        moneyLogInitialized: true,
      };
    }

    return null;
  }

  constructor(props) {
    super(props);
    
    this.state = {
      registrationComps: [],
      registration: null,
      loading: true,
      showSaved: false,
      showAddComps: false,
      purchaseAmount: 0,
      pendingMoneyLog: {
        bookingId: null,
        amount: 0,
        details: [],
      },
      moneyLogInitialized: false,
      error: '',
      partner: '',
      comps: []
    };
  }

  toggleCheckedIn = (e) => {
    if (this.state.registration.AmountOwed !== 0) {
      this.setState({ error: 'Registration must be paid before checking in' });
      return;
    }

    const object = {
      CheckedIn: e.target.checked,
    };

    this.saved();
    api.updateRegistration(this.props.params.id, object);

    window.location.href = '/#';
  }

  changePaidCheckBox = (e) => {
    const tempOwed = this.state.registration.AmountOwed;
    let confirm;
    if (tempOwed > 0) {
      confirm = window.confirm(`Confirm payment of $${tempOwed} for ${this.state.registration.FirstName} ${this.state.registration.LastName}`);
    } else {
      confirm = window.confirm(`Confirm refund of $${tempOwed} to ${this.state.registration.FirstName} ${this.state.registration.LastName}`);
    }

    if (confirm === true) {
      const checked = e.target.checked;
      const owed = e.target.checked ? 0 : tempOwed;

      const object = {
        HasPaid: checked,
        AmountOwed: owed,
      };

      this.saved();
      api.updateRegistration(this.props.params.id, object);
      api.updateMoneyLog(this.state.pendingMoneyLog);
      this.setState({
        pendingMoneyLog: {
          amount: 0,
          details: [],
          bookingId: null
        },
      });
    }
  }

  backToRegistrations = () => {
    window.location.href = '/';
  }

  updatePendingMoneyLog = (details, amount) => {
    this.setState({
      pendingMoneyLog: {
        bookingId: this.state.registration.BookingID,
        amount,
        details,
      },
    });
  }

  toggleResolved = (bookingId: string, issueId: string) => {
    const registration = _.find(this.props.registrations, r => r && r.BookingID === parseInt(bookingId, 10));

    if (registration) {
      let updatedReg = {
        ...registration,
        MissionGearIssues: registration.MissionGearIssues.map(i => {
          return i.IssueId === issueId ? {...i, Resolved: !i.Resolved } : i;
        })
      }
  
      api.updateRegistration(parseInt(bookingId, 10), updatedReg);
      this.saved();
    }
  }

  saved = () => {
    this.setState({
      showSaved: true,
    });
    setTimeout(() => {
      this.setState({
        showSaved: false,
      });
    }, 2000);
  }

  toggleAddComps = () => this.setState({ showAddComps: !this.state.showAddComps });

  render() {
    const { registration, partner, comps } = this.state;
    const renderSaved = () => (this.state.showSaved ? <h4 className="saved-message">Saved</h4> : null);
    const renderError = this.state.error !== '' ? this.state.error : '';

    const renderRegistration = () => {
      if (this.state.loading) {
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
            <input className="no-outline" type="checkbox" checked={registration.CheckedIn} onChange={e => this.toggleCheckedIn(e)} />
          </div>

          <p className="error-text">{renderError}</p>

          <hr />
          <div className="flex-row flex-wrap flex-justify-space-between">
            <Level
              level={registration.Level}
              hasLevelCheck={registration.HasLevelCheck}
            />
            <Comps
              comps={registration['Comps']}
              toggleAddComps={this.toggleAddComps}
            />
            <Payment
              amountOwed={registration.AmountOwed}
              fullyPaid={registration.HasPaid}
              togglePaid={this.changePaidCheckBox}
            />
          </div>

          <hr />
          <div className="flex-row flex-wrap flex-justify-space-between">
            <MissionGear
              saved={this.saved}
              id={this.props.params.id}
              registration={registration}
            />
            <EditMissionGearIssues
              id={this.props.params.id}
              issues={registration.MissionGearIssues}
              toggleResolved={this.toggleResolved}
            />
            <Comments
              saved={this.saved}
              id={this.props.params.id}
              registration={registration}
            />
          </div>
          {
          this.state.showAddComps &&
            <CompsPurchase
              toggleAddComps={this.toggleAddComps}
              allComps={this.props.allComps}
              id={this.props.params.id}        
              registrationComps={this.state.registrationComps}
              pendingMoneyLog={this.state.pendingMoneyLog}
              updatePendingMoneyLog={this.updatePendingMoneyLog}
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
}

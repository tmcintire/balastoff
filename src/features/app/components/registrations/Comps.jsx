import React from 'react';
import * as api from '../../../data/api';
import _ from 'lodash';

export class Comps extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasPaid: props.registration.HasPaid,
      originalAmountOwed: props.registration['Amount Owed'],
    };
  }

  handleValueChange = (e, comp, role, amount) => {
    let amountOwed = 0;
    let object = {};
    if (role === 'AdNovLeadFollow') {
      object = {
        [role]: e.target.value,
      };
    } else {
      const compDecision = e.target.value;
      const owed = parseInt(this.props.registration['Amount Owed'], 10);
      if (compDecision === 'Yes') {
        amountOwed = owed + amount;
      } else if (compDecision === 'No') {
        amountOwed = owed - amount;
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
            <select className="form-control ad-nov-role" id="type" defaultValue={registration.AdNovLeadFollow} onChange={e => this.handleValueChange(e, 'AdNov', 'AdNovLeadFollow')}>
              <option value="" />
              <option value="Lead">Lead</option>
              <option value="Follow">Follow</option>
            </select>
          </div>
        );
      }
    };

    const renderComps = () => (
      <div className="comp-container">
        <h3><strong><u>Comps</u></strong></h3>
        <div
          className={`${registration.Level === 'Apollo' ||
            registration.Level === 'Skylab' ||
            registration.Level === 'SpaceX' ? 'hidden' : ''} info-container flex-col`}
        >
          <div className="comp-info flex-row">
            <span className="full-width">AdNov Comp ($5): </span>
            <select className="comp-select form-control" id="type" defaultValue={registration.AdNov} onChange={e => this.handleValueChange(e, 'AdNov', null, 5)}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          {adNovRoleSelect()}
        </div>
        <div className="info-container flex-col">
          <div className="comp-info flex-row">
            <span className="full-width">Amateur Couples ($20): </span>
            <select className="comp-select form-control" id="type" defaultValue={registration['Amateur Couples']} onChange={e => this.handleValueChange(e, 'Amateur Couples', null, 20)}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          {amCouplesPartner()}
        </div>
        <div className="info-container flex-col">
          <div className="comp-info flex-row">
            <span className="full-width">Three Stage Open ($40): </span>
            <select className="comp-select form-control" id="type" defaultValue={registration.Open} onChange={e => this.handleValueChange(e, 'Open', null, 40)}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          {openPartner()}
        </div>
      </div>
    );
    return (
      <div>
        {renderComps()}
      </div>
    );
  }
}

Comps.propTypes = {
  registration: React.PropTypes.array,
  partner: React.PropTypes.string,
};

import React from 'react';
import * as api from '../../../data/api';
import _ from 'lodash';

export class Comps extends React.Component {
  handleValueChange = (e, comp, role) => {
    let object= {};
    if (role === 'AdNovLeadFollow') {
      object = {
        [role]: e.target.value,
      };
    } else {
      object = {
        [comp]: e.target.value,
      };
    }

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
        <div className="info-container flex-col">
          <div className="comp-info flex-row">
            <span className="full-width">AdNov Comp: </span>
            <select className="form-control" id="type" defaultValue={registration.AdNov} onChange={e => this.handleValueChange(e, 'AdNov')}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          {adNovRoleSelect()}
        </div>
        <div className="info-container flex-col">
          <div className="comp-info flex-row">
            <span className="full-width">Amateur Couples: </span>
            <select className="form-control" id="type" defaultValue={registration['Amateur Couples']} onChange={e => this.handleValueChange(e, 'Amateur Couples')}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          {amCouplesPartner()}
        </div>
        <div className="info-container flex-col">
          <div className="comp-info flex-row">
            <span className="full-width">Three Stage Open: </span>
            <select className="form-control" id="type" defaultValue={registration.Open} onChange={e => this.handleValueChange(e, 'Open')}>
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

import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import * as api from '../../../data/api';

const Loading = require('react-loading-animation');

export class EditRegistration extends React.Component {
  constructor() {
    super();
    this.state = {
      registration: {},
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.registrations) {
      const registration = nextProps.registrations.filter(reg =>
        reg.BookingID === nextProps.params.id)[0];
      this.setState({
        registration,
      });
    }
  }

  updateMerchCheckbox(e, type) {
    const object = {
      [type]: e.target.checked,
    };
    api.updateRegistration(this.props.params.id, object)
  }

  saveForm(e) {
    e.preventDefault();
    let hasComments;

    if (!_.isEmpty(this.comments.value)) {
      hasComments = true;
    } else {
      hasComments = false;
    }
    const object = {
      Comments: this.comments.value,
      HasComments: hasComments,
    };
    api.updateRegistration(this.props.params.id, object);
  }

  backToRegistrations = () => {
    window.location('/');
  }
  render() {
    const {registration} = this.state;
    const renderShirts = () => {
      if (registration.TShirts) {
        return (
          <tr>
            <td>{registration.TShirts}</td>
            <td>{registration.Size}</td>
            <td>
              <input
                checked={registration.Shirt1}
                type="checkbox"
                onChange={e => this.updateMerchCheckbox(e, 'Shirt1')}
              />
            </td>
          </tr>
        );
      }
    };
    const renderAdditionalShirts = () => {
      if (registration.AdditionalTShirts) {
        return (
          <tr>
            <td>{registration.AdditionalTShirts}</td>
            <td>{registration.Size2}</td>
            <td>
              <input
                checked={registration.Shirt2}
                type="checkbox"
                onChange={e => this.updateMerchCheckbox(e, 'Shirt2')}
              />
            </td>
          </tr>
        );
      }
    };
    const renderPatches = () => {
      if (registration['Limited Edition Patch']) {
        return (
          <tr>
            <td>{registration['Limited Edition Patch']}</td>
            <td>N/A</td>
            <td>
              <input
                checked={registration.Patch}
                type="checkbox"
                onChange={e => this.updateMerchCheckbox(e, 'Patch')}
              />
            </td>
          </tr>
        );
      }
    };

    const renderMissionGear = () => {
      if (!registration.TShirts && !registration.AdditionalTShirts && !registration['Limited Edition Patch']) {
        return (
          <h4>No mission gear ordered</h4>
        );
      }
      return (
        <div className="merch-container">
          <table className="table custom-table">
            <thead>
              <th>T-Shirt</th>
              <th>Size</th>
              <th>Picked Up</th>
            </thead>
            <tbody>
              {renderShirts()}
              {renderAdditionalShirts()}
              {renderPatches()}
            </tbody>
          </table>
        </div>
      );
    };
    const renderRegistration = () => {
      if (this.props.loading) {
        return (
          <Loading />
        );
      }
      return (
        <div>
          <Link to={'/'}><button className="btn btn-primary custom-buttons">Back to Registrations</button></Link>
          <h1 className="text-center">View Registration</h1>
          <h3 className="text-center">{registration['First Name']} {registration['Last Name']}</h3>

          <hr />
          <h3><strong>Comps</strong></h3>
          <p>AdNov Comp: {registration.AdNov}</p>
          <p>Amateur Couples: {registration['Amateur Couples']}</p>
          <p>Three State Open: {registration.Open}</p>

          <hr />
          <h3>Mission Gear</h3>
          {renderMissionGear()}

          <button onClick={e => this.saveForm(e)} className="btn btn-success">Save</button>
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

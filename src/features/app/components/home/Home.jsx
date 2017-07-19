import React from 'react';
import _ from 'lodash';
import * as helpers from '../../../data/helpers';

import { RegistrationBox } from './RegistrationBox';

export class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filteredRegistrations: props.registrations,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.registrations) {
      this.setState({
        filteredRegistrations: nextProps.registrations,
      });
    }
  }

  handleValueChange = (e) => {
    e.preventDefault();
    const target = e.target.value;
    const { registrations } = this.props;

    const filteredRegistrations = registrations.filter(reg => (
      _.includes(reg['First Name'].toLowerCase(), target.toLowerCase()) ||
      _.includes(reg['Last Name'].toLowerCase(), target.toLowerCase()) ||
      _.includes(reg.Level.toLowerCase(), target.toLowerCase())
    ));

    this.setState({
      filteredRegistrations,
    });
  }

  toggleUnpaid(e) {
    const checked = e.target.checked;
    const { registrations } = this.props;
    let filteredRegistrations = [];

    if (checked) {
      filteredRegistrations = registrations.filter(reg => reg['Amount Owed'] > 0);
    } else {
      filteredRegistrations = registrations;
    }
    this.setState({
      filteredRegistrations,
    });
  }

  toggleNotChecked(e) {
    const checked = e.target.checked;
    const { registrations } = this.props;
    let filteredRegistrations = [];

    if (checked) {
      filteredRegistrations = registrations.filter(reg => reg.CheckedIn === false);
    } else {
      filteredRegistrations = registrations;
    }
    this.setState({
      filteredRegistrations,
    });
  }

  render() {
    const { registrations, loading } = this.props;
    const renderRegistrations = () => {
      if (loading === false && this.state.filteredRegistrations !== undefined) {
        return this.state.filteredRegistrations.map((registration, index) =>
          (
            <RegistrationBox key={index} registration={registration} />
          )
        );
      }
      return true;
    };
    return (
      <div className="container">
        <h1>Registrations</h1>
        <div>
          <label>Show only unpaid</label>
          <input type="checkbox" onChange={e => this.toggleUnpaid(e)} />
          <label>Show not checked in</label>
          <input type="checkbox" onChange={e => this.toggleNotChecked(e)} />
        </div>
        <input type="text" onChange={this.handleValueChange} />
        <table className="table">
          <thead>
            <th>View</th>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Track</th>
            <th>Level Check</th>
            <th>Amount Owed</th>
            <th>Gear</th>
            <th>Fully Paid</th>
            <th>Checked In</th>
          </thead>
          <tbody>
            {renderRegistrations()}
          </tbody>
        </table>
      </div>
    );
  }
}

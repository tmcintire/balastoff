import React from 'react';
import _ from 'lodash';
import { RegistrationBox } from './RegistrationBox';
import * as helpers from '../../../data/helpers';
import * as api from '../../../data/api';

export class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filteredRegistrations: props.registrations,
      filter: '',
      filterText: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const registrations = this.state.filterText !== '' ? this.state.filteredRegistrations : nextProps.registrations;
    if (registrations) {
      this.setState({
        filteredRegistrations: registrations,
      });
    }
  }

  filterRegistrations = (e, filter) => {
    if (filter !== this.state.filter) {
      const sortedRegistrations = helpers.sortRegistrations(this.state.filteredRegistrations, filter);
      this.setState({
        filteredRegistrations: sortedRegistrations,
        filter,
      });
    }
  }

  handleValueChange = (e) => {
    e.preventDefault();
    const target = e.target.value;
    const { registrations } = this.props;

    const filteredRegistrations = registrations.filter(reg => {
      if (reg) {
        return (
          _.includes(reg['First Name'].toLowerCase(), target.toLowerCase()) ||
          _.includes(reg['Last Name'].toLowerCase(), target.toLowerCase()) ||
          _.includes(reg.Level.level.toLowerCase(), target.toLowerCase()) ||
          _.includes(reg.Level.name.toLowerCase(), target.toLowerCase()) ||
          _.isEqual(reg.BookingID, target)
        );
      }
    });

    this.setState({
      filteredRegistrations,
      filterText: target,
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

  toggleGear(e) {
    const checked = e.target.checked;
    const { registrations } = this.props;
    let filteredRegistrations = [];

    if (checked) {
      filteredRegistrations = registrations.filter(reg => reg.HasGear === 'Yes');
    } else {
      filteredRegistrations = registrations;
    }
    this.setState({
      filteredRegistrations,
    });
  }

  updateTotal = (amount) => {
    const total = parseInt(amount, 10) + this.props.totalCollected;
    api.updateTotalCollected(total);
  }

  changePaidCheckBox = (data) => {
    const owed = data.checked ? '0.00' : data.originalAmountOwed;
    const amountToUpdate = data.checked ?
      parseInt(data.originalAmountOwed, 10) : -parseInt(data.originalAmountOwed, 10);
    this.updateTotal(amountToUpdate);
    const object = {
      HasPaid: data.checked,
      'Amount Owed': owed,
    };
    api.updateRegistration(data.bookingID, object);
  }

  render() {
    const { loading } = this.props;
    const renderRegistrations = () => {
      if (loading === false && this.state.filteredRegistrations !== undefined) {
        return this.state.filteredRegistrations.map((registration, index) => {
          if (registration) {
            return (
              <RegistrationBox
                key={index}
                updateTotal={this.updateTotal}
                registration={registration}
                changePaidCheckBox={this.changePaidCheckBox}
              />
            );
          }
        });
      }
      return true;
    };
    return (
      <div className="container">
        <div className="flex-row options-container">
          <div className="flex-row option">
            <span>Show only unpaid</span>
            <input className="no-outline" type="checkbox" onChange={e => this.toggleUnpaid(e)} />
          </div>
          <div className="flex-row option">
            <span>Show not checked in</span>
            <input className="no-outline" type="checkbox" onChange={e => this.toggleNotChecked(e)} />
          </div>
          <div className="flex-row option">
            <span>Show only gear</span>
            <input className="no-outline" type="checkbox" onChange={e => this.toggleGear(e)} />
          </div>
        </div>
        <div className="flex-row flex-justify-space-between">
          <div>
            <label htmlFor="search">Search Registrations</label>
            <input className="search search-input" id="search" type="text" onChange={this.handleValueChange} />
          </div>
          <div className="flex-row">
            Total Collected:
            <span className="collected-text">${this.props.totalCollected}</span>
          </div>
        </div>
        <div className="registrations-wrapper flex-col">
          <div className="registrations-header">
            <span className="col-xs-1" onClick={e => this.filterRegistrations(e, 'BookingID')}>ID</span>
            <span className="col-xs-2" onClick={e => this.filterRegistrations(e, 'Last Name')}>Last Name</span>
            <span className="col-xs-2" onClick={e => this.filterRegistrations(e, 'First Name')}>First Name</span>
            <span className="col-xs-2" onClick={e => this.filterRegistrations(e, 'Level')}>Track</span>
            <span className="col-xs-1" onClick={e => this.filterRegistrations(e, 'HasLevelCheck')}>Level Check</span>
            <span className="col-xs-1">Amount Owed</span>
            <span className="col-xs-1">Gear</span>
            <span className="col-xs-1">Fully Paid</span>
            <span className="col-xs-1">Checked In</span>
          </div>
          <div className="registrations-body flex-col">
            {renderRegistrations()}
          </div>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  registrations: React.PropTypes.array,
  loading: React.PropTypes.boolean,
};

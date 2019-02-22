import * as React from 'react';
import * as _ from 'lodash';
import { Link } from 'react-router';
import { Participant } from './Participant';
import { IRegistration } from '../../../data/interfaces';

interface AdminProps {
  registrations: IRegistration[],
  loading: boolean,
}

interface AdminState {
  filteredRegistrations: IRegistration[],
}

export class Admin extends React.Component<AdminProps, AdminState> {
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
      _.includes(reg.FirstName.toLowerCase(), target.toLowerCase()) ||
      _.includes(reg.LastName.toLowerCase(), target.toLowerCase()) ||
      _.includes(reg.Level.toLowerCase(), target.toLowerCase()) ||
      _.isEqual(reg.BookingID, target)));

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
            <Participant key={index} registration={registration} />
          )
        );
      }
      return true;
    };

    return (
      <div className="container">
        <h1 className="text-center">Admin</h1>
        <div className="header-links">
          <Link to="/admin/levelcheck">Level Check</Link>
          <Link to="/admin/levelcheckupdates">Completed Level Checks</Link>
          <Link to="/admin/missedlevelcheck">Missed Level Checks</Link>
          <Link to="/admin/missiongearissues">Mission Gear Issues</Link>
          <Link to="/admin/comments">Comments</Link>
          <Link to="/admin/levelcheckdashboard">Level Check Dashboard</Link>
        </div>
        <label htmlFor="name">Search</label>
        <input className="search-input" type="text" onChange={this.handleValueChange} />
        <div className="admin-registrations flex-col">
          <div className="admin-registrations-header">
            <span className="col-xs-2">Booking ID</span>
            <span className="col-xs-3">First Name</span>
            <span className="col-xs-3">Last Name</span>
            <span className="col-xs-2">Level</span>
            <span className="col-xs-2">Has Level Check</span>
          </div>
          {renderRegistrations()}
        </div>
      </div>
    );
  }
}

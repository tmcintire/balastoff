import * as React from 'react';
import * as _ from 'lodash';
import { RegistrationBox } from './RegistrationBox';
import * as helpers from '../../../data/helpers';
import { IRegistration } from '../../../data/interfaces';

interface HomeProps {
  registrations: IRegistration[],
  loading: boolean,
  totalCollected: number,
  tracks: []
}

interface HomeState {
  filteredRegistrations: IRegistration[],
  filter: string,
  filterText: string,
}


export class Home extends React.Component<HomeProps, HomeState> {
  constructor(props) {
    super(props);

    this.state = {
      filteredRegistrations: props.registrations,
      filter: 'LastName',
      filterText: '',
    };
  }

  componentDidMount() {
    window.scrollTo(0, 1);
  }

  componentWillReceiveProps(nextProps) {
    const registrations = this.state.filterText !== '' ? this.state.filteredRegistrations : nextProps.registrations;
    if (registrations) {
      const sortedRegistrations = helpers.sortRegistrations(registrations, this.state.filter);
      this.setState({
        filteredRegistrations: sortedRegistrations,
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
          _.includes(reg.FirstName.toLowerCase(), target.toLowerCase()) ||
          _.includes(reg.LastName.toLowerCase(), target.toLowerCase()) ||
          _.includes(reg.Level.toLowerCase(), target.toLowerCase()) ||
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
      filteredRegistrations = registrations.filter(reg => reg.AmountOwed > 0);
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
      filteredRegistrations = registrations.filter(reg => !reg.CheckedIn);
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
      filteredRegistrations = registrations.filter(reg => reg.HasGear);
    } else {
      filteredRegistrations = registrations;
    }
    this.setState({
      filteredRegistrations,
    });
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
                registration={registration}
                hasLevelCheck={registration.HasLevelCheck}
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
          {
            this.props.totalCollected !== undefined &&
              <div className="flex-row">
                Total Collected:
                <span className="collected-text">${this.props.totalCollected.toFixed(2)}</span>
              </div>
          }
        </div>
        <div className="registrations-wrapper flex-col">
          <div className="registrations-header">
            <span className="col-xs-1" onClick={e => this.filterRegistrations(e, 'BookingID')}>ID</span>
            <span className="col-xs-2" onClick={e => this.filterRegistrations(e, 'LastName')}>Last Name</span>
            <span className="col-xs-2" onClick={e => this.filterRegistrations(e, 'FirstName')}>First Name</span>
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

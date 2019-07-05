import * as React from 'react';
import { FunctionComponent, useState, useEffect } from 'react';
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

export const Home: FunctionComponent<HomeProps> = (props: HomeProps) => {
  const { registrations, loading, totalCollected, tracks } = props;

  const [filteredRegistrations, setFilteredRegistrations] = useState<IRegistration[]>([]);
  const [filter, setFilter] = useState<string>('LastName');
  const [filterText, setFilterText] = useState<string>('');
  const [initialized, setInitialized] = useState<boolean>(false);
  const [unpaidFilter, setUnpaidFilter] = useState<boolean>(false);
  const [gearFilter, setGearFilter] = useState<boolean>(false);
  const [checkedInFilter, setCheckedInFilter] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 1);
  }, []);

  useEffect(() => {
    if (registrations && !initialized) {
      const sortedRegistrations = helpers.sortRegistrations(registrations, filter);
      setFilteredRegistrations(sortedRegistrations);
      setInitialized(true);
    }
  }, [registrations]);

  // Handle the changes of filters
  useEffect(() => {
    console.log('filter changed');
    const filteredReg = registrations.filter((reg => {
      if (unpaidFilter && reg.AmountOwed > 0) {
        
      }
    }));
  }, [unpaidFilter, gearFilter, checkedInFilter]);

  const filterRegistrations = (e, filter) => {
    if (filter !== filter) {
      const sortedRegistrations = helpers.sortRegistrations(filteredRegistrations, filter);
      setFilteredRegistrations(sortedRegistrations);
      setFilter(filter);
    }
  }

  const handleValueChange = (e) => {
    e.preventDefault();
    const target = e.target.value;
    const { registrations } = props;

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

    setFilteredRegistrations(filteredRegistrations);
    setFilterText(target);
  }

  const toggleFilter = (e, type: string) => {
    const checked = e.target.checked;

    let filteredReg = [];

    switch (type) {
      case 'Unpaid':
        filteredReg = filteredRegistrations.filter(reg => checked ? reg.AmountOwed > 0 : reg.AmountOwed === 0);
        break;
      case 'CheckedIn':
        filteredReg = filteredRegistrations.filter(reg => checked ? !reg.CheckedIn : reg.CheckedIn);
        break;
      case 'Gear':
        filteredReg = filteredRegistrations.filter(reg => checked ? reg.HasGear : !reg.HasGear);
        break;
    }

    setFilteredRegistrations(filteredReg);
  }


  const toggleUnpaid = (e) => {
    const checked = e.target.checked;

    let filteredRegistrations = [];

    if (checked) {
      filteredRegistrations = registrations.filter(reg => reg.AmountOwed > 0);
    } else {
      filteredRegistrations = registrations;
    }

    setFilteredRegistrations(filteredRegistrations);
  }

  const toggleNotChecked = (e) => {
    const checked = e.target.checked;
    const { registrations } = props;
    let filteredRegistrations = [];

    if (checked) {
      filteredRegistrations = registrations.filter(reg => !reg.CheckedIn);
    } else {
      filteredRegistrations = registrations;
    }

    setFilteredRegistrations(filteredRegistrations);
  }

  const toggleGear = (e) => {
    const checked = e.target.checked;
    const { registrations } = props;
    let filteredRegistrations = [];

    if (checked) {
      filteredRegistrations = registrations.filter(reg => reg.HasGear);
    } else {
      filteredRegistrations = registrations;
    }

    setFilteredRegistrations(filteredRegistrations);
  }

  const renderRegistrations = () => {
    if (loading === false && filteredRegistrations !== undefined) {
      return filteredRegistrations.map((registration, index) => {
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
          <input className="no-outline" type="checkbox" onChange={(e) => setUnpaidFilter(e.target.checked)} />
        </div>
        <div className="flex-row option">
          <span>Show not checked in</span>
          <input className="no-outline" type="checkbox" onChange={e => setCheckedInFilter(e.target.checked)} />
        </div>
        <div className="flex-row option">
          <span>Show only gear</span>
          <input className="no-outline" type="checkbox" onChange={e => setGearFilter(e.target.checked)} />
        </div>
      </div>
      <div className="flex-row flex-justify-space-between">
        <div>
          <label htmlFor="search">Search Registrations</label>
          <input className="search search-input" id="search" type="text" onChange={handleValueChange} />
        </div>
        {
          totalCollected !== undefined &&
            <div className="flex-row">
              Total Collected:
              <span className="collected-text">${totalCollected.toFixed(2)}</span>
            </div>
        }
      </div>
      <div className="registrations-wrapper flex-col">
        <div className="registrations-header">
          <span className="col-xs-1" onClick={e => filterRegistrations(e, 'BookingID')}>ID</span>
          <span className="col-xs-2" onClick={e => filterRegistrations(e, 'LastName')}>Last Name</span>
          <span className="col-xs-2" onClick={e => filterRegistrations(e, 'FirstName')}>First Name</span>
          <span className="col-xs-2" onClick={e => filterRegistrations(e, 'Level')}>Track</span>
          <span className="col-xs-1" onClick={e => filterRegistrations(e, 'HasLevelCheck')}>Level Check</span>
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

import * as React from 'react';
import { FunctionComponent, useState, useEffect } from 'react';
import * as _ from 'lodash';
import { Link } from 'react-router';
import { LevelCheckInfo } from './LevelCheckInfo';
import { IRegistration } from '../../../data/interfaces';

const Loading = require('react-loading-animation');

interface LevelCheckUpdatesProps {
  registrations: IRegistration[],
  loading: boolean
}

export const LevelCheckUpdates: FunctionComponent<LevelCheckUpdatesProps> = (props: LevelCheckUpdatesProps) => {
  const { registrations, loading } = props;
  const [filter, setFilter] = useState<string[]>(['Gemini']);
  const [title, setTitle] = useState<string>('Complete Gemini Level Checks');
  const [updatedRegistrations, setUpdatedRegistrations] = useState<IRegistration[]>([]);
  const [pendingRegistrations, setPendingRegistrations] = useState<IRegistration[]>([]);

  useEffect(() => {
    getUpdatedRegistrations();
    getPendingRegistrations();
  }, registrations);

  const changeFilter = (filter) => {
    let newFilter = [];
    if (filter === 'Gemini') {
      newFilter = ['Gemini'];
    } else {
      newFilter = ['Apollo', 'Skylab'];
    }

    let title = '';
    if (filter === 'Gemini') {
      title = 'Complete Gemini Level Checks';
    } else {
      title = 'Complete Apollo/Skylab Level Checks';
    }

    setFilter(newFilter);
    setTitle(title);
    getUpdatedRegistrations();
    getPendingRegistrations();
  }

  const getUpdatedRegistrations = () => {
    const newUpdatedRegistrations = _.filter(registrations, r => {
      return r && (r.OriginalLevel === filter[0] || r.OriginalLevel === filter[1]) && r.HasLevelCheck && r.LevelChecked && r.BadgeUpdated && !r.MissedLevelCheck;
    });

    setUpdatedRegistrations(newUpdatedRegistrations);
  }

  const getPendingRegistrations = () => {
    const newPendingRegistrations =  _.filter(registrations, r => {
      return r && (r.OriginalLevel === filter[0] || r.OriginalLevel === filter[1]) && r.HasLevelCheck && r.LevelChecked && !r.BadgeUpdated && !r.MissedLevelCheck;
    });

    setPendingRegistrations(newPendingRegistrations);
  }

  const renderUpdatedRegistrations = () => updatedRegistrations.map((registration, index) =>
    <LevelCheckInfo updated key={index} registration={registration} />
  );
    

  const renderPendingRegistrations = () => pendingRegistrations.map((registration, index) => 
    <LevelCheckInfo updated={false} key={index} registration={registration} />
  );
   

  const renderRegistrations = () => {
    if (loading === false) {
      return (
        <div>
          <h3 className="text-center">Pending Badge Updates</h3>
          <hr />
          {renderPendingRegistrations()}

          <h3 className="text-center">Updated Badges</h3>
          <hr />
          {renderUpdatedRegistrations()}
        </div>
      );
    }
    return (
      <Loading />
    );
  };

  return (
    <div className="container form-container">
        <h1 className="text-center">{title}</h1>
        <div className="header-links">
          <Link to="admin/levelcheck"><button className="btn btn-primary">Back to Level Checks</button></Link>
        </div>
        <div className="level-check-filters">
          <span onClick={() => changeFilter('Gemini')}>Gemini</span>
          <span onClick={() => changeFilter('Apollo')}>Apollo/Skylab</span>
        </div>
        {renderRegistrations()}
      </div>
  );
}

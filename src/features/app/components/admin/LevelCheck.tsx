import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';
import { Link } from 'react-router';
import * as _ from 'lodash';
import { LevelCheckBox } from './LevelCheckBox';
import * as api from '../../../data/api';
import { IRegistration } from '../../../data/interfaces';

const Loading = require('react-loading-animation');

interface LevelCheckProps {
  registrations: IRegistration[],
}

interface LevelCheckState {
  filteredLeads: IRegistration[],
  filteredFollows: IRegistration[],
  geminiFilter: string[],
  apolloSkylabFilter: string[],
  mercuryFilter: string[],
  currentFilter: string[],
  showLeads: boolean,
  title: string,
  loading: boolean,
}

export const LevelCheck: FunctionComponent<LevelCheckProps> = (props) => {
  const { registrations } = props;

  const [filteredLeads, setFilteredLeads] = useState<IRegistration[]>([]);
  const [filteredFollows, setFilteredFollows] = useState<IRegistration[]>([]);
  const [geminiFilter, setGeminiFilter] = useState<string[]>(['Gemini']);
  const [apolloSkylabFilter, setApolloSkylabFilter] = useState<string[]>(['Apollo', 'Skylab']);
  const [mercuryFilter, setMercuryFilter] = useState<string[]>(['Mercury']);
  const [currentFilter, setCurrentFilter] = useState<string[]>(['Gemini']);
  const [showLeads, setShowLeads] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('Gemini');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (registrations) {
      const filteredLeads = registrations.filter(r =>
        r.HasLevelCheck &&
        r.LeadFollow.toLowerCase() === 'lead' &&
        r.LevelChecked === false &&
        r.MissedLevelCheck === false &&
        r.CheckedIn === true &&
        _.includes(currentFilter, r.OriginalLevel));
      const filteredFollows = registrations.filter(r =>
        r.HasLevelCheck &&
        r.LeadFollow.toLowerCase() === 'follow' &&
        r.LevelChecked === false &&
        r.MissedLevelCheck === false &&
        r.CheckedIn === true &&
        _.includes(currentFilter, r.OriginalLevel));

        setFilteredLeads(filteredLeads);
        setFilteredFollows(filteredFollows);
        setLoading(false);
    }
  }, [registrations, currentFilter]);

  const changeFilter = () => {
    const filter = _.includes(currentFilter, 'Gemini') ? apolloSkylabFilter : geminiFilter;

    const filteredLeads = registrations.filter(r => {
      return (
        _.includes(filter, r.OriginalLevel) &&
        r.LeadFollow === 'Lead' &&
        r.HasLevelCheck &&
        r.LevelChecked === false &&
        r.MissedLevelCheck === false &&
        r.CheckedIn === true
      );
    });

    const filteredFollows = registrations.filter(r => {
      return (
        _.includes(filter, r.OriginalLevel) &&
        r.LeadFollow === 'Follow' &&
        r.HasLevelCheck &&
        r.LevelChecked === false &&
        r.MissedLevelCheck === false &&
        r.CheckedIn === true
      );
    });
    
    const title = filter === geminiFilter ? 'Gemini' : 'Apollo/Skylab';
    setFilteredLeads(filteredLeads);
    setFilteredFollows(filteredFollows);
    setCurrentFilter(filter);
    setTitle(title);
  }

  const toggleLeadFollow = () => {
    setShowLeads(!showLeads);
  }

  const acceptAllLevels = () => {
    const level = _.includes(currentFilter, 'Apollo') ? 'Apollo' : 'Gemini';
    const leadFollow = showLeads ? 'leads' : 'follows';
    const confirm = window.confirm(`Place ALL remaining ${showLeads ? 'leads' : 'follows'} into ${level} ?`);

    if (confirm === true) {
      const reallyConfirm = window.confirm('Are you really sure?');

      // panic time, make a backup of the current registrations when anyone hits this button
      api.backupRegistrations(level, leadFollow);

      if (reallyConfirm === true) {
        if (showLeads) {
          _.forEach(filteredLeads, (lead) => {
            api.updateRegistration(lead.BookingID, {
              LevelChecked: true,
              MissedLevelCheck: false,
              Level: level,
            });
          });
        } else {
          _.forEach(filteredFollows, (follow) => {
            api.updateRegistration(follow.BookingID, {
              LevelChecked: true,
              MissedLevelCheck: false,
              Level: level,
            });
          });
        }
      }
    }
  }

  const level = _.includes(currentFilter, 'Apollo') ? 'Apollo' : 'Gemini';
  const leadFollow = showLeads ? 'leads' : 'follows';
  
  const renderLeads = () => {
    if (Object.keys(loading === false && filteredLeads).length > 0) {
      return filteredLeads.map((registration) => {
        if (registration) {
          return (
            <LevelCheckBox key={registration.BookingID} registration={registration} />
          );
        }
      });
    }
    return (
      <h3>No Leads to show</h3>
    );
  };
  const renderFollows = () => {
    if (Object.keys(loading === false && filteredFollows).length > 0) {
      return filteredFollows.map((registration) => {
        if (registration) {
          return (
            <LevelCheckBox key={registration.BookingID} registration={registration} />
          );
        }
      });
    }
    return (
      <h3>No Follows to show</h3>
    );
  };
  return (
    <div className="container form-container">
      <div className="header-links flex-row">
        <Link to="/admin"><button className="btn btn-primary">Back</button></Link>
        <Link to="/admin/levelcheckupdates"><button className="btn btn-primary">Completed Level Checks</button></Link>
      </div>
      <div className="level-check-filters">
        <span onClick={() => changeFilter()}>Level</span>
        <span>|</span>
        <span onClick={() => setShowLeads(!showLeads)}>Lead/Follow</span>
      </div>
      <div className="level-check-title text-center">{title} <span className="capitalize">{leadFollow}</span></div>
      <hr />
      <div className="level-check-container flex-row flex-justify-space-between">
        <div className={`leads-container ${!showLeads ? 'hidden' : ''}`}>
          {renderLeads()}
        </div>
        <div className={`follows-container ${showLeads ? 'hidden' : ''}`}>
          {renderFollows()}
        </div>
      </div>
      <div className="accept-all-btn  flex-row flex-justify-center">
        <div className="btn btn-danger" onClick={acceptAllLevels}>Place ALL remaining {leadFollow} in {level}</div>
      </div>
    </div>
  );
};


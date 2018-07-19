import React from 'react';
import { Link } from 'react-router';
import * as api from '../../../data/api';
import { LevelGraph } from './LevelGraph';

const Loading = require('react-loading-animation');

export class LevelCheckDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filteredLeads: {},
      filteredFollows: {},
      filter: '',
      loading: true,
      apollo: [],
      gemini: [],
      skylab: [],
      spacex: [],
      mercury: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.registrations) {
      const apollo = nextProps.registrations.filter(r => r.Level === 'Apollo' && r.LevelChecked);
      const gemini = nextProps.registrations.filter(r => r.Level === 'Gemini' && r.LevelChecked);
      const skylab = nextProps.registrations.filter(r => r.Level === 'Skylab' && r.LevelChecked);
      const spacex = nextProps.registrations.filter(r => r.Level === 'Space-X' && r.LevelChecked);
      const mercury = nextProps.registrations.filter(r => r.Level === 'Mercury' && r.LevelChecked);

      this.setState({
        apollo,
        gemini,
        skylab,
        spacex,
        mercury,
      });
    }
  }

  render() {
    const renderLevels = () => {
      if (!this.props.loading) {
        return (
          <div className="levels flex-row flex-justify-space-between">
            <LevelGraph registrations={this.state.mercury} level="Mercury" />
            <LevelGraph registrations={this.state.gemini} level="Gemini" />
            <LevelGraph registrations={this.state.apollo} level="Apollo" />
            <LevelGraph registrations={this.state.skylab} level="Skylab" />
            <LevelGraph registrations={this.state.spacex} level="Space-X" />
          </div>
        );
      }
      return <Loading />;
    };
    return (
      <div className="container form-container">
        <h1 className="text-center">Level Dashboard</h1>
        <div className="header-links">
          <Link to="/admin"><button className="btn btn-primary">Back to Admin</button></Link>
          <Link to="/admin/levelcheckupdates">View Completed Level Checks</Link>
        </div>
        {renderLevels()}
      </div>
    );
  }
}

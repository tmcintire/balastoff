import React from 'react';
import { Link } from 'react-router';
import * as api from '../../../data/api';
import { LevelGraph } from '../admin/LevelGraph';

const Loading = require('react-loading-animation');

export class Dashboard extends React.Component {
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
      showLevels: false,
      showStore: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.registrations) {
      const apollo = nextProps.registrations.filter(r => r.Level === 'Apollo' && r.LevelChecked);
      const gemini = nextProps.registrations.filter(r => r.Level === 'Gemini' && r.LevelChecked);
      const skylab = nextProps.registrations.filter(r => r.Level === 'Skylab' && r.LevelChecked);
      const spacex = nextProps.registrations.filter(r => r.Level === 'SpaceX' && r.CheckedIn);
      const mercury = nextProps.registrations.filter(r => r.Level === 'Mercury' && r.CheckedIn);

      this.setState({
        apollo,
        gemini,
        skylab,
        spacex,
        mercury,
      });
    }
  }

  toggleLevels = () => this.setState({ showLevels: !this.state.showLevels });
  toggleStore = () => this.setState({ showStore: !this.state.showStore });

  LevelNumbers = (props) => {
    const numLeads = props.registrations.filter(r => r.LeadFollow === 'Lead').length;
    const numFollows = props.registrations.filter(r => r.LeadFollow === 'Follow').length;
    return (
      <div className="level-numbers-row flex-row">
        <div className="track-name-container">
          <span className="track-name">{props.level}</span>
        </div>
        <div className="numbers flex-col">
          <span className="leads">Leads: {numLeads}</span>
          <span className="follows">Follows: {numFollows}</span>
        </div>
      </div>
    );
  }

  Levels = () => (
    <div className="dashboard-levels-container flex-col">
      <this.LevelNumbers registrations={this.state.mercury} level="Mercury" />
      <this.LevelNumbers registrations={this.state.gemini} level="Gemini" />
      <this.LevelNumbers registrations={this.state.apollo} level="Apollo" />
      <this.LevelNumbers registrations={this.state.skylab} level="Skylab" />
      <this.LevelNumbers registrations={this.state.spacex} level="Space-X" />
    </div>
  );

  Store = () => (
    <div className="store-container flex-col">
      { 
        Object.keys(this.props.store).map((key) => {
          const item = this.props.store[key];
          return (
            <div className="dashboard-store-item flex-row">
              <span className="item">{item.name}</span>
              <span className="item-count">{item.count}</span>
            </div>
          );
        })
      }
    </div>
  );

  PageBody = () => (
    <div>
      { this.state.showLevels && <this.Levels /> }
      { this.state.showStore && <this.Store /> }
    </div>
  );

  render() {
    return (
      <div className="container form-container">
        <div className="header-container flex-row flex-justify-content-center">
          <span className="mission-control-header">Mission Control</span>
        </div>
        <div className="section-header flex-row flex-align-center" onClick={this.toggleLevels}>
          Levels
          { this.state.showLevels ? <i className="fa fa-minus" /> : <i className="fa fa-plus" /> }
        </div>
        <div className="section-header flex-row flex-align-center" onClick={this.toggleStore}>
          Store
          { this.state.showStore ? <i className="fa fa-minus" /> : <i className="fa fa-plus" /> }
        </div>
        {
          !this.props.loading ? <this.PageBody /> : <Loading />
        }
      </div>
    );
  }
}

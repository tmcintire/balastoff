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
      showComps: false,
      openCouples: 0,
      amateurCouples: 0,
      adNovLeads: 0,
      adNovFollows: 0,
      amateurDrawLeads: 0,
      amateurDrawFollows: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.registrations) {
      const apollo = nextProps.registrations.filter(r => r.Level === 'Apollo' && r.LevelChecked);
      const gemini = nextProps.registrations.filter(r => r.Level === 'Gemini' && r.LevelChecked);
      const skylab = nextProps.registrations.filter(r => r.Level === 'Skylab' && r.LevelChecked);
      const spacex = nextProps.registrations.filter(r => r.Level === 'SpaceX' && r.CheckedIn);
      const mercury = nextProps.registrations.filter(r => r.Level === 'Mercury' && r.CheckedIn);

      let openCouples = 0;
      let amateurCouples = 0;
      let adNovLeads = 0;
      let adNovFollows = 0;
      let amateurDrawLeads = 0;
      let amateurDrawFollows = 0;

      _.forEach(nextProps.registrations, (reg) => {
        if (reg) {
          if (reg.Comps && reg.Comps.length > 0) {
            _.forEach(reg.Comps, (comp) => {
              if (comp.Key === 'Open') {
                // get open comps
                const partner = comp.Partner;
                const exists = this.compAlreadyInArray(open, partner);
        
                if (!exists) {
                  openCouples += 1;
                }
              } else if (comp.Key === 'AmateurCouples') {
                // Get the amateur couples comps
                const partner = comp.Partner;
                const exists = this.compAlreadyInArray(partner);
  
                if (!exists) {
                  amateurCouples += 1;
                }
              } else if (comp.Key === 'AdNov' && reg.AdNovDrawRole === 'Lead') {
                adNovLeads += 1;
              } else if (comp.Key === 'AdNov' && reg.AdNovDrawRole === 'Follow') {
                adNovFollows += 1;
              } else if (comp.Key === 'AmateurDraw' && reg.AmateurDrawRole === 'Lead') {
                amateurDrawLeads += 1;
              } else if (comp.Key === 'AmateurDraw' && reg.AmateurDrawRole === 'Follow') {
                amateurDrawFollows += 1;
              }
            });
          }
        }
      });

      // const openCouples = nextProps.registrations.filter(r => r.Open === 'Yes').length;
      // const amateurCouples = nextProps.registrations.filter(r => r['Amateur Couples'] === 'Yes').length;
      // const adNovLeads = nextProps.registrations.filter(r => r.AdNov === 'Yes' && r.AdNovDrawRole === 'Lead').length;
      // const adNovFollows = nextProps.registrations.filter(r => r.AdNov === 'Yes' && r.AdNovDrawRole === 'Follow').length;
      // const amateurDrawLeads = nextProps.registrations.filter(r => r.AmateurDraw === 'Yes' && r.AmateurDrawRole === 'Lead').length;
      // const amateurDrawFollows = nextProps.registrations.filter(r => r.AmateurDraw === 'Yes' && r.AmateurDrawRole === 'Follow').length;
      
      this.setState({
        apollo,
        gemini,
        skylab,
        spacex,
        mercury,
        openCouples,
        amateurCouples,
        adNovLeads,
        adNovFollows,
        amateurDrawLeads,
        amateurDrawFollows,
      });
    }
  }

  // check if this entry is alredy in the array
  compAlreadyInArray = (array, partner) => {
    const exists = _.some(array, (o) => {
      if (name === o.name && partner === o.partner) {
        return true;
      }
      if (name === o.partner && partner === o.name) {
        return true;
      }

      return false;
    });

    return exists;
  }

  toggleLevels = () => this.setState({ showLevels: !this.state.showLevels });
  toggleStore = () => this.setState({ showStore: !this.state.showStore });
  toggleComps = () => this.setState({ showComps: !this.state.showComps });

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
    <div className="dashboard-dropdown dashboard-levels-container flex-col">
      <this.LevelNumbers registrations={this.state.mercury} level="Mercury" />
      <this.LevelNumbers registrations={this.state.gemini} level="Gemini" />
      <this.LevelNumbers registrations={this.state.apollo} level="Apollo" />
      <this.LevelNumbers registrations={this.state.skylab} level="Skylab" />
      <this.LevelNumbers registrations={this.state.spacex} level="Space-X" />
    </div>
  );

  Store = () => {
    let total = 0;
    _.forEach(this.props.store, i => {
      total += i.count * i.price;
    });
    return (
      <div className="dashboard-dropdown flex-col">
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
        <span className="store-total"> Store Total: ${total.toFixed(2)}</span>
      </div>
    );
  };

  Comps = () => {
    return (
      <div className="dashboard-dropdown flex-col">
        <span>AdNov Leads - {this.state.adNovLeads}</span>
        <span>AdNov Follows - {this.state.adNovFollows}</span>
        <span>Amateur Draw Leads - {this.state.amateurDrawLeads}</span>
        <span>Amateur Draw Follows - {this.state.amateurDrawFollows}</span>
        <span>Amateur Couples - {this.state.amateurCouples}</span>
        <span>Open Couples - {this.state.openCouples}</span>
      </div>
    );
  };

  render() {
    return (
      <div className="container form-container">
        <div className="header-container flex-row flex-justify-content-center">
          <span className="mission-control-header">Mission Control</span>
        </div>
        <div className="section-header flex-col" onClick={this.toggleLevels}>
          <div className="flex-row">
            Levels
            { this.state.showLevels ? <i className="fa fa-minus" /> : <i className="fa fa-plus" /> }
          </div>
          { this.state.showLevels && <this.Levels /> }
        </div>
        <div className="section-header flex-col" onClick={this.toggleComps}>
          <div className="flex-row">
            Comps
            { this.state.showComps ? <i className="fa fa-minus" /> : <i className="fa fa-plus" /> }
          </div>
          { this.state.showComps && <this.Comps /> }
        </div>
        <div className="section-header flex-col" onClick={this.toggleStore}>
          <div className="flex-row">
            Store
            { this.state.showStore ? <i className="fa fa-minus" /> : <i className="fa fa-plus" /> }
          </div>
          { this.state.showStore && <this.Store /> }
        </div>
        <div className="section-header flex-col">
          <div className="flex-row">
            Total Collected: ${this.props.totalCollected && this.props.totalCollected.toFixed(2)}
          </div>
        </div>
      </div>
    );
  }
}

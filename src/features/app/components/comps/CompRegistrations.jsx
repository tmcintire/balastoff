import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

const Loading = require('react-loading-animation');

export class CompRegistrations extends React.Component {
  constructor() {
    super();
    this.state = {
      registration: {},
      open: [],
      amateurCouples: [],
      adNov: [],
      amateurDraw: [],
      loading: true,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.registrations) {
      const open = [];
      const amateurCouples = [];
      const adNov = [];
      const amateurDraw = [];
      _.forEach(nextProps.registrations, (reg) => {
        if (reg) {
          const name = `${reg['First Name']} ${reg['Last Name']}`;
          if (reg.Comps && reg.Comps.length > 0) {
            _.forEach(reg.Comps, (comp) => {
              if (comp.Key === 'Open') {
                // get open comps
                const partner = comp.Partner;
                const exists = this.compAlreadyInArray(open, partner);
        
                if (!exists) {
                  open.push({ name, partner });
                }
              } else if (comp.Key === 'AmateurCouples') {
                // Get the amateur couples comps
                const partner = comp.Partner;
                const exists = this.compAlreadyInArray(partner);
  
                if (!exists) {
                  amateurCouples.push({ name, partner });
                }
              } else if (comp.Key === 'AdNov') {
                adNov.push({ name, role: comp.Role });
              } else if (comp.Key === 'AmateurDraw') {
                amateurDraw.push({ name, role: comp.Role });
              }
            });
          }
        }
      });

      this.setState({
        open,
        amateurCouples,
        adNov,
        amateurDraw,
        loading: nextProps.loading,
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

  backToRegistrations = () => {
    window.location('/');
  }

  renderOpen = () => {
    if (!this.state.loading) {
      return this.state.open.map((o, index) => (
        <div key={index}>
          <p>{o.name} <strong>&</strong> {o.partner}</p>
        </div>
      ));
    }
    return null;
  };

  renderAmateur = () => {
    if (!this.state.loading) {
      return this.state.amateurCouples.map((o, index) => (
        <div key={index}>
          <p>{o.name} <strong>&</strong> {o.partner}</p>
        </div>
      ));
    }
    return null;
  };

  renderAdNov = () => {
    if (!this.state.loading) {
      const sorted = _.orderBy(this.state.adNov, 'role');
      return sorted.map((o, index) => (
        <div key={index}>
          <p>{o.name} -- {o.role || ''}</p>
        </div>
      ));
    }
    return null;
  };

  renderAmateurDraw = () => {
    if (!this.state.loading) {
      const sorted = _.orderBy(this.state.amateurDraw, 'role');
      return sorted.map((o, index) => (
        <div key={index}>
          <p>{o.name} -- {o.role || ''}</p>
        </div>
      ));
    }
    return null;
  };

  render() {
    const renderRegistration = () => {
      if (this.state.loading) {
        return (
          <Loading />
        );
      }
      return (
        <div>
          <h1 className="text-center flex-col">Comp Registrations</h1>
          <div className="flex-row flex-wrap flex-justify-space-around">
            <div>
              <h3 className="text-center">Open</h3>
              <hr />
              {this.renderOpen()}
            </div>
            <div>
              <h3 className="text-center">Amateur Couples</h3>
              <hr />
              {this.renderAmateur()}
            </div>
          </div>
          <div className="flex-row flex-wrap flex-justify-space-around">
            <div>
              <h3 className="text-center">AdNov</h3>
              <hr />
              {this.renderAdNov()}
            </div>
            <div>
              <h3 className="text-center">Amateur Draw</h3>
              <hr />
              {this.renderAmateurDraw()}
            </div>
          </div>
        </div>
      );
    };
    return (
      <div className="container">
        {renderRegistration()}
      </div>
    );
  }
}

CompRegistrations.PropTypes = {
  loading: PropTypes.boolean,
};

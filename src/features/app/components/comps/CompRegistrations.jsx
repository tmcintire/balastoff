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
          const name = `${reg.FirstName} ${reg.LastName}`;
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

  renderOpen = () => {
    if (!this.state.loading) {
      return this.state.open.map((o, index) => (
        <tr key={index}>
          <td>{o.name}</td>
          <td>{o.partner}</td>
        </tr>
      ));
    }
    return null;
  };

  renderAmateur = () => {
    if (!this.state.loading) {
      return this.state.amateurCouples.map((o, index) => (
        <tr key={index}>
          <td>{o.name}</td>
          <td>{o.partner}</td>
        </tr>
      ));
    }
    return null;
  };

  renderAdNov = () => {
    if (!this.state.loading) {
      const sorted = _.orderBy(this.state.adNov, 'role');
      return sorted.map((o, index) => (
        <tr key={index}>
          <td>{o.name}</td>
          <td>{o.role || ''}</td>
        </tr>
      ));
    }
    return null;
  };

  renderAmateurDraw = () => {
    if (!this.state.loading) {
      const sorted = _.orderBy(this.state.amateurDraw, 'role');
      return sorted.map((o, index) => (
        <tr key={index}>
          <td>{o.name}</td>
          <td>{o.role || ''}</td>
        </tr>
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
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Partner</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderOpen()}
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="text-center">Amateur Couples</h3>
              <hr />
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Partner</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderAmateur()}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex-row flex-wrap flex-justify-space-around">
            <div>
              <h3 className="text-center">AdNov</h3>
              <hr />
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderAdNov()}
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="text-center">Amateur Draw</h3>
              <hr />
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderAmateurDraw()}
                </tbody>
              </table>
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

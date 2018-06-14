import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

const Loading = require('react-loading-animation');

export class CompRegistrations extends React.Component {
  constructor() {
    super();
    this.state = {
      registration: {},
      open: {},
      amateur: {},
      adNov: {},
      loading: true,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.registrations) {
      const openRegs = nextProps.registrations.filter(reg => {
        if (reg.Comps) {
          return reg.Comps.some(c => c.Key === 'Open');
        }
        return false;
      });
      const open = [];
      _.forEach(openRegs, (r) => {
        const openComp = r.Comps.find(c => c.Key === 'Open');
        const name = r['First Name'] + ' ' + r['Last Name'];
        const partner = openComp.Partner;

        const exists = _.some(open, o => {
          if (name === o.name && partner === o.partner) {
            return true;
          }
          if (name === o.partner && partner === o.name) {
            return true;
          }
        });

        if (!exists) {
          open.push({ name, partner });
        }
      });

      const amateurRegistrations = nextProps.registrations.filter(reg => {
        if (reg.Comps) {
          return reg.Comps.some(c => c.Key === 'Amateur Couples');
        }
        return false;
      });
      const amateur = [];
      _.forEach(amateurRegistrations, (a) => {
        const amateurCouplesComp = a.Comps.find(c => c.Key === 'Amateur Couples');        
        const name = a['First Name'] + ' ' + a['Last Name'];
        const partner = amateurCouplesComp.Partner;

        const exists = _.some(amateur, am => {
          if (name === am.name && partner === am.partner) {
            return true;
          }
          if (name === am.partner && partner === am.name) {
            return true;
          }
        });

        if (!exists) {
          amateur.push({ name, partner });
        }
      });

      const adNovRegistrations = nextProps.registrations.filter(reg => {
        if (reg.Comps) {
          return reg.Comps.some(c => c.Key === 'AdNov');
        }
        return false;
      });

      const adNov = adNovRegistrations.map(r => {
        const adNovComp = r.Comps.find(c => c.Key === 'AdNov');        
        return {
          name: r['First Name'] + ' ' + r['Last Name'],
          role: adNovComp.Role,
        };
      });

      this.setState({
        open,
        amateur,
        adNov,
        loading: nextProps.loading,
      });
    }
  }

  backToRegistrations = () => {
    window.location('/');
  }
  render() {
    const renderOpen = () => {
      if (!this.state.loading) {
        return this.state.open.map((o, index) => (
          <div key={index}>
            <p>{o.name} <strong>&</strong> {o.partner}</p>
          </div>
        ));
      }
    };
    const renderAmateur = () => {
      if (!this.state.loading) {
        return this.state.amateur.map((o, index) => (
          <div key={index}>
            <p>{o.name} <strong>&</strong> {o.partner}</p>
          </div>
        ));
      }
    };
    const renderAdNov = () => {
      if (!this.state.loading) {
        return this.state.adNov.map((o, index) => (
          <div key={index}>
            <p>{o.name} -- {o.role || ''}</p>
          </div>
        ));
      }
    };
    const renderRegistration = () => {
      if (this.state.loading) {
        return (
          <Loading />
        );
      }
      return (
        <div>
          <h1 className="text-center">Comp Registrations</h1>
          <div className="flex-row flex-wrap flex-justify-space-between">
            <div>
              <h3 className="text-center">Open</h3>
              <hr />
              {renderOpen()}
            </div>
            <div>
              <h3 className="text-center">Amateur Couples</h3>
              <hr />
              {renderAmateur()}
            </div>
            <div>
              <h3 className="text-center">AdNov</h3>
              <hr />
              {renderAdNov()}
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

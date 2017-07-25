import React from 'react';
import _ from 'lodash';

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
      const openRegs = nextProps.registrations.filter(reg => reg.Open === 'Yes');
      const open = [];
      _.forEach(openRegs, (r) => {
        const name = r['First Name'] + ' ' + r['Last Name'];
        const partner = r.Partner;

        const exists = _.some(open, o => {
          if (name === o.name || partner === o.partner) {
            return true;
          }
          if (name === o.partner || partner === o.name) {
            return true;
          }
        });

        if (!exists) {
          open.push({ name, partner });
        }
      });
      const amateurRegistrations = nextProps.registrations.filter(reg => reg['Amateur Couples'] === 'Yes');
      const amateur = [];
      _.forEach(amateurRegistrations, (a) => {
        const name = a['First Name'] + ' ' + a['Last Name'];
        const partner = a['Amateur Partner'];

        const exists = _.some(amateur, am => {
          if (name === am.name || partner === am.partner) {
            return true;
          }
          if (name === am.partner || partner === am.name) {
            return true;
          }
        });

        if (!exists) {
          amateur.push({ name, partner });
        }
      });
      const adNov = (nextProps.registrations.filter(reg => reg.AdNov === 'Yes')).map(r => {
        return {
          name: r['First Name'] + ' ' + r['Last Name'],
          role: r.AdNovLeadFollow,
        }
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
        return this.state.open.map(o => (
          <div>
            <p>{o.name} <strong>&</strong> {o.partner}</p>
          </div>
        ));
      }
    };
    const renderAmateur = () => {
      if (!this.state.loading) {
        return this.state.amateur.map(o => (
          <div>
            <p>{o.name} <strong>&</strong> {o.partner}</p>
          </div>
        ));
      }
    };
    const renderAdNov = () => {
      if (!this.state.loading) {
        return this.state.adNov.map(o => (
          <div>
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
  loading: React.PropTypes.boolean,
};

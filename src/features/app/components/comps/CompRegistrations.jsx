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
      const open = nextProps.registrations.filter(reg => reg.Open === 'Yes');
      const amateur = nextProps.registrations.filter(reg => reg['Amateur Couples'] === 'Yes');
      const adNov = nextProps.registrations.filter(reg => reg.AdNov === 'Yes');

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
            <p>{o['First Name']} {o['Last Name']} <strong>&</strong> {o.Partner}</p>
          </div>
        ));
      }
    };
    const renderAmateur = () => {
      if (!this.state.loading) {
        return this.state.amateur.map(o => (
          <div>
            <p>{o['First Name']} {o['Last Name']} <strong>&</strong> {o['Amateur Partner']}</p>
          </div>
        ));
      }
    };
    const renderAdNov = () => {
      if (!this.state.loading) {
        return this.state.adNov.map(o => (
          <div>
            <p>{o['First Name']} {o['Last Name']} -- {o.AdNovLeadFollow || ''}</p>
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

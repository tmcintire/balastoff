import * as React from 'react';
import * as _ from 'lodash';
import { IRegistration, IPartnerComp, IRoleComp } from '../../../data/interfaces';

const Loading = require('react-loading-animation');

interface CompRegistrationsProps {
  registrations: IRegistration[],
  loading: boolean
}

interface CompRegistrationsState {
  open: IPartnerComp[],
  challengerThrowdown: IPartnerComp[],
  adNov: IRoleComp[],
  amateurDraw: IRoleComp[]
}

export class CompRegistrations extends React.Component<CompRegistrationsProps, CompRegistrationsState> {
  constructor(props) {
    super(props);
    this.state = {
      open: [],
      challengerThrowdown: [],
      adNov: [],
      amateurDraw: [],
    };
  }
  componentWillReceiveProps(nextProps: CompRegistrationsProps) {
    if (nextProps.registrations) {
      const open = [];
      const challengerThrowdown = [];
      const adNov = [];
      const amateurDraw = [];
      _.forEach(nextProps.registrations, (reg) => {
        if (reg) {
          const name = `${reg.FirstName} ${reg.LastName}`;
          if (reg.Comps && reg.Comps.length > 0) {
            _.forEach(reg.Comps, (comp) => {
              if (comp.key === 'Open') {
                // get open comps
                const partner = comp.partner;
                const exists = this.compAlreadyInArray(open, partner);
        
                if (!exists) {
                  open.push({ name, partner });
                }
              } else if (comp.key === 'ChallengerThrowdown') {
                // Get the amateur couples comps
                const partner = comp.partner;
                const exists = this.compAlreadyInArray(challengerThrowdown, partner);
  
                if (!exists) {
                  challengerThrowdown.push({ name, partner });
                }
              } else if (comp.key === 'AdNov') {
                adNov.push({ name, role: comp.role });
              } else if (comp.key === 'AmateurDraw') {
                amateurDraw.push({ name, role: comp.role });
              }
            });
          }
        }
      });

      this.setState({
        open,
        challengerThrowdown,
        adNov,
        amateurDraw
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
    if (!this.props.loading) {
      return this.state.open.map((o, index) => (
        <tr key={index}>
          <td>{o.name}</td>
          <td>{o.partner}</td>
        </tr>
      ));
    }
    return null;
  };

  renderChallengerThrowdown = () => {
    if (!this.props.loading) {
      return this.state.challengerThrowdown.map((o, index) => (
        <tr key={index}>
          <td>{o.name}</td>
          <td>{o.partner}</td>
        </tr>
      ));
    }
    return null;
  };

  renderAdNov = () => {
    if (!this.props.loading) {
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
    if (!this.props.loading) {
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
      if (this.props.loading) {
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
              <h3 className="text-center">Challenger Throwdown</h3>
              <hr />
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Partner</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderChallengerThrowdown()}
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

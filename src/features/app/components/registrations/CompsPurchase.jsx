import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class NewComp {
  constructor(key, name, partner, role) {
    this.Key = key;
    this.Name = name;
    this.Partner = partner;
    this.Role = role;
  }
}

export class CompsPurchase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allComps: props.allComps,
      comps: props.comps,
      purchaseAmount: 0,
    };
  }

  compSelectionChange = (e, comp) => {
    const IsCompeting = e.target.checked;
    let purchaseAmount;
    let newComp;
    let comps;
    if (IsCompeting) {
      purchaseAmount = this.state.purchaseAmount + comp.Price;
      newComp = new NewComp(comp.Key, comp.Name, '', '');
      if (this.state.comps) {
        comps = this.state.comps.concat(newComp);
      } else {
        comps = [newComp];
      }
    } else {
      purchaseAmount = this.state.purchaseAmount - comp.Price;

      // find the comp that was unselsected and remove it
      comps = _.filter(this.state.comps, c => c.Key !== comp.Key);
    }

    this.setState({ comps, purchaseAmount });
  }

  handlePartnerChange = (Partner, key) => {
    this.setState({
      comps: this.state.comps.map(obj => (obj.Key === key ? { ...obj, Partner } : obj)),
    });
  }

  handleRoleChange = (Role, key) => {
    this.setState({
      comps: this.state.comps.map(obj => (obj.Key === key ? { ...obj, Role } : obj)),
    });
  }

  confirmPurchase = () => this.props.confirmPurchase(this.state.comps, this.state.purchaseAmount);

  render() {
    const renderCompsList = () => this.props.allComps.map((comp, index) => {
      const isSelected = _.some(this.state.comps, rc => rc.Key === comp.Key);

      return (
        <div key={index} className="info-container">
          <div className="comp-info flex-align-center flex-row flex-justify-space-between">
            <div className="flex-row">
              <input type="checkbox" checked={isSelected} onChange={e => this.compSelectionChange(e, comp)} />
              <span>{comp.Name}(${comp.Price}): </span>
            </div>
            <div className="partner-role-container">
              {renderPartnerOrRole(comp)}
            </div>
          </div>
        </div>
      );
    });

    const renderPartnerOrRole = (comp) => {
      const compData = _.find(this.state.allComps, c => c.Key === comp.Key);
      const found = _.find(this.state.comps, c => c.Key === comp.Key);
      if (found) {
        if (compData.Partner) {
          return (
            <input type="text" value={found.Partner} onChange={e => this.handlePartnerChange(e.target.value, comp.Key)} />
          );
        } else if (compData.Role) {
          return (
            <select value={found.Role} onChange={e => this.handleRoleChange(e.target.value, comp.Key)}>
              <option value="Lead">Lead</option>
              <option value="Follow">Follow</option>
            </select>
          );
        }
      }
    };

    return (
      <div className="confirmation-container">
        <div className="confirmation-inner flex-col flex-align-center">
          <div className="close-popup" onClick={this.props.closePopup}>
          x
          </div>
          <h1>Confirm Purchase</h1>
          <div className="flex-col flex-align-start full-width">
            {renderCompsList()}
          </div>

          <div className="final-total">
            <span>Total: ${this.state.purchaseAmount}</span>
          </div>

          <button className="confirm-btn btn btn-success" onClick={this.confirmPurchase}>Confirm Purchase</button>
        </div>
      </div>

    );
  }
}

CompsPurchase.propTypes = {
  confirmPurchase: PropTypes.func,
  closePopup: PropTypes.func,
};

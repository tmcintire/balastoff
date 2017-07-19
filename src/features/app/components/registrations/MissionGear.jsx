import React from 'react';

import * as api from '../../../data/api';

export class MissionGear extends React.Component {
  updateMerchCheckbox(e, type) {
    const object = {
      [type]: e.target.checked,
    };
    api.updateRegistration(this.props.params.id, object);
  }

  render() {
    const { registration } = this.props;
    const renderShirts = () => {
      if (registration.TShirts) {
        return (
          <tr>
            <td>{registration.TShirts}</td>
            <td>{registration.Size}</td>
            <td className="text-center">
              <input
                className="no-outline"
                checked={registration.Shirt1}
                type="checkbox"
                onChange={e => this.updateMerchCheckbox(e, 'Shirt1')}
              />
            </td>
          </tr>
        );
      }
    };
    const renderAdditionalShirts = () => {
      if (registration.AdditionalTShirts) {
        return (
          <tr>
            <td>{registration.AdditionalTShirts}</td>
            <td>{registration.Size2}</td>
            <td className="text-center">
              <input
                className="no-outline"
                checked={registration.Shirt2}
                type="checkbox"
                onChange={e => this.updateMerchCheckbox(e, 'Shirt2')}
              />
            </td>
          </tr>
        );
      }
    };
    const renderPatches = () => {
      if (registration['Limited Edition Patch']) {
        return (
          <tr>
            <td>{registration['Limited Edition Patch']}</td>
            <td>N/A</td>
            <td className="text-center">
              <input
                className="no-outline"
                checked={registration.Patch}
                type="checkbox"
                onChange={e => this.updateMerchCheckbox(e, 'Patch')}
              />
            </td>
          </tr>
        );
      }
    };

    const renderMissionGear = () => {
      if (!registration.TShirts && !registration.AdditionalTShirts && !registration['Limited Edition Patch']) {
        return (
          <h4>No mission gear ordered</h4>
        );
      }
      return (
        <div className="merch-container">
          <table className="table custom-table">
            <thead>
              <th>T-Shirt</th>
              <th>Size</th>
              <th>Picked Up</th>
            </thead>
            <tbody>
              {renderShirts()}
              {renderAdditionalShirts()}
              {renderPatches()}
            </tbody>
          </table>
        </div>
      );
    };
    return (
      <div>
        <h3><strong>Mission Gear</strong></h3>
        {renderMissionGear()}
      </div>
    );
  }
}

MissionGear.propTypes = {
  registration: React.PropTypes.array,
  params: {
    id: React.PropTypes.string,
  },
};

import React from 'react';

import * as api from '../../../data/api';

export class MissionGear extends React.Component {
  constructor() {
    super();
    this.state = {
      showReportMissioneGearIssue: false,
    };
  }
  updateMerchCheckbox(e, type) {
    const object = {
      [type]: e.target.checked,
    };
    api.updateRegistration(this.props.id, object);
  }

  showMissionGearIssues = () => {
    this.setState({
      showReportMissioneGearIssue: !this.state.showReportMissioneGearIssue,
    });
  }

  reportMissionGearIssue = (e) => {
    e.preventDefault();
    let object = {};
    if (this.props.registration.MissionGearIssues) {
      object = {
        MissionGearIssues: [...this.props.registration.MissionGearIssues, {
          Issue: this.state.issue,
          Resolved: false,
        }],
      };
    } else {
      object = {
        MissionGearIssues: [{
          Issue: this.state.issue,
          Resolved: false }],
      };
    }
    api.updateRegistration(this.props.id, object);
    this.setState({
      issue: null,
    });
    this.issue.value = null;
    this.props.saved();
  }

  handleChange = (e) => {
    this.setState({
      issue: e.target.value,
    });
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

    const renderReportMissionGearIssue = () => {
      if (this.state.showReportMissioneGearIssue) {
        return (
          <div className="flex-col">
            <textarea
              ref={(ref) => { this.issue = ref; }}
              onChange={e => this.handleChange(e)}
            />
            <button
              disabled={!this.state.issue}
              className="btn btn-primary"
              onClick={e => this.reportMissionGearIssue(e)}
            >
            Submit</button>
          </div>
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
        <span className="link" onClick={() => this.showMissionGearIssues()}>Report Mission Gear Issue</span>
        {renderReportMissionGearIssue()}
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

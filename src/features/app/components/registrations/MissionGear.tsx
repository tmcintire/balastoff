import * as React from 'react';
import * as api from '../../../data/api';
import { IRegistration, IMissionGearIssue } from '../../../data/interfaces';
const uuidv1 = require('uuid/v1');

interface MissionGearProps {
  id: number,
  saved: () => void,
  registration: IRegistration
}

interface MissionGearState {
  showReportMissionGearIssue: boolean,
  issue: string,
}

export class MissionGear extends React.Component<MissionGearProps, MissionGearState> {
  constructor(props) {
    super(props);
    this.state = {
      showReportMissionGearIssue: false,
      issue: null
    };
  }

  public issue: HTMLTextAreaElement;

  updateMerchCheckbox(e, type) {
    const object: IRegistration = {
      [type]: e.target.checked,
    };
    api.updateRegistration(this.props.id, object);
    this.props.saved();
  }

  showMissionGearIssues = () => {
    this.setState({
      showReportMissionGearIssue: !this.state.showReportMissionGearIssue,
    });
  }

  reportMissionGearIssue = (e) => {
    e.preventDefault();
    let registration: IRegistration;
    const { FirstName, LastName, BookingID } = this.props.registration;

    const newIssue: IMissionGearIssue = {
      IssueId: uuidv1(),
      Issue: this.state.issue,
      Resolved: false,
      BookingID: BookingID,
      FirstName,
      LastName
    }

    if (this.props.registration.MissionGearIssues) {
      registration = {
        MissionGearIssues: [...this.props.registration.MissionGearIssues, newIssue],
      };
    } else {
      registration = {
        MissionGearIssues: [newIssue],
      };
    }
    api.updateRegistration(this.props.id, registration);
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
  onKeyDown = (e) => {
    e.persist();
    if (e.keyCode === 13) {
      e.preventDefault();
      this.reportMissionGearIssue(e);
    }
  }

  render() {
    const { registration } = this.props;
    const renderShirts = () => {
      if (registration.TShirts) {
        return (
          <tr>
            <td>{registration.TShirts}</td>
            <td>{registration.AllSizes1 || registration.LimitedSizes1}</td>
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
            <td>{registration.AllSizes2 || registration.LimitedSizes2}</td>
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
      if (this.state.showReportMissionGearIssue) {
        return (
          <div className="flex-col">
            <textarea
              ref={(ref) => { this.issue = ref; }}
              onChange={e => this.handleChange(e)}
              onKeyDown={e => this.onKeyDown(e)}
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

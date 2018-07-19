import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import * as api from '../../../data/api';

import { Comps } from './Comps';
import { MissionGear } from './MissionGear';
import { Level } from './Level';
import { Comments } from './Comments';
import { Payment } from './Payment';
import { EditMissionGearIssues } from './EditMissionGearIssues';

const Loading = require('react-loading-animation');

export class EditRegistration extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.registrations && nextProps.tracks) {
      const registration = nextProps.registrations.filter(reg =>
        reg.BookingID === nextProps.params.id)[0];

      return {
        registration,
        loading: false,
      };
    }

    return null;
  }

  constructor(props) {
    super(props);
    let loading = true;

    if (props.registrations) {
      const registration = props.registrations.filter(reg =>
        reg.BookingID === props.params.id)[0];

      if (registration) {
        loading = false;
      }

      this.state = {
        registration,
        loading,
        showSaved: false,
        moneyLogComment: 'Paid off amount due on registration',
        error: '',
      };
    } else {
      this.state = {
        registration: {},
        loading: true,
        showSaved: false,
        moneyLogComment: 'Paid off amount due on registration',
        error: '',
      };
    }
  }

  saveForm(e) {
    e.preventDefault();
    let hasComments;

    if (!_.isEmpty(this.comments.value)) {
      hasComments = true;
    } else {
      hasComments = false;
    }
    const object = {
      Comments: this.comments.value,
      HasComments: hasComments,
    };
    api.updateRegistration(this.props.params.id, object);
  }

  toggleCheckedIn = (e) => {
    if (this.state.registration['Amount Owed'] !== '0.00' && this.state.registration['Amount Owed'] !== 0) {
      this.setState({ error: 'Registration must be paid before checking in' });
      return;
    }

    const object = {
      CheckedIn: e.target.checked,
    };

    this.saved();
    api.updateRegistration(this.props.params.id, object);

    window.location = '/#';
  }

  changePaidCheckBox = (e) => {
    const tempOwed = this.state.registration['Amount Owed'];
    const confirm = window.confirm(`Confirm payment of $${tempOwed} for ${this.state.registration['First Name']} ${this.state.registration['Last Name']}`);

    if (confirm === true) {
      const checked = e.target.checked;
      const owed = e.target.checked ? '0.00' : tempOwed;

      const amount = parseInt(tempOwed, 10);
      api.updateTotalCollected(amount);
      const moneyLog = {
        bookingId: this.state.registration.BookingID,
        amount,
        quantity: 'N/A',
        unitPrice: 'N/A',
        description: 'Paid Final Balance',
      };
      api.updateMoneyLog(moneyLog);

      const object = {
        HasPaid: checked,
        'Amount Owed': owed,
      };

      this.saved();
      api.updateRegistration(this.props.params.id, object);
    }
  }

  backToRegistrations = () => {
    window.location('/');
  }

  updateMoneyLogComment = (comment) => {
    let newComment = comment;
    if (parseInt(this.state.registration['Amount Owed'], 10) > 0) {
      newComment = this.state.moneyLogComment + ', ' + comment
    }
    this.setState({
      moneyLogComment: newComment,
    });
  }

  toggleResolved = (e, id, index) => {
    const issue = this.state.registration.MissionGearIssues[index];
    const object = {
      MissionGearIssues: {
        [index]: {
          Issue: issue.Issue,
          Resolved: !issue.Resolved,
        },
      },
    };

    api.updateRegistration(id, object);
    this.saved();
  }

  saved = () => {
    this.setState({
      showSaved: true,
    });
    setTimeout(() => {
      this.setState({
        showSaved: false,
      });
    }, 2000);
  }
  render() {
    const { registration, partner, comps } = this.state;
    const renderSaved = () => (this.state.showSaved ? <h4 className="saved-message">Saved</h4> : null);
    const renderError = this.state.error !== '' ? this.state.error : '';

    const renderRegistration = () => {
      if (this.state.loading) {
        return (
          <Loading />
        );
      }
      return (
        <div>
          {renderSaved()}
          <Link className="back" to={'/'}><i className="fa fa-arrow-left" aria-hidden="true" />Back to Registrations</Link>
          <h1 className="text-center">{registration.BookingID} - {registration['First Name']} {registration['Last Name']}</h1>
          <div className="flex-row option flex-justify-content-center">
            <span>Check In!</span>
            <input className="no-outline" type="checkbox" checked={registration.CheckedIn} onChange={e => this.toggleCheckedIn(e)} />
          </div>

          <p className="error-text">{renderError}</p>

          <hr />
          <div className="flex-row flex-wrap flex-justify-space-between">
            <Level
              saved={this.saved}
              id={this.props.params.id}
              level={registration.Level}
              hasLevelCheck={registration.HasLevelCheck}
            />
            <Comps
              comps={registration.Comps}
              allComps={this.props.allComps}
              partner={partner}
              saved={this.saved}
              id={this.props.params.id}
              registration={registration}
              updateMoneyLogComment={this.updateMoneyLogComment}
            />
            <Payment
              saved={this.saved}
              amountOwed={registration['Amount Owed']}
              fullyPaid={registration.HasPaid}
              togglePaid={this.changePaidCheckBox}
            />
          </div>

          <hr />
          <div className="flex-row flex-wrap flex-justify-space-between">
            <MissionGear
              saved={this.saved}
              id={this.props.params.id}
              registration={registration}
            />
            <EditMissionGearIssues
              saved={this.saved}
              id={this.props.params.id}
              issues={registration.MissionGearIssues}
              toggleResolved={this.toggleResolved}
            />
            <Comments
              saved={this.saved}
              id={this.props.params.id}
              registration={registration}
            />
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

EditRegistration.propTypes = {
  registration: PropTypes.array,
  params: {
    id: PropTypes.string,
  },
  totalCollected: PropTypes.number,
  partners: PropTypes.array,
};

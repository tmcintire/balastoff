import React from 'react';
import { Link } from 'react-router';
import * as api from '../../../data/api';

export class RegistrationBox extends React.Component {
  changeCheckBox(bookingID) {
    // update checkbox
    const object = {
      CheckedIn: this.checkedInCheckbox.checked,
    };
    api.updateRegistration(bookingID, object);
  }

  changePaidCheckBox(bookingID) {
    const object = {
      HasPaid: this.paidCheckbox.checked,
    };
    api.updateRegistration(bookingID, object);
  }

  render() {
    const { registration } = this.props;
    let style = {};
    if (!registration.HasPaid) {
      style = {
        color: 'red',
      };
    }
    const hasMerchandise =
      (registration.TShirts || registration.AdditionalTShirts || registration['Limited Edition Patch']) ? 'Yes' : 'No';
    return (
      <div>
        <span className="col-xs-1">
          <Link to={`editregistration/${registration.BookingID}`}>
            {registration.BookingID}
          </Link>
        </span>
        <span className="col-xs-2">{registration['Last Name']}</span>
        <span className="col-xs-2">{registration['First Name']}</span>
        <span className="col-xs-2">{registration.Level}</span>
        <span className="col-xs-1">{registration.HasLevelCheck}</span>
        <span className="col-xs-1" style={style}>${registration['Amount Owed']}</span>
        <span className="col-xs-1">{hasMerchandise}</span>
        <span className="col-xs-1 text-center">
          <input
            className="no-outline"
            ref={(ref) => { this.paidCheckbox = ref; }}
            checked={registration.HasPaid}
            type="checkbox"
            onChange={() => this.changePaidCheckBox(registration.BookingID)}
          />
        </span>
        <span className="col-xs-1 checkin-background text-center">
          <input
            className="no-outline"
            ref={(ref) => { this.checkedInCheckbox = ref; }}
            checked={registration.CheckedIn}
            type="checkbox"
            onChange={() => this.changeCheckBox(registration.BookingID)}
          />
        </span>
      </div>
    );
  }
}

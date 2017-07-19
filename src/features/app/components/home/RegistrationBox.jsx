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
      <tr>
        <td>
          <Link to={`editregistration/${registration.BookingID}`}>
            <i className="fa fa-pencil-square-o" aria-hidden="true" />
          </Link>
        </td>
        <td>{registration['Last Name']}</td>
        <td>{registration['First Name']}</td>
        <td>{registration.Level}</td>
        <td>{registration.HasLevelCheck}</td>
        <td style={style}>${registration['Amount Owed']}</td>
        <td>{hasMerchandise}</td>
        <td>
          <input
            ref={(ref) => { this.paidCheckbox = ref; }}
            checked={registration.HasPaid}
            type="checkbox"
            onChange={() => this.changePaidCheckBox(registration.BookingID)}
          />
        </td>
        <td>
          <input
            ref={(ref) => { this.checkedInCheckbox = ref; }}
            checked={registration.CheckedIn}
            type="checkbox"
            onChange={() => this.changeCheckBox(registration.BookingID)}
          />
        </td>
      </tr>
    );
  }
}

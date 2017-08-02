import React from 'react';
import { Link } from 'react-router';
import * as api from '../../../data/api';

export class RegistrationBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      oldAmount: props.registration['Amount Owed'],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.registration) {

    }
  }

  changeCheckBox = (e, bookingID) => {
    // update checkbox
    const object = {
      CheckedIn: e.target.checked,
    };
    api.updateRegistration(bookingID, object);
  }

  changePaidCheckBox = (e, bookingID) => {
    const data = {
      bookingID,
      checked: e.target.checked,
      amountOwed: this.props.registration['Amount Owed'],
      originalAmountOwed: this.props.registration['Original Amount Owed']
    };
    const checked = e.target.checked;
    this.props.changePaidCheckBox(data);
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
        <Link to={`editregistration/${registration.BookingID}`}>
          <span className="col-xs-1">
            {registration.BookingID}
          </span>
        </Link>
        <span className="col-xs-2">{registration['Last Name']}</span>
        <span className="col-xs-2">{registration['First Name']}</span>
        <span className="col-xs-2">{registration.Level}</span>
        <span className="col-xs-1">{registration.HasLevelCheck}</span>
        <span className="col-xs-1" style={style}>${registration['Amount Owed']}</span>
        <span className="col-xs-1">{hasMerchandise}</span>
        <span className="col-xs-1 text-center">
          <input
            className="no-outline"
            disabled
            checked={registration.HasPaid}
            type="checkbox"
            onChange={e => this.changePaidCheckBox(e, registration.BookingID)}
          />
        </span>
        <span className="col-xs-1 checkin-background text-center">
          <input
            disabled
            className="no-outline"
            checked={registration.CheckedIn}
            type="checkbox"
            onChange={e => this.changeCheckBox(e, registration.BookingID)}
          />
        </span>
      </div>
    );
  }
}

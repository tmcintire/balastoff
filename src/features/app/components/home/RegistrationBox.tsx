import * as React from 'react';
import { Link } from 'react-router';
import * as api from '../../../data/api';
import { IRegistration } from '../../../data/interfaces';

interface RegistrationBoxProps {
  registration: IRegistration,
  hasLevelCheck: boolean
}

interface RegistrationBoxState {
  oldAmount: number
}

export class RegistrationBox extends React.Component<RegistrationBoxProps, RegistrationBoxState> {
  constructor(props) {
    super(props);

    this.state = {
      oldAmount: props.registration.AmountOwed
    };
  }

  render() {
    const { registration } = this.props;
    let style = {};
    if (!registration.HasPaid || registration.AmountOwed > 0) {
      style = {
        color: 'red',
      };
    }
    const hasMerchandise =
      (registration.TShirts || registration.AdditionalTShirts || registration['Limited Edition Patch']) ? 'Yes' : 'No';
    return (
      <Link className="registration-box-link" to={`editregistration/${registration.BookingID}`}>
        <span className="col-xs-1">
          {registration.BookingID}
        </span>
        <span className="col-xs-2">{registration.LastName}</span>
        <span className="col-xs-2">{registration.FirstName}</span>
        <span className="col-xs-2">{registration.Level}</span>
        <span className="col-xs-1">{this.props.hasLevelCheck ? 'Yes' : 'No'}</span>
        <span className="col-xs-1" style={style}>${registration.AmountOwed.toFixed(2)}</span>
        <span className="col-xs-1">{hasMerchandise}</span>
        <span className="col-xs-1 text-center">
          <input
            className="no-outline"
            disabled
            checked={registration.HasPaid}
            type="checkbox"
          />
        </span>
        <span className="col-xs-1 checkin-background text-center">
          <input
            disabled
            className="no-outline"
            checked={registration.CheckedIn}
            type="checkbox"
          />
        </span>
      </Link>
    );
  }
}

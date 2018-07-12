import React from 'react';
import * as api from '../../../data/api';

export class LevelCheckInfo extends React.Component {
  handleUpdate = (id) => {
    api.updateRegistration(id, {
      BadgeUpdated: this.badgeUpdatedCheckbox.checked,
    })
  }
  checkUpdated = () => {
    if (this.props.updated) {
      return 'updated-badges';
    }
  }

  render() {
    const { registration } = this.props;
    return (
      <div className={`container level-check-info ${this.checkUpdated()} flex-row`}>
        <span>{registration.BookingID}</span>
        <span>{registration['First Name']}</span>
        <span>{registration['Last Name']}</span>
        <span>{registration.Level}</span>
        <input
          type="checkbox"
          checked={registration.BadgeUpdated}
          ref={(ref) => { this.badgeUpdatedCheckbox = ref; }}
          onChange={() => this.handleUpdate(registration.BookingID)}
        />
      </div>
    );
  }
}

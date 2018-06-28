import React from 'react';

export class Participant extends React.Component {
  handleClick(id) {
    window.location = `#/admin/editparticipant/${id}`;
  }
  render() {
    const { registration } = this.props;
    return (
      <div className="admin-participant flex-row flex-justify-space-between" onClick={() => this.handleClick(registration.BookingID)}>
        <span className="col-xs-2">{registration.BookingID}</span>
        <span className="col-xs-3">{registration['First Name']}</span>
        <span className="col-xs-3">{registration['Last Name']}</span>
        <span className="col-xs-2">{registration.Level.level}</span>
        <span className="col-xs-2">{registration.HasLevelCheck ? 'Yes' : 'No'}</span>
      </div>
    );
  }
}

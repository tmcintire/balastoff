import React from 'react';

export class Participant extends React.Component {
  handleClick(id) {
    window.location = `#/admin/editparticipant/${id}`;
  }
  render() {
    const { registration } = this.props;
    return (
      <tr className="admin-participant" onClick={() => this.handleClick(registration.BookingID)}>
        <td>{registration.BookingID}</td>
        <td>{registration['First Name']}</td>
        <td>{registration['Last Name']}</td>
      </tr>
    );
  }
}

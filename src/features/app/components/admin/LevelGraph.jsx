import React from 'react';

export class LevelGraph extends React.Component {
  render() {
    const numLeads = this.props.registrations.filter(r => r.LeadFollow === 'Lead').length;
    const numFollows = this.props.registrations.filter(r => r.LeadFollow === 'Follow').length;
    const { level } = this.props;

    return (
      <div>
        <h1>{level}</h1>
        <p>Leads: {numLeads}</p>
        <p>Follows: {numFollows}</p>
      </div>
    );
  }
}

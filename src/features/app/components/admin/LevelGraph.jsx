import React from 'react';

export class LevelGraph extends React.Component {
  render() {
    const numLeads = this.props.registrations.filter(r => r.LeadFollow === 'Lead').length;
    const numFollows = this.props.registrations.filter(r => r.LeadFollow === 'Follow').length;
    const { level } = this.props;

    const total = numLeads + numFollows;

    const leadsStyle = {
      height: numLeads/total * 100 + '%',
      background: 'blue',
      width: '100%',
    };

    const followsStyle = {
      height: numFollows/total * 100 + '%',
      background: 'red',
      width: '100%',
    };

    return (
      <div>
        <h1>{level}</h1>
        <p>Leads: {numLeads}</p>
        <p>Follows: {numFollows}</p>

        <div className="graph-container flex-row">
          <div style={leadsStyle}>
          </div>
          <div style={followsStyle}>
          </div>
        </div>

      </div>
    );
  }
}

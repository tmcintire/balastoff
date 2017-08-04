import React from 'react';

export class ApolloGraph extends React.Component {
  render() {
    const numLeads = this.props.registrations.filter(r => r.LeadFollow === 'Lead').length;
    const numFollows = this.props.registrations.filter(r => r.LeadFollow === 'Follow').length;

    return (
      <div className="container form-container">
        <h1 className="text-center">Apollo</h1>
        <p>Leads: {numLeads}</p>
        <p>Follows: {numFollows}</p>
      </div>
    );
  }
}

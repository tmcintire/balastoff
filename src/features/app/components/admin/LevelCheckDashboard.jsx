import React from 'react';
import { Link } from 'react-router';
import * as api from '../../../data/api';
import { ApolloGraph } from './ApolloGraph';

const Loading = require('react-loading-animation');

export class LevelCheckDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filteredLeads: {},
      filteredFollows: {},
      filter: '',
      loading: true,
      apollo: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.registrations) {
      const apollo = nextProps.registrations.filter(r => r.Level === 'Apollo');

      this.setState({
        apollo,
      });
    }
  }

  render() {
    return (
      <div className="container form-container">
        <h1 className="text-center">Level Check Dashboard</h1>
        <div className="header-links">
          <Link to="/admin"><button className="btn btn-primary">Back to Admin</button></Link>
          <Link to="/admin/levelcheckupdates">View Completed Level Checks</Link>
        </div>
        <ApolloGraph registrations={this.state.apollo} />

      </div>
    );
  }
}

import { connect } from 'react-redux';
import { LevelCheckDashboard } from './LevelCheckDashboard';

const mapStateToProps = state => ({
  tracks: state.data.tracks,
  registrations: state.data.registrations.registrations,
  loading: state.data.registrations.loading,
});

export const LevelCheckDashboardContainer = connect(mapStateToProps)(LevelCheckDashboard);

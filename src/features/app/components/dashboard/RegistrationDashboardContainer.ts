import { connect } from 'react-redux';
import { RegistrationDashboard } from './RegistrationDashboard';

const mapStateToProps = state => ({
  registrations: state.data.registrations.registrations,
  store: state.data.store.store,
  comps: state.data.comps.comps,
  totalCollected: state.data.totalCollected.totalCollected,
  loading: state.data.registrations.loading,
  config: state.data.config.config
});

export const RegistrationDashboardContainer = connect(mapStateToProps)(RegistrationDashboard);

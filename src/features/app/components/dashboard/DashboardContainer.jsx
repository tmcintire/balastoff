import { connect } from 'react-redux';
import { Dashboard } from './Dashboard';

const mapStateToProps = state => ({
  registrations: state.data.registrations.registrations,
  store: state.data.store.store,
  comps: state.data.comps.comps,
  loading: state.data.registrations.loading,
});

export const DashboardContainer = connect(mapStateToProps)(Dashboard);

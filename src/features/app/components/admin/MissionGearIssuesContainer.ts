import { connect } from 'react-redux';
import { MissionGearIssues } from './MissionGearIssues';

const mapStateToProps = state => ({
  registrations: state.data.registrations.registrations,
  partners: state.data.registrations.partners,
  loading: state.data.registrations.loading,
});

export const MissionGearIssuesContainer = connect(mapStateToProps)(MissionGearIssues);

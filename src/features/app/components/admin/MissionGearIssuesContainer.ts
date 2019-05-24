import { connect } from 'react-redux';
import { MissionGearIssues } from './MissionGearIssues';

const mapStateToProps = state => ({
  registrations: state.data.registrations.registrations,
  issues: state.data.issues.issues,
});

export const MissionGearIssuesContainer = connect(mapStateToProps)(MissionGearIssues);

import { connect } from 'react-redux';
import { MissedLevelCheck } from './MissedLevelCheck';

const mapStateToProps = state => ({
  tracks: state.data.tracks,
  registrations: state.data.registrations.registrations,
  loading: state.data.registrations.loading,
});

export const MissedLevelCheckContainer = connect(mapStateToProps)(MissedLevelCheck);

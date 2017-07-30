import { connect } from 'react-redux';
import { LevelCheckUpdates } from './LevelCheckUpdates';

const mapStateToProps = state => ({
  tracks: state.data.tracks,
  registrations: state.data.registrations.registrations,
  loading: state.data.registrations.loading,
});

export const LevelCheckUpdatesContainer = connect(mapStateToProps)(LevelCheckUpdates);

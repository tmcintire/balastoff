import { connect } from 'react-redux';
import { LevelCheck } from './LevelCheck';

const mapStateToProps = state => ({
  tracks: state.data.tracks,
  registrations: state.data.registrations.registrations,
  loading: state.data.registrations.loading,
});

export const LevelCheckContainer = connect(mapStateToProps)(LevelCheck);

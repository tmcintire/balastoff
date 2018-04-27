import { connect } from 'react-redux';
import { AddParticipant } from './AddParticipant';

const mapStateToProps = state => ({
  registrations: state.data.registrations.registrations,
  tracksLoading: state.data.tracks.loading,
  tracks: state.data.tracks.tracks,
  passes: state.data.passes.passes,
  passesLoading: state.data.passes.loading,
  totalCollected: state.data.totalCollected.totalCollected,
});

export const AddParticipantContainer = connect(mapStateToProps)(AddParticipant);

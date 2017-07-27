import { connect } from 'react-redux';
import { AddParticipant } from './AddParticipant';

const mapStateToProps = state => ({
  tracks: state.data.tracks,
  registrations: state.data.registrations.registrations,
  loading: state.data.registrations.loading,
});

export const AddParticipantContainer = connect(mapStateToProps)(AddParticipant);

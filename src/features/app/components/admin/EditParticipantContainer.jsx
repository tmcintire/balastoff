import { connect } from 'react-redux';
import { EditParticipant } from './EditParticipant';

const mapStateToProps = state => ({
  tracks: state.data.tracks,
  registrations: state.data.registrations.registrations,
  loading: state.data.registrations.loading,
});

export const EditParticipantContainer = connect(mapStateToProps)(EditParticipant);

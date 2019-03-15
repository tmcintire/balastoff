import { connect } from 'react-redux';
import { EditRegistration } from './EditRegistration';

const mapStateToProps = state => ({
  registrations: state.data.registrations.registrations,
  partners: state.data.registrations.partners,
  loading: state.data.registrations.loading,
  totalCollected: state.data.totalCollected.totalCollected,
  allComps: state.data.comps.comps,
  tracks: state.data.tracks.tracks,
});

export const EditRegistrationContainer = connect(mapStateToProps)(EditRegistration);

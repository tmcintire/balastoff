import { connect } from 'react-redux';
import { EditRegistration } from './EditRegistration';

const mapStateToProps = state => ({
  registrations: state.data.registrations.registrations,
  partners: state.data.registrations.partners,
  loading: state.data.registrations.loading,
  totalCollected: state.data.totalCollected.totalCollected,
});

export const EditRegistrationContainer = connect(mapStateToProps)(EditRegistration);

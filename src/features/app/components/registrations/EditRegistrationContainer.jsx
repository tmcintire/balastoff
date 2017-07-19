import { connect } from 'react-redux';
import { EditRegistration } from './EditRegistration';

const mapStateToProps = state => ({
  registrations: state.data.registrations.registrations,
  loading: state.data.registrations.loading,
});

export const EditRegistrationContainer = connect(mapStateToProps)(EditRegistration);

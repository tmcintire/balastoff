import { connect } from 'react-redux';
import { CompRegistrations } from './CompRegistrations';

const mapStateToProps = state => ({
  registrations: state.data.registrations.registrations,
  loading: state.data.registrations.loading,
});

export const CompRegistrationsContainer = connect(mapStateToProps)(CompRegistrations);

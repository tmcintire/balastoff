import { connect } from 'react-redux';
import { Admin } from './Admin';

const mapStateToProps = state => ({
  registrations: state.data.registrations.registrations,
  loading: state.data.registrations.loading,
  tracks: state.data.tracks.tracks,
});

export const AdminContainer = connect(mapStateToProps)(Admin);

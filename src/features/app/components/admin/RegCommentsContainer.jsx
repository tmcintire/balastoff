import { connect } from 'react-redux';
import { RegComments } from './RegComments';

const mapStateToProps = state => ({
  registrations: state.data.registrations.registrations,
  loading: state.data.registrations.loading,
});

export const RegCommentsContainer = connect(mapStateToProps)(RegComments);

import { connect } from 'react-redux';
import { CompsTables } from './CompsTables';

const mapStateToProps = state => ({
  registrations: state.data.registrations.registrations,
  loading: state.data.registrations.loading,
  allComps: state.data.comps.comps
});

export const CompsTablesContainer = connect(mapStateToProps)(CompsTables);

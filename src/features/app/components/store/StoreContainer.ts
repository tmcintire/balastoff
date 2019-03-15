import { connect } from 'react-redux';
import { Store } from './Store';

const mapStateToProps = state => ({
  store: state.data.store.store,
  loading: state.data.store.loading,
});

export const StoreContainer = connect(mapStateToProps)(Store);

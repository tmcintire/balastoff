import { connect } from 'react-redux';
import { ShuffleShops } from './ShuffleShops';

const mapStateToProps = state => ({
  registrations: state.data.registrations.registrations,
  loading: state.data.registrations.loading
});

export const ShuffleShopsContainer = connect(mapStateToProps)(ShuffleShops);

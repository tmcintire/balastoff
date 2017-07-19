import { connect } from 'react-redux';
import { Home } from './Home';

const mapStateToProps = state => ({
  registrations: state.data.registrations.registrations,
  loading: state.data.registrations.loading,
});

export const HomeContainer = connect(mapStateToProps)(Home);

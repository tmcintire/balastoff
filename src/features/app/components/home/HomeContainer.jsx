import { connect } from 'react-redux';
import { Home } from './Home';

const mapStateToProps = state => ({
  registrations: state.data.registrations.registrations,
  loading: state.data.registrations.loading,
  totalCollected: state.data.totalCollected.totalCollected,
  tracks: state.data.tracks.tracks
});

export const HomeContainer = connect(mapStateToProps)(Home);

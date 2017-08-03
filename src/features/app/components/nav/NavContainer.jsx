import { connect } from 'react-redux';
import { Nav } from './Nav';

const mapStateToProps = state => ({
  connection: state.data.connectionState.state,
  loading: state.data.registrations.loading,
});

export const NavContainer = connect(mapStateToProps)(Nav);

import { connect } from 'react-redux';
import { MasterAdmin } from './MasterAdmin';

const mapStateToProps = state => ({
  tracks: state.data.tracks.tracks,
  config: state.data.config.config,
  dances: state.data.dances.dances,
  passes: state.data.passes.passes,
  store: state.data.store.store,
  fields: state.data.fields.fields,
});

export const MasterAdminContainer = connect(mapStateToProps)(MasterAdmin);

import { connect } from 'react-redux';
import { AddParticipant } from './AddParticipant';

const mapStateToProps = state => ({
  registrations: state.data.registrations.registrations,
  loading: state.data.prices.loading,
  prices: state.data.prices.prices,
  totalCollected: state.data.totalCollected.totalCollected,
});

export const AddParticipantContainer = connect(mapStateToProps)(AddParticipant);

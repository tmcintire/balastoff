import { connect } from 'react-redux';
import { MoneyLog } from './MoneyLog';

const mapStateToProps = state => ({
  log: state.data.moneyLog.moneyLog,
  totalCollected: state.data.totalCollected.totalCollected,
  loading: state.data.moneyLog.loading,
  config: state.data.config.config,
  registrations: state.data.registrations.registrations,
});

export const MoneyLogContainer = connect(mapStateToProps)(MoneyLog);

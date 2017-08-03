import { connect } from 'react-redux';
import { MoneyLog } from './MoneyLog';

const mapStateToProps = state => ({
  log: state.data.moneyLog.moneyLog,
  loading: state.data.moneyLog.loading,
});

export const MoneyLogContainer = connect(mapStateToProps)(MoneyLog);

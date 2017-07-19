import { combineReducers } from 'redux';
import data from '../features/data';


export default combineReducers({
  data: data.reducer,
});

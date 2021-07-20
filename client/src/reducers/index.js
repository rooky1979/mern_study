import { combineReducers } from 'redux';
import alert from './alert';

export default combineReducers({
  dummy: () => 'hello',
  alert,
});

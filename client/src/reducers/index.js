import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';

export default combineReducers({
  dummy: () => 'hello',
  alert,
  auth,
});

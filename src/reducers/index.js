import { combineReducers } from 'redux';
import data from './dataReducer';
import userInterface from './userInterfaceReducer';

export default combineReducers({
  userInterface,
  data,
});

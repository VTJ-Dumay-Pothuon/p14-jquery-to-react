import { combineReducers } from 'redux';
import employeeReducer from './employee_reducer';

const reducers = combineReducers({
  employeeReducer: employeeReducer
});

export default reducers;
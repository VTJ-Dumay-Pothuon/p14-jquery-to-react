import { combineReducers } from 'redux';
import employeeReducer from './employee_reducer';

const reducers = combineReducers({
  employees: employeeReducer
});

export default reducers;
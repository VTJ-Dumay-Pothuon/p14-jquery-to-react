import { ADD_EMPLOYEE, GET_EMPLOYEES } from '../actions/employee_actions'

const initialState = { employees: [] }

const employeeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_EMPLOYEE:
      return {
        ...state,
        employees: [...state.employees, action.payload],
      }
    case GET_EMPLOYEES:
      return {
        ...state,
        employees: state.employees,
      }
    default:
      return state
  }
}

export default employeeReducer
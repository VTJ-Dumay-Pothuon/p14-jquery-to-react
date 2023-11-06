import { ADD_EMPLOYEE, GET_EMPLOYEES } from '../actions/employee_actions'

const initialState = { employees: JSON.parse(localStorage.getItem('employees')) || [] }

const employeeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_EMPLOYEE:
      return {
        employees: [...state.employees, action.payload]
      }
    case GET_EMPLOYEES:
      return {
        ...state,
        employees: action.payload
      }
    default:
      return state
  }
}

export default employeeReducer
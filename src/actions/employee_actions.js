export const ADD_EMPLOYEE = 'ADD_EMPLOYEE'
export const GET_EMPLOYEES = 'GET_EMPLOYEES'

export const addEmployee = (employee) => ({
  type: ADD_EMPLOYEE,
  payload: employee,
})

export const getEmployees = () => ({
  type: GET_EMPLOYEES,
})
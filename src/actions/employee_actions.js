export const ADD_EMPLOYEE = 'ADD_EMPLOYEE'
export const GET_EMPLOYEES = 'GET_EMPLOYEES'

export const addEmployee = (employee) => {
  return (dispatch, getState) => {
    dispatch({ type: ADD_EMPLOYEE, payload: employee })
    const state = getState()
    localStorage.setItem('employees', JSON.stringify(state.store.employeeReducer.employees))
  }
}

export const getEmployees = () => {
  return (dispatch, getState) => {
    const state = getState()
    if (state.store.employeeReducer.employees.length > 0) {
      // console.log('Reading employees from Redux Store')
      dispatch({ type: GET_EMPLOYEES, payload: state.store.employeeReducer.employees })
    } else {
      try {
        // console.log('Reading employees from Local Storage if store is empty')
        const storedEmployees = JSON.parse(localStorage.getItem('employees'))
        if (storedEmployees) dispatch({ type: GET_EMPLOYEES, payload: storedEmployees })
        else dispatch({ type: GET_EMPLOYEES, payload: [] })
      } catch (error) {
        console.error('Error reading employees from Local Storage', error)
      }
    }
  }
}
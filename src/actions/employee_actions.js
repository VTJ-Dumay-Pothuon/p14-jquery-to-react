export const ADD_EMPLOYEE = 'ADD_EMPLOYEE'
export const GET_EMPLOYEES = 'GET_EMPLOYEES'

export const addEmployee = (employee) => ({
  type: ADD_EMPLOYEE,
  payload: employee,
})

export const getEmployees = () => {
  return (dispatch) => {
    try {
      const storedEmployees = JSON.parse(localStorage.getItem('employees'));

      if (storedEmployees) {
        dispatch({
          type: GET_EMPLOYEES,
          payload: storedEmployees,
        });
      }
    } catch (error) {
      console.error('Error reading employees from Local Storage', error);
    }
  };
};
import { configureStore } from '@reduxjs/toolkit'
import employees from './reducers/reducers'

const store = configureStore({
  reducer: {
    employees: employees
  }
})

export default store
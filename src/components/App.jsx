import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from 'react-modal'
import { Link, useNavigate } from 'react-router-dom'

import { addEmployee, getEmployees } from '../actions/employee_actions'
import states from '../assets/states'

import '../styles/App.css'
/* global $ */

Modal.setAppElement('#root')

const App = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [startDate, setStartDate] = useState('')
  const [department, setDepartment] = useState('Sales')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [confirmationVisible, setConfirmationVisible] = useState(false)
  const [isOpen, setIsOpen] = useState({
    state: false,
    department: false
  })
  
  getEmployees()
  const employees = useSelector((state) => state.store.employeeReducer.employees)
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees))
  }, [employees])

  const toggleSelect = (selectName) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [selectName]: !prevState[selectName]
    }))
  }

  const dispatch = useDispatch()

  const saveEmployee = () => {
    const employee = {
      firstName,
      lastName,
      dateOfBirth,
      startDate,
      department,
      street,
      city,
      state: selectedState,
      zipCode,
    }
    dispatch(addEmployee(employee))
    setConfirmationVisible(true)
    document.body.classList.add('no-scroll')
  }

  const handleClickOutside = (e) => {
      if (document.getElementById('state').contains(e.target) ||
      document.getElementById('department').contains(e.target)) {
        return
      }
      setIsOpen( {state: false, department: false} )
  }

  const navigate = useNavigate()

  useEffect(() => {
    $('#date-of-birth').datetimepicker({
      timepicker: false,
      format: 'm/d/Y'
    })
    $('#start-date').datetimepicker({
      timepicker: false,
      format: 'm/d/Y'
    })

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        setConfirmationVisible(false)
        document.body.classList.remove('no-scroll')
        navigate('/employee-list')
      }}
    )

    document.addEventListener('mousedown', handleClickOutside)
    return () => {document.removeEventListener('mousedown', handleClickOutside)}
  }, [navigate])

  return (
    <div className="App">
      <div className="title">
        <h1>HRnet</h1>
      </div>
      <div className="container">
        <Link to="/employee-list">View Current Employees</Link>
        <h2>Create Employee</h2>
        <form action="#" id="create-employee">
          <label htmlFor="first-name">First Name</label>
          <input
            type="text"
            id="first-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <label htmlFor="last-name">Last Name</label>
          <input
            type="text"
            id="last-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <label htmlFor="date-of-birth">Date of Birth</label>
          <input
            id="date-of-birth"
            type="text"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />

          <label htmlFor="start-date">Start Date</label>
          <input
            id="start-date"
            type="text"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <fieldset className="address">
            <legend>Address</legend>

            <label htmlFor="street">Street</label>
            <input
              id="street"
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />

            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <label htmlFor="state">State</label>
            <select
              className={`home ${isOpen.state ? 'opened' : 'closed'}`}
              onClick={() => toggleSelect('state')}
              name="state"
              id="state"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.abbreviation} value={state.abbreviation}>
                  {state.name}
                </option>
              ))}
            </select>

            <label htmlFor="zip-code">Zip Code</label>
            <input
              id="zip-code"
              type="number"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </fieldset>

          <label htmlFor="department">Department</label>
          <select
            className={`home ${isOpen.department ? 'opened' : 'closed'}`}
            onClick={() => toggleSelect('department')}
            name="department"
            id="department"
            value={department}
            onChange={(e) => {setDepartment(e.target.value)}}
          >
            <option>Sales</option>
            <option>Marketing</option>
            <option>Engineering</option>
            <option>Human Resources</option>
            <option>Legal</option>
          </select>
        </form>

        <button onClick={saveEmployee}>Save</button>
      </div>

      <Modal id="confirmation" className="modal" isOpen={confirmationVisible}>
        <p>Employee Created!</p>
        <button className='close-button' onClick={() => {
            setConfirmationVisible(false)
            document.body.classList.remove('no-scroll')
          }}></button>
      </Modal>
    </div>
  )
}

export default App
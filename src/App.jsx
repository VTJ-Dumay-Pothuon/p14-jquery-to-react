import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Modal from 'react-modal'

import { addEmployee } from './actions/employee_actions'
import states from './assets/states'

import './App.css'
/* global $ */

function App() {
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

  const handleClickOutside = () => {
      setIsOpen( {state: false, department: false} )
  }
  
  useEffect(() => {
    $('#date-of-birth').datetimepicker({
      timepicker: false,
      format: 'm/d/Y'
    })
    $('#start-date').datetimepicker({
      timepicker: false,
      format: 'm/d/Y'
    })

    document.addEventListener('mousedown', handleClickOutside);
    return () => {document.removeEventListener('mousedown', handleClickOutside)}
  }, [])

  return (
    <div className="App">
      <div className="title">
        <h1>HRnet</h1>
      </div>
      <div className="container">
        <a href="employee-list.html">View Current Employees</a>
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
              className={`select ${isOpen.state ? 'opened' : 'closed'}`}
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
            className={`select ${isOpen.department ? 'opened' : 'closed'}`}
            onClick={() => toggleSelect('department')}
            name="department"
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
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
        <h2>Modal Content</h2>
        <p>This is the content of the modal.</p>
        <button onClick={() => {
            setConfirmationVisible(false)
            document.body.classList.remove('no-scroll')
          }}>Close Modal</button>
      </Modal>
    </div>
  )
}

export default App
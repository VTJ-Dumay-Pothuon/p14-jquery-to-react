import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Modal from 'react-modal'
import Select from 'react-select'
import { Link, useNavigate } from 'react-router-dom'

/* LOCAL REACT COMPONENT */
//import { DatePicker } from  './DatePicker'

/* MATCHING NPM PACKAGE */
import { DatePicker } from '@vtjdp/date-picker'

import { addEmployee, getEmployees } from '../actions/employee_actions'
import states from '../assets/states'

import '../styles/App-min.scss'

Modal.setAppElement('#root')

const App = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [startDate, setStartDate] = useState('')
    const [department, setDepartment] = useState('Sales')
    const [street, setStreet] = useState('')
    const [city, setCity] = useState('')
    const [stateShort, setStateShort] = useState('AL')
    const [zipCode, setZipCode] = useState('')
    const [confirmationVisible, setConfirmationVisible] = useState(false)

    const dispatch = useDispatch()
    useEffect(() => dispatch(getEmployees()), [dispatch])

    const saveEmployee = () => {
        const employee = {
            firstName,
            lastName,
            dateOfBirth: dateOfBirth || new Date(0).toLocaleDateString(),
            startDate: startDate || new Date().toLocaleDateString(),
            department,
            street,
            city,
            stateShort,
            zipCode
        }
        dispatch(addEmployee(employee))
        setConfirmationVisible(true)
        document.body.classList.add('no-scroll')
    }

    const navigate = useNavigate()

    useEffect(() => {

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                setConfirmationVisible(false)
                document
                    .body
                    .classList
                    .remove('no-scroll')
                navigate('/employee-list')
            }
        })

    }, [navigate])

    const selectStyle = {
        control: (base) => ({  ...base, backgroundColor: '#f6f6f6' }),
        valueContainer: () => ({
            height: '21px',
            paddingLeft: '15px',
            cursor: 'pointer'
        }),
        option: (base, { isFocused, isSelected }) => ({
            ...base,
            color: isFocused || isSelected ? '#fff' : '#454545',
        }),
        placeholder: () => ({ color: '#454545' }),
        singleValue: () => ({ color: '#454545' }),
        indicatorSeparator: () => ({ display: 'none'}),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: '#777',
            paddingRight: '15px',
            transition: 'all .2s ease',
            transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : null
          })
    }

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
                        onChange={(e) => setFirstName(e.target.value)}/>

                    <label htmlFor="last-name">Last Name</label>
                    <input
                        type="text"
                        id="last-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}/>

                    <label htmlFor="date-of-birth">Date of Birth</label>
                    <DatePicker
                      id="date-of-birth"
                      value={dateOfBirth}
                      onChange={(date) => setDateOfBirth(date)}
                    />
                    <label htmlFor="start-date">Start Date</label>
                    <DatePicker
                      id="start-date"
                      value={startDate}
                      onChange={(date) => setStartDate(date)}
                    />
                    <fieldset className="address">
                        <legend>Address</legend>

                        <label htmlFor="street">Street</label>
                        <input
                            id="street"
                            type="text"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}/>

                        <label htmlFor="city">City</label>
                        <input
                            id="city"
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}/>

                        <label htmlFor="state">State</label>
                        <Select
                        styles={selectStyle}
                        theme={(theme) => ({
                            ...theme,
                            colors: {...theme.colors,primary25:'#08F',primary:'#08F'}
                        })}
                        name="state" id="state"
                        className={'home'}
                        isSearchable={false}
                        menuPlacement="auto"
                        options={states.map((state) => ({
                            value: state.abbreviation,
                            label: state.name
                        }))}
                        onChange={(state) => setStateShort(state.value)}
                        placeholder="Select State" />

                        <label htmlFor="zip-code">Zip Code</label>
                        <input
                            id="zip-code"
                            type="number"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}/>
                    </fieldset>

                    <label htmlFor="department">Department</label>
                    <Select
                        styles={selectStyle}
                        name="department" id="department"
                        className={'home'}
                        isSearchable={false}
                        menuPlacement="auto"
                        options={[
                            { value: 'Sales', label: 'Sales' },
                            { value: 'Marketing', label: 'Marketing' },
                            { value: 'Engineering', label: 'Engineering' },
                            { value: 'Human Resources', label: 'Human Resources' },
                            { value: 'Legal', label: 'Legal' }
                        ]}
                        onChange={(state) => setDepartment(state.value)}
                        placeholder="Select Department" />
                </form>

                <button onClick={saveEmployee}>Save</button>
            </div>

            <Modal id="confirmation" className="modal" isOpen={confirmationVisible}>
                <p>Employee Created!</p>
                <button
                    className='close-button'
                    onClick={() => {
                    setConfirmationVisible(false)
                    document.body.classList.remove('no-scroll')
                }}></button>
            </Modal>
        </div>
    )
}

export default App
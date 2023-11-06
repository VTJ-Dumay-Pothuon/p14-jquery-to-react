import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TableTemplate from './TableTemplate'
import { Link } from 'react-router-dom'

import { getEmployees } from '../actions/employee_actions'

import '../styles/Employees-min.scss'

const Employees = () => {
    const dispatch = useDispatch()

    const employees = useSelector((state) => state.store.employeeReducer.employees)
    const [data, setData] = useState(employees)
    useEffect(() => dispatch(getEmployees()), [dispatch])
    useEffect(() => setData(employees), [employees])

    const alphabetical = useMemo(() => (rowA, rowB, columnId) => {
        const a = rowA.original[columnId].toLowerCase()
        const b = rowB.original[columnId].toLowerCase()
        return (a > b) ? 1 : -1
    }, [])

    const datetime = useMemo(() => (rowA, rowB, columnId) => {
        const a = new Date(rowA.original[columnId])
        const b = new Date(rowB.original[columnId])
        return (a > b) ? 1 : -1
    }, [])

    const columns = [
  { Header: 'First Name',   accessor: 'firstName',  sortType: alphabetical },
  { Header: 'Last Name',    accessor: 'lastName',   sortType: alphabetical },
  { Header: 'Start Date',   accessor: 'startDate',  sortType: datetime     },
  { Header: 'Department',   accessor: 'department', sortType: alphabetical },
  { Header: 'Date of Birth',accessor: 'dateOfBirth',sortType: datetime     },
  { Header: 'Street',       accessor: 'street',     sortType: alphabetical },
  { Header: 'City',         accessor: 'city',       sortType: alphabetical },
  { Header: 'State',        accessor: 'stateShort', sortType: alphabetical },
  { Header: 'Zip Code',     accessor: 'zipCode',    sortType: alphabetical }
    ]

    return (
        <div className="App">
            <h1 className='title'>Current Employees</h1>
            <section className="container">
                <TableTemplate columns={columns} data={data}/>
                <Link to="/">Home</Link>
            </section>
        </div>
    )
}

export default Employees
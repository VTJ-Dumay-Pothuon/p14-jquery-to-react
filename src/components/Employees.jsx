import { useState, useEffect, useMemo } from 'react'
import TableTemplate from './TableTemplate'
import { Link } from 'react-router-dom'

import '../styles/Employees.scss'

const Employees = () => {
    const [data, setData] = useState([])

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

    useEffect(() => {
        const employees = JSON.parse(localStorage.getItem('employees'))
        if (employees) {
            setData(employees)
        }
    }, [])

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
import { useState, useEffect } from 'react'
import TableTemplate from './TableTemplate'
import { Link } from 'react-router-dom';

import '../styles/Employees.css'

const columns = [
  { Header: 'First Name',    accessor: 'firstName'   },
  { Header: 'Last Name',     accessor: 'lastName'    },
  { Header: 'Start Date',    accessor: 'startDate'   },
  { Header: 'Department',    accessor: 'department'  },
  { Header: 'Date of Birth', accessor: 'dateOfBirth' },
  { Header: 'Street',        accessor: 'street'      },
  { Header: 'City',          accessor: 'city'        },
  { Header: 'State',         accessor: 'state'       },
  { Header: 'Zip Code',      accessor: 'zipCode'     }
]

const Employees = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const employees = JSON.parse(localStorage.getItem('employees'));
    if (employees) {
      setData(employees)
    }
  }, [])

  return (
    <div className="App">
      <h1 className='title'>Current Employees</h1>
      <section className="container">
        <TableTemplate columns={columns} data={data} />
        <Link to="/">Home</Link>
      </section>
    </div>
  )
}

export default Employees
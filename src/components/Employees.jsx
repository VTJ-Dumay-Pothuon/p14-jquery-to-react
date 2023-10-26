import { useState, useEffect } from 'react'
//import { Link } from 'react-router-dom'
import TableTemplate from './TableTemplate'

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

  return <TableTemplate columns={columns} data={data} />
}

export default Employees
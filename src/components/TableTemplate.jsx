import { useEffect } from 'react'
import { useTable, useSortBy, usePagination } from 'react-table'
import PropTypes from 'prop-types'

  const TableTemplate = ({ columns, data }) => {
     const {
       getTableProps,
       getTableBodyProps,
       headerGroups,
       prepareRow,
       page,
       nextPage,
       previousPage,
       canNextPage,
       canPreviousPage,
       state: { pageIndex, pageSize, sortBy },
       setPageSize
     } = useTable(
       {
         columns,
         data,
         initialState: { pageIndex: 0, pageSize: 10, sortBy: [{ id: 'firstName', desc: false }] }
       },
       useSortBy,
       usePagination
     )

    useEffect(() => {
      if (sortBy.length > 0) {
        const sortedColumn = columns.find((column) => column.accessor === sortBy[0].id)
        if (sortedColumn) {
          document.querySelectorAll('.sorted').forEach((element) => {
            element.classList.remove('sorted')
          })

          const index = columns.findIndex((column) => column.accessor === sortBy[0].id) + 1

          const headerElements = Array.from(document.querySelectorAll('thead tr th:nth-child(' + index + ')'));
          const cellElements = Array.from(document.querySelectorAll('tbody tr td:nth-child(' + index + ')'));
          const headerAndCells = headerElements.concat(cellElements);

          console.log(headerAndCells)
          headerAndCells.forEach((element) => {
            element.classList.add('sorted')
          })
        }
      }
    }, [sortBy, columns])
    
     return (
       <div>
         <div className="entries">
            <span>Show </span>
              <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
                {[5, 10, 25, 50].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            <span> entries</span>
         </div>
         <table {...getTableProps()} className="table">
           <thead>
             {headerGroups.map(headerGroup => (
               <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                 {headerGroup.headers.map(column => (
                   <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id}>
                     {column.render('Header')}
                     <span>
                       {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                     </span>
                   </th>
                 ))}
               </tr>
             ))}
           </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()} key={row.id}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()} key={cell.column.id}>{cell.render('Cell')}</td>
                  })}
                </tr>
              )
            })}
          </tbody>

         </table>
         <div className="entries">
            <span>Showing {pageIndex * pageSize + 1} to {pageIndex * 
            pageSize + page.length} of {data.length} entries</span>
         </div>
         <div className="pagination">
           <button onClick={() => previousPage()} disabled={!canPreviousPage}>
             Previous
           </button>
           <span>
             Page{' '}
             <strong>
               {pageIndex + 1} of {Math.ceil(data.length / pageSize)}
             </strong>{' '}
           </span>
           <button onClick={() => nextPage()} disabled={!canNextPage}>
             Next
           </button>
         </div>
       </div>
     )
   }

   TableTemplate.propTypes = {
      columns: PropTypes.array.isRequired,
      data: PropTypes.array.isRequired,
    }

   export default TableTemplate
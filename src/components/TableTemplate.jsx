import { useTable, useSortBy, usePagination } from 'react-table'
import PropTypes from 'prop-types'

   const TableTemplate = ({ columns, data }) => {
     const {
       getTableProps,
       getTableBodyProps,
       headerGroups,
       page,
       nextPage,
       previousPage,
       canNextPage,
       canPreviousPage,
       state: { pageIndex }
     } = useTable(
       {
         columns,
         data,
         initialState: { pageIndex: 0 }
       },
       useSortBy,
       usePagination
     )

     return (
       <div>
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
         <div className="pagination">
           <button onClick={() => previousPage()} disabled={!canPreviousPage}>
             Previous
           </button>
           <span>
             Page{' '}
             <strong>
               {pageIndex + 1} of {page.length}
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
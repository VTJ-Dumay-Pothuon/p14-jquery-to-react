import { useEffect } from 'react'
import { useTable, useSortBy, usePagination } from 'react-table'
import PropTypes from 'prop-types'

const TableTemplate = ({columns, data}) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        gotoPage,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        state: { pageIndex, pageSize, sortBy},
        setPageSize
    } = useTable({
        columns,
        data,
        initialState: { pageIndex: 0, pageSize: 10, 
          sortBy: [{ id: 'firstName', desc: false }]
        }
    }, useSortBy, usePagination)

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
                headerAndCells.forEach((element) => {
                    element.classList.add('sorted')
                })
            }
        }
    }, [sortBy, columns])

    const hideButtons = () => {
        const buttons = document.querySelectorAll('.pagination button')
        if (buttons.length < 12) {
            buttons.forEach((button, index) => {
                button.style.display = ''
                if (index === 0) {
                    button.textContent = "Previous"
                } else if (index === buttons.length - 1) {
                    button.textContent = "Next"
                } else {
                    button.textContent = index
                    button.disabled = false
                }
            })
            return
        }
        const currentPage = document.querySelector('.page--current')
        buttons.forEach((button, index) => {
            button.style.display = ''
            if (index !== 0 && index !== 1 && button !== currentPage.previousElementSibling && button !== currentPage && button !== currentPage.nextElementSibling && index !== buttons.length - 2 && index !== buttons.length - 1) {
                button.textContent = '…'
                button.disabled = true
                if (buttons[index - 1].textContent === '…') {
                    button.style.display = 'none'
                }
            } else if (index === 0) {
                button.textContent = "Previous"
            } else if (index === buttons.length - 1) {
                button.textContent = "Next"
            } else {
                button.textContent = index
                button.disabled = false
            }
        })
    }

    useEffect(() => {
        hideButtons()
    }, [pageSize, pageIndex])

    window.addEventListener('load', () => {
        hideButtons()
        window.removeEventListener('load', () => {})
    })

    return (
        <div>
            <div className="tableHeader">
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
                <div className="search">
                  <span>Search: </span>
                  <input type="text"/>
                </div>
            </div>
            <table {...getTableProps()} className="table">
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                            {headerGroup
                                .headers
                                .map(column => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id}>
                                        {column.render('Header')}
                                        <span className='sortButton'>
                                            {column.isSorted
                                                ? (column.isSortedDesc
                                                    ? <img
                                                            src="https://img.icons8.com/ios-filled/15/7A80DD/sort-down.png"
                                                            alt="sort down"/>
                                                    : <img
                                                        src="https://img.icons8.com/ios-filled/15/DD7A7E/sort-up.png"
                                                        alt="sort up"/>)
                                                : <img src="https://img.icons8.com/ios-filled/15/DCDCDC/sort.png" alt="sort"/>}
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
                                {row
                                    .cells
                                    .map(cell => {
                                        return <td {...cell.getCellProps()} key={cell.column.id}>{cell.render('Cell')}</td>
                                    })}
                            </tr>
                        )
                    })}
                </tbody>

            </table>
            <div className="tableFooter">
                <div className="entries">
                    <span>Showing {pageIndex * pageSize + 1}
                        to {pageIndex * pageSize + page.length}
                        of {data.length}
                        entries</span>
                </div>
                <div className="pagination">
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        Previous
                    </button>
                    {Array.from({
                        length: Math.ceil(data.length / pageSize)
                    }, (_, i) => i + 1).map(buttonIndex => (
                        <button
                            key={buttonIndex}
                            id={`page-${buttonIndex}`}
                            className={pageIndex + 1 === buttonIndex
                            ? 'page--current'
                            : ''}
                            onClick={() => gotoPage(buttonIndex - 1)}>
                            {buttonIndex}
                        </button>
                    ))}
                    <button
                        onClick={() => {
                        nextPage()
                    }}
                        disabled={!canNextPage}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

TableTemplate.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired
}

export default TableTemplate
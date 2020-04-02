// TODO filter by verified and unverified
// Allow admin to change photo

import React from 'react'
import styled from 'styled-components'
import { useTable, usePagination } from 'react-table';
import { useSelector, useDispatch } from 'react-redux';
import firebase from 'firebase';
import { ToastContainer, toast } from 'react-toastify';
import { toggleVarifiedDevices } from '../../actions';

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;
    margin: auto;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }

      input {
        font-size: 1rem;
        padding: 0;
        margin: 0;
        border: 0;
      }
    }
  }

  .enlargedImage {
    position: absolute; /* or absolute */
    top: 50%;
    left: 50%;
    height: 80%;
    width: auto !important;
    transform: translate(-50%, -50%);
  }

  .deviceImage {
      cursor: pointer;
  }

  .disableClicking {
      pointer-events: none;
  }

    .enableClicking {
        pointer-events: auto;
    }

    button {
        height: 40px;
        width: 100px;
        font-size: 13px;
        margin-bottom: 10px;
        cursor: pointer;
    }

  .pagination {
    padding: 0.5rem;
  }
`
const EditableCell = ({value: initialValue, row: { index }, column: { id }, updateMyData, }) => {
    const [value, setValue] = React.useState(initialValue)

    const onChange = e => {
        if(e.target.getAttribute('fieldtype') === 'checkbox') {
            setValue(e.target.checked);
        }else {
            setValue(e.target.value)
        }
    }

    const onBlur = () => {
        updateMyData(index, id, value)
    }

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    const stockDevices = useSelector(state => state.stockDevices);
    const deviceIds = []

    stockDevices.forEach(d => {
        deviceIds.push(d.deviceId);
    })

    const enlargeImage = e => {
        const image = e.target;

        if(image.classList.contains('enlargedImage')) {
            image.classList.remove('enlargedImage');
            document.querySelector('table').classList.remove('disableClicking');
        }else {
            document.querySelector('table').classList.add('disableClicking');
            image.classList.add('enableClicking');
            image.classList.add('enlargedImage');
        }
    }

    if(value === 'true' || value === 'false' || value === true || value === false) {
        return <input type='checkbox' fieldtype='checkbox' checked={value === 'true' || value === true ? true : false} style={{width: "100px"}} onChange={onChange} onBlur={onBlur}/>
    }else if(value.toString().includes('firebasestorage.googleapis.com')) {
        return <img className='deviceImage' onClick={enlargeImage} src={value} style={{width: '100%', outline: '1px solid gray'}}></img>
    }else if(deviceIds.includes(value)) {
        return <div style={{width: "100px", wordWrap: "break-word"}}>{value}</div>
    }else {
        return <input style={{width: "100px"}} value={value} onChange={onChange} onBlur={onBlur} />
    }
}

const defaultColumn = {
    Cell: EditableCell,
}

function Table({ columns, data, updateMyData, skipPageReset }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            autoResetPage: !skipPageReset,
            updateMyData,
        },
        usePagination
    )

    return (
        <>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th style={{width: "30px"}} {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>{' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>{' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>{' '}
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
                <span>
                    | Go to page:{' '}
                    <input type="number" style={{ width: '100px' }} defaultValue={pageIndex + 1} onChange={e => {
                        const page = e.target.value ? Number(e.target.value) - 1 : 0
                        gotoPage(page)
                    }}
                    />
                </span>{' '}
                <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)) }}>
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </>
    )
}

const AdminConsoleTable = () => {
    const db = firebase.firestore();
    const stockDeviceDtaRef = db.collection('DeviceData');
    const idVerifiedOnly = useSelector(state => state.toggleVarifiedDevices);
    const stockDevices = useSelector(state => state.stockDevices);
    const dispatch = useDispatch();

    const columns = React.useMemo(
        () => [
            {
                Header: 'Device id',
                accessor: 'deviceId'
            },
            {
                Header: 'Manufacturer',
                accessor: 'manufacturer'
            },
            {
                Header: 'Device name',
                accessor: 'deviceName'
            },
            {
                Header: 'Audio outs',
                accessor: 'audio.outs'
            },
            {
                Header: 'Audio ins',
                accessor: 'audio.ins'
            },
            {
                Header: 'Midi out',
                accessor: 'midi.out'
            },
            {
                Header: 'Midi in',
                accessor: 'midi.in'
            },
            {
                Header: 'Midi thru',
                accessor: 'midi.thru'
            },
            {
                Header: 'Image url',
                accessor: 'imageUrl'
            },
            {
                Header: 'Verified',
                accessor: 'verified'
            },
        ],
        []
    )

    const [data, setData] = React.useState(() => stockDevices);
    const [originalData] = React.useState(data)
    const [skipPageReset, setSkipPageReset] = React.useState(false)

    const updateMyData = (rowIndex, columnId, value) => {
        setSkipPageReset(true)
        setData(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    }
                }
                return row
            })
        )
    }

    React.useEffect(() => {
        setSkipPageReset(false);
    }, [data])

    const notify = message => {
        toast(message);
    };

    const updatedData = () => {
        const updatedDevices = stockDevices.map((device, index) => {
            if(device !== data[index]) {
                return data[index];
            }
        });

        updatedDevices.forEach(async device => {
            if(device) {
                await stockDeviceDtaRef.doc(device.deviceId).set(formatData(device));
                notify('Devices saved');
            }
        });
    }

    const formatData = device => {
        const formattedDevice = {}
        Object.keys(device).map(key => {
            switch(key) {
                case 'midi.in':
                    device.midi.in = device[key]
                    delete device["midi.in"]
                    break;
                case 'midi.out':
                    device.midi.out = device[key]
                    delete device['midi.out']
                    break;
                case 'midi.thru':
                    device.midi.thru = device[key]
                    delete device['midi.thru']
                    break;
                case 'audio.ins':
                    device.audio.ins = device[key]
                    delete device['audio.ins']
                    break;
                case 'audio.outs':
                    device.audio.outs = device[key]
                    delete device['audio.outs']
                    break;
                default:
                    break;
            }
            if(device[key] !== undefined) {
                formattedDevice[key] = device[key];
            }
        })
        return formattedDevice
    }

    return (
        <Styles>
            <ToastContainer />
            <button onClick={updatedData}>Save devices</button>
            <Table columns={columns} data={data} updateMyData={updateMyData} skipPageReset={skipPageReset}/>
        </Styles>
    )
}

export default AdminConsoleTable

// TODO filter by verified and unverified
// Allow admin to change photo

import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import { useTable, usePagination } from 'react-table';
import { useSelector, useDispatch } from 'react-redux';
import firebase from 'firebase';
import { ToastContainer, toast } from 'react-toastify';
import { toggleVarifiedDevices, toggleEditingImage, deviceIdBeingEdited } from '../../actions';
import ChangeImage from './ChangeImage';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';

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
    height: 80%;
    width: auto !important;
  }

  .centerElement {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .spinner {
      z-index: 25;
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

    .tableButtons {
        height: 40px;
        font-size: 13px;
        margin-bottom: 10px;
        padding: 0 15px;
    }

    .tableButtonsContainer {
        display: flex;
        justify-content: space-between;
    }

    button {
        cursor: pointer;
    }

  .pagination {
    padding: 0.5rem;
  }
`
const EditableCell = ({value: initialValue, row: { index }, column: { id }, updateMyData, }) => {
    const [value, setValue] = useState(initialValue);
    const dispatch = useDispatch();

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

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    const stockDevices = useSelector(state => state.stockDevices);
    const deviceIds = []

    stockDevices.forEach(d => {
        deviceIds.push(d.deviceId);
    })

    const openImageUploadForm = e => {
        dispatch(toggleEditingImage(true));
        dispatch(deviceIdBeingEdited(e.target.parentNode.parentNode.parentNode.getAttribute('deviceid')));
    }

    const enlargeImage = e => {
        const image = e.target;

        if(image.classList.contains('enlargedImage')) {
            image.classList.remove('enlargedImage');
            image.classList.remove('centerElement');
            document.querySelector('table').classList.remove('disableClicking');
        }else {
            document.querySelector('table').classList.add('disableClicking');
            image.classList.add('enableClicking');
            image.classList.add('enlargedImage');
            image.classList.add('centerElement');
        }
    }

    if(value === 'true' || value === 'false' || value === true || value === false) {
        return <input type='checkbox' fieldtype='checkbox' checked={value === 'true' || value === true ? true : false} style={{width: "100px"}} onChange={onChange} onBlur={onBlur}/>
    }else if(value.toString().includes('firebasestorage.googleapis.com')) {
        return  <div>
                    <img className='deviceImage' onClick={enlargeImage} src={value} style={{width: '100%', outline: '1px solid gray'}}></img>
                    <button onClick={openImageUploadForm}>Change</button>
                </div>
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
                            <tr {...row.getRowProps()} deviceid={data[i].deviceId}>
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
    const userLayoutDataRef = db.collection('UserLayouts');
    const userDeviceDataRef = db.collection('UserDeviceData');
    const stockDevices = useSelector(state => state.stockDevices);
    const isImageBeingEdited = useSelector(state => state.toggleEditingImage);
    const isGettingData = useSelector(state => state.gettingData);
    const [data, setData] = useState(() => stockDevices);
    const [skipPageReset, setSkipPageReset] = useState(false);
    const [showingAll, setShowingAll] = useState(false);

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

    useEffect(() => {
        setSkipPageReset(false);
    }, [data]);

    useEffect(() => {
        setData(stockDevices);
    }, [stockDevices]);

    useEffect(() => {
        if(showingAll) {
            setData(stockDevices);
        }else {
            setData(data.filter(d => d.verified === false));
        }
    }, [showingAll]);

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

    const showAllDevices = () => {
        setShowingAll(!showingAll);
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

    const cleanLayouts = () => {
        getStockLayouts().then(stockLayoutIds => {
            getUserLayouts().then(userLayoutIds => {
                const missingLayouts = stockLayoutIds.map(id => {
                    if(!userLayoutIds.includes(id)) {
                        return id;
                    }
                }).filter(layoutId => layoutId);
                return missingLayouts;
            }).then(missingLayoutsResp => {
                missingLayoutsResp.forEach(async id => {
                    await userLayoutDataRef.doc(id).delete();
                })
            })
        });
    }

    const getStockLayouts = async () => {
        const response = await userLayoutDataRef.get();
        return response.docs.map(doc => doc.data().layoutId);
    }

    const getUserLayouts = async () => {
        let userLayoutIds = []
        const response = await userDeviceDataRef.get();
        response.docs.map(doc => {
            userLayoutIds = [...userLayoutIds, ...doc.data().layouts];
        });
        return userLayoutIds;
      }

    return (
        <Styles>
            {isGettingData ? 
                <Loader className='centerElement spinner' type="Puff" color="#00BFFF" height={100} width={100} timeout={3000}/>: null
            }
            <ToastContainer />
            <div className='tableButtonsContainer'>
                <button onClick={updatedData} className='tableButtons'>Save devices</button>
                <button onClick={showAllDevices} className='tableButtons'>
                    {!showingAll ? 
                        'Show all' : 'Show unverified'
                    }
                </button>
            </div>
            <Table columns={columns} data={data} updateMyData={updateMyData} skipPageReset={skipPageReset}/>
            {isImageBeingEdited ? 
                <ChangeImage/>: null
            }
            <button onClick={cleanLayouts}>Clean layouts</button>
        </Styles>
    )
}

export default AdminConsoleTable

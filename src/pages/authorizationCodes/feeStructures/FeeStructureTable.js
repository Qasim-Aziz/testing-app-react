/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
/* eslint-disable no-prototype-builtins */
/* eslint-disable  react/jsx-no-comment-textnodes */

import React, { useState, useEffect } from 'react'
import { Button, Input, Drawer, Select } from 'antd'
import { FilterOutlined, PlusOutlined, CloseCircleOutlined } from '@ant-design/icons'
import DataTable from 'react-data-table-component'
import { useQuery } from 'react-apollo'
import ExportData from './ExportData'
import { GET_STAFF_RATES } from './query'

const FeeStructureTable = () => {
  const [showRightDrawer, setShowRightDrawer] = useState(false)
  const [showFilterDrawer, setShowFilterDrawer] = useState(false)
  const [showForm, setShowForm] = useState('')
  // const [selectStatus, setSelectStatus] = useState('all')
  const [filterCode, setFilterCode] = useState('')
  const [filterPayor, setFilterPayor] = useState('')
  const [filteredList, setFilteredList] = useState([])
  const [staffRateList, setStaffRateList] = useState([])
  const [modifierList, setModifierList] = useState([])
  const [codeList, setCodeList] = useState([])
  const [payorList, setPayorList] = useState([])
  const [feeProfile, setFeeProfile] = useState(null)
  const { data: staffRates, loading, error } = useQuery(GET_STAFF_RATES)

  const columns = [
    // {
    //   name: 'Client Hourly',
    //   selector: 'payor.clientHourly',
    //   sortable: true,
    //   cell: row => (
    //     <Button
    //       onClick={() => info(row)}
    //       type="link"
    //       style={{ padding: '0px', fontWeight: 'bold', fontSize: '11px' }}
    //     >
    //       {row.payor?.firstname}
    //     </Button>
    //   ),
    // },
    {
      name: 'Client Hourly',
      selector: 'clientHourly',
    },
    {
      name: 'Client Mileage',
      selector: 'clientMileage',
    },
    {
      name: 'Provider Hourly',
      selector: 'providerHourly',
    },
    {
      name: 'Provider Mileage',
      selector: 'providerMileage',
    },
  ]

  const customStyles = {
    header: {
      style: {
        maxHeight: '50px',
      },
    },
    headRow: {
      style: {
        borderTopStyle: 'solid',
        borderTopWidth: '1px',
        borderTopColor: '#ddd',
        backgroundColor: '#f5f5f5',
      },
    },
    headCells: {
      style: {
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: '#ddd',
        },
        fontWeight: 'bold',
      },
    },
    cells: {
      style: {
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: '#ddd',
        },
        fontSize: '11px',
      },
    },
    pagination: {
      style: {
        position: 'absolute',
        top: '5px',
        right: '5px',
        borderTopStyle: 'none',
        minHeight: '35px',
      },
    },
    table: {
      style: {
        paddingBottom: '40px',
        top: '40px',
      },
    },
  }

  useEffect(() => {
    if (staffRates) {
      const items = staffRates.staff.map(item => {
        return item
      })
      setStaffRateList(items)
      setFilteredList(items)
    }
    // if (codes) {
    //   const nodes = codes.getAuthorizationCodes.edges.map(({ node }) => {
    //     return node
    //   })
    //   setCodeList(nodes)
    // }
    // if (payors) {
    //   const nodes = payors.getPayors.edges.map(({ node }) => {
    //     return node
    //   })
    //   setPayorList(nodes)
    // }
    // if (modifiers) {
    //   const items = modifiers.getModifierGroups.map(item => {
    //     return item
    //   })
    //   setModifierList(items)
    // }
  }, [staffRates])

  const info = e => {
    setFeeProfile(e)
    setShowForm('Edit')
    setShowRightDrawer(true)
  }

  const getFilteredList = () => {
    const filtered = filteredList
    // if (filterCode) {
    //   filtered =
    //     filtered &&
    //     filtered.filter(
    //       item => item.code && item.code.code.toLowerCase().includes(filterCode.toLowerCase()),
    //     )
    // }
    // if (filterPayor) {
    //   filtered =
    //     filtered &&
    //     filtered.filter(
    //       item =>
    //         item.payor && item.payor.firstname.toLowerCase().includes(filterPayor.toLowerCase()),
    //     )
    // }
    return filtered
  }

  const handleRightDrawerClose = () => {
    setShowRightDrawer(false)
  }

  const filterToggle = () => {
    setShowFilterDrawer(!showFilterDrawer)
  }

  const handleFilterChange = e => {
    setFilterCode(e.target.value)
  }
  // const selectCodesByStatus = value => {
  //   setSelectStatus(value)
  //   console.log('change', value)
  //   if (value === 'all') {
  //     if (feeScheduleRates) {
  //       const nodes = feeScheduleRates.getFeeScheduleRates.edges.map(({ node }) => {
  //         return node
  //       })
  //       setFilteredList(nodes)
  //     }
  //   } else if (value === 'active') {
  //     if (activeCodes) {
  //       const nodes = activeCodes.getFeeScheduleRates.edges.map(({ node }) => {
  //         return node
  //       })
  //       setFilteredList(nodes)
  //     }
  //   } else if (value === 'inActive') {
  //     if (inActiveCodes) {
  //       const nodes = inActiveCodes.getFeeScheduleRates.edges.map(({ node }) => {
  //         return node
  //       })
  //       setFilteredList(nodes)
  //     }
  //   }
  // }

  return (
    <>
      {/* <Drawer
        title={showForm === 'Add' ? 'ADD FEE SCHEDULE' : 'EDIT FEE SCHEDULE'}
        width="50%"
        placement="right"
        onClose={handleRightDrawerClose}
        visible={showRightDrawer}
      >
        {showForm === 'Add' ? (
          <AddFee
            closeDrawer={handleRightDrawerClose}
            feeScheduleRate={feeScheduleList}
            codeList={codeList}
            modifiers={modifierList}
            payorList={payorList}
          />
        ) : showForm === 'Edit' ? (
          <EditFee
            closeDrawer={handleRightDrawerClose}
            key={feeProfile?.id}
            feeProfile={feeProfile}
            codeList={codeList}
            modifiers={modifierList}
            payorList={payorList}
          />
        ) : null}
      </Drawer> */}

      <Drawer
        title="Filters"
        placement="left"
        onClose={() => setShowFilterDrawer(false)}
        visible={showFilterDrawer}
        width={300}
      >
        <div>
          {filterCode || filterPayor ? (
            <Button
              type="link"
              style={{ marginLeft: '140px' }}
              onClick={() => {
                setFilterCode('')
                setFilterPayor('')
                // setFilterBillable(null)
                // setFilterCalculationType('')
                // setFilterCodeType('')
              }}
              size="small"
            >
              Clear Filters
              <CloseCircleOutlined />
            </Button>
          ) : null}
          <div className="filter_sub_div">
            <span style={{ fontSize: '15px', color: '#000' }}>Payor:</span>
            <Select
              size="small"
              value={filterPayor}
              placeholder="Select Payor"
              onSelect={value => setFilterPayor(value)}
              style={{ width: 188 }}
            >
              <Select.Option key="" value="">
                Select Payor/Company
              </Select.Option>
              {payorList.map(item => (
                <Select.Option key={item.id} value={item.firstname}>
                  {item.firstname}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="filter_sub_div">
            <span style={{ fontSize: '15px', color: '#000' }}>Codes:</span>
            <Select
              size="small"
              value={filterCode}
              onSelect={value => setFilterCode(value)}
              style={{ width: 188 }}
            >
              <Select.Option key="" value="">
                Select Service Code
              </Select.Option>
              {codeList.map(item => (
                <Select.Option key={item.id} value={item.code}>
                  {item.code}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </Drawer>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0px 10px',
          backgroundColor: '#FFF',
          boxShadow: '0 1px 6px rgba(0,0,0,.12), 0 1px 4px rgba(0,0,0,.12)',
        }}
      >
        <div style={{ padding: '5px 0px' }}>
          <Button onClick={() => filterToggle()} size="large">
            <FilterOutlined />
          </Button>
        </div>
        {/* <Select
          style={{ width: 140, position: 'absolute', marginLeft: '60px' }}
          onChange={selectCodesByStatus}
          value={selectStatus}
        >
          <Select.Option value="all">All Codes</Select.Option>
          <Select.Option value="active">Active Codes</Select.Option>
          <Select.Option value="inActive">Inactive Codes</Select.Option>
        </Select> */}
        <div>
          <span style={{ fontSize: '25px', color: '#000' }}>Code List</span>
        </div>
        <div style={{ padding: '5px 0px' }}>
          <ExportData data={filteredList} />
          <Button
            onClick={() => {
              setShowForm('Add')
              setShowRightDrawer(true)
            }}
            type="primary"
          >
            <PlusOutlined /> ADD FEE SCHEDULE
          </Button>
        </div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
          <div className="row">
            <div className="col-sm-12">
              <div style={{ margin: '5px', marginBottom: '50px' }}>
                <DataTable
                  columns={columns}
                  theme="default"
                  dense={true}
                  pagination={true}
                  data={getFilteredList()}
                  customStyles={customStyles}
                  noHeader={true}
                  paginationRowsPerPageOptions={[10, 50, 100, 200, 500, 1000]}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default FeeStructureTable

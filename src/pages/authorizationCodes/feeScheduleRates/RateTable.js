/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
/* eslint-disable no-prototype-builtins */
/* eslint-disable  react/jsx-no-comment-textnodes */

import React, { useState, useEffect } from 'react'
import { Button, Input, Drawer, Select, Table, Row } from 'antd'
import { FilterOutlined, PlusOutlined, CloseCircleOutlined } from '@ant-design/icons'
import DataTable from 'react-data-table-component'
import { useQuery } from 'react-apollo'
import ExportData from './ExportData'
import EditFee from './EditFee'
import AddFee from './AddFee'
import EditModifier from './EditModifier'
import { GET_FEE_SCHEDULE_RATES, GET_MODIFIER_GROUPS, GET_CODES, GET_PAYORS } from './query'

const RatesTable = () => {
  const [showRightDrawer, setShowRightDrawer] = useState(false)
  const [showFilterDrawer, setShowFilterDrawer] = useState(false)
  const [showForm, setShowForm] = useState('')
  // const [selectStatus, setSelectStatus] = useState('all')
  const [filterCode, setFilterCode] = useState('')
  const [filterPayor, setFilterPayor] = useState('')
  const [filteredList, setFilteredList] = useState([])
  const [feeScheduleList, setFeeScheduleList] = useState([])
  const [modifierList, setModifierList] = useState([])
  const [codeList, setCodeList] = useState([])
  const [payorList, setPayorList] = useState([])
  const [feeProfile, setFeeProfile] = useState(null)
  const [modifierProfile, setModifierProfile] = useState(null)
  const { data: feeScheduleRates, loading, error, refetch: refetchRates } = useQuery(
    GET_FEE_SCHEDULE_RATES,
  )
  const { data: codes } = useQuery(GET_CODES)
  const { data: modifiers } = useQuery(GET_MODIFIER_GROUPS)
  const { data: payors } = useQuery(GET_PAYORS)

  const getModifiers = data => {
    const list = []
    if (data.modifierRates && data.modifierRates.edges.length > 0) {
      const subNodes = data.modifierRates.edges.map(({ node }) => {
        list.push(node.modifier.name)
        return node.modifier.name
      })
    }
    return list
  }

  const getModifierRows = data => {
    let nodes = []
    if (data.modifierRates && data.modifierRates.edges.length > 0) {
      nodes = data.modifierRates.edges.map(({ node }) => {
        // list.push(node.modifier.name)
        return node
      })
    }
    return nodes
  }

  const columns = [
    {
      name: 'Fee Schedule',
      selector: 'payor.firstname',
      sortable: true,
      cell: row => (
        <Button
          onClick={() => info(row)}
          type="link"
          style={{ padding: '0px', fontWeight: 'bold' }}
        >
          {row.payor?.firstname}
        </Button>
      ),
    },
    {
      name: 'Service code & Modifiers',
      selector: 'code.code',
      cell: row => (
        <>
          <span style={{ padding: '0px', fontWeight: 'bold' }}>{row.code?.code}</span>
          {row.code?.description}
        </>
      ),
    },

    {
      name: 'Rate',
      selector: 'rate',
      right: true,
    },
    {
      name: 'Agreed Rate',
      selector: 'agreedRate',
      right: true,
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
        fontSize: '12px',
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
    if (feeScheduleRates) {
      const nodes = feeScheduleRates.getFeeScheduleRates.edges.map(({ node }) => {
        return node
      })
      setFeeScheduleList(nodes)
      setFilteredList(nodes)
    }
    if (codes) {
      const nodes = codes.getAuthorizationCodes.edges.map(({ node }) => {
        return node
      })
      setCodeList(nodes)
    }
    if (payors) {
      const nodes = payors.getPayors.edges.map(({ node }) => {
        return node
      })
      setPayorList(nodes)
    }
    if (modifiers) {
      const items = modifiers.getModifierGroups.map(item => {
        return item
      })
      setModifierList(items)
    }
  }, [feeScheduleRates, payors, modifiers, refetchRates])

  const info = e => {
    setFeeProfile(e)
    setShowForm('Edit')
    setShowRightDrawer(true)
  }

  const modifierInfo = (e, d) => {
    setModifierProfile(e)
    setFeeProfile(d)
    setShowForm('Modifier')
    setShowRightDrawer(true)
  }

  const getFilteredList = () => {
    let filtered = filteredList
    if (filterCode) {
      filtered =
        filtered &&
        filtered.filter(
          item => item.code && item.code.code.toLowerCase().includes(filterCode.toLowerCase()),
        )
    }
    if (filterPayor) {
      filtered =
        filtered &&
        filtered.filter(
          item =>
            item.payor && item.payor.firstname.toLowerCase().includes(filterPayor.toLowerCase()),
        )
    }
    return filtered
  }

  const handleRightDrawerClose = () => {
    setShowRightDrawer(false)
    refetchRates()
    // setSelectStatus('all')
    // refetchActive()
    // refetchInactive()
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
  const ExpandedComponent = ({ data }) => {
    const modRows = getModifierRows(data)
    let dataSource = []
    let columns = []

    if (modRows.length > 0) {
      dataSource = modRows
      columns = [
        {
          key: 'Modifier Groups',
          align: 'right',
          width: 309,
          render: (value, row, index) => {
            const obj = {
              children: <span>Modifier Groups</span>,
              props: {},
            }
            if (index === 0) {
              obj.props.rowSpan = dataSource.length
            } else obj.props.colSpan = 0
            return obj
          },
        },
        {
          key: 'modifier.id',
          width: 308,
          render: (value, row, index) => {
            const obj = {
              children: (
                // <Button
                //   onClick={() => modifierInfo(row, data)}
                //   type="link"
                //   style={{ padding: '0px', fontWeight: 'bold' }}
                // >
                <span>{row.modifier.name}</span>
                // </Button>
              ),
              props: {},
            }
            return obj
          },
        },
        {
          dataIndex: 'rate',
          key: 'rate',
          align: 'right',
          width: 308,
        },
        {
          dataIndex: 'agreedRate',
          key: 'agreedRate',
          align: 'right',
        },
      ]
    }

    return (
      <Table
        dataSource={dataSource}
        columns={columns}
        bordered
        pagination={false}
        size="small"
        showHeader={false}
      />
    )
  }
  const isExpanded = row => {
    const list = getModifiers(row)
    if (list.length > 0) return true
    return false
  }

  const isDisabled = row => {
    const list = getModifiers(row)
    if (list.length > 0) return false
    return true
  }

  return (
    <>
      <Drawer
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
        ) : showForm === 'Modifier' ? (
          <EditModifier
            closeDrawer={handleRightDrawerClose}
            feeProfile={feeProfile}
            modifiers={modifierList}
            modifierProfile={modifierProfile}
          />
        ) : null}
      </Drawer>

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
              value={filterPayor === '' ? undefined : filterPayor}
              placeholder="Select Payor/Company"
              onSelect={value => setFilterPayor(value)}
              style={{ width: 188 }}
            >
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
              placeholder="Select Service Code"
              value={filterCode === '' ? undefined : filterCode}
              onSelect={value => setFilterCode(value)}
              style={{ width: 188 }}
            >
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
          <span style={{ fontSize: '25px', color: '#000' }}>Fee Schedule List</span>
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
                  expandableRows
                  expandableRowExpanded={isExpanded}
                  expandableRowDisabled={isDisabled}
                  expandableRowsComponent={<ExpandedComponent />}
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

export default RatesTable

/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-nested-ternary */

import React, { useState, useEffect } from 'react'
import { Button, Input, Drawer, Select } from 'antd'
import { FilterOutlined, PlusOutlined, CloseCircleOutlined } from '@ant-design/icons'
import DataTable from 'react-data-table-component'
import { useQuery } from 'react-apollo'
import ExportData from './ExportData'

import EditCode from './EditCode'
import AddCode from './AddCode'
import {
  GET_CODES,
  GET_ACTIVE_INACTIVE_CODES,
  GET_CODE_TYPES,
  GET_CALCULATION_TYPES,
  GET_PAYORS,
  GET_USER_ROLE,
  GET_DEFAULT_UNITS,
} from './query'

const CodesTable = () => {
  const [showRightDrawer, setShowRightDrawer] = useState(false)
  const [showFilterDrawer, setShowFilterDrawer] = useState(false)
  const [showForm, setShowForm] = useState('')
  const [selectStatus, setSelectStatus] = useState('all')
  const [filterCode, setFilterCode] = useState('')
  const [filterBillable, setFilterBillable] = useState(null)
  const [filterPayor, setFilterPayor] = useState('')
  const [filterCodeType, setFilterCodeType] = useState('')
  const [filterCalculationType, setFilterCalculationType] = useState('')
  const [filteredList, setFilteredList] = useState([])
  const [codeList, setCodeList] = useState([])
  const [codeTypeList, setCodeTypeList] = useState([])
  const [calculationTypeList, setCalculationTypeList] = useState([])
  const [payorList, setPayorList] = useState([])
  const [defaultUnitList, setDefaultUnitList] = useState([])
  const [roleList, setRoleList] = useState([])
  const [codeProfile, setCodeProfile] = useState(null)
  const { data: codes, loading, error, refetch: refetchCodes } = useQuery(GET_CODES, {
    fetchPolicy: 'network-only',
  })
  const { data: codeTypes } = useQuery(GET_CODE_TYPES)
  const { data: calculationTypes } = useQuery(GET_CALCULATION_TYPES)
  const { data: payors } = useQuery(GET_PAYORS)
  const { data: roles } = useQuery(GET_USER_ROLE)
  const { data: defaultUnits } = useQuery(GET_DEFAULT_UNITS)
  const { data: activeCodes, refetch: refetchActive } = useQuery(GET_ACTIVE_INACTIVE_CODES, {
    variables: {
      isActive: true,
    },
  })
  const { data: inActiveCodes, refetch: refetchInactive } = useQuery(GET_ACTIVE_INACTIVE_CODES, {
    variables: {
      isActive: false,
    },
  })

  const getPermissions = data => {
    const list = []
    if (data && data.edges.length > 0) {
      const nodes = data.edges.map(({ node }) => {
        list.push(node.name)
        return node
      })
    }
    return list
  }

  const columns = [
    {
      name: 'Code',
      selector: 'code',
      sortable: true,
      cell: row => (
        <Button
          onClick={() => info(row)}
          type="link"
          style={{ fontWeight: 'bold', fontSize: '11px' }}
        >
          {row.code}
        </Button>
      ),
    },
    {
      name: 'Description',
      selector: 'description',
    },
    {
      name: 'Code Type',
      selector: 'codeType.name',
    },
    {
      name: 'School',
      selector: 'school.schoolName',
    },
    {
      name: 'Payor',
      selector: 'payor.firstname',
    },
    {
      name: 'Calculation Type',
      selector: 'calculationType.name',
    },
    {
      name: 'Type',
      selector: 'billable',
      cell: row => <span>{row.billable ? 'Billable' : 'Non-billable'}</span>,
    },
    {
      name: 'Default Units',
      selector: 'defaultUnits.unit',
    },
    {
      name: 'Permissions',
      cell: row => (
        <span style={{ fontWeight: 'bold', fontSize: '11px' }}>
          {getPermissions(row.codePermission).length > 0
            ? getPermissions(row.codePermission).join(', ')
            : ''}
        </span>
      ),
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
    if (codes) {
      const nodes = codes.getAuthorizationCodes.edges.map(({ node }) => {
        return node
      })
      setCodeList(nodes)
      setFilteredList(nodes)
    }
    if (codeTypes) {
      const items = codeTypes.getAuthorizationCodeTypes.map(item => {
        return item
      })
      setCodeTypeList(items)
    }
    if (calculationTypes) {
      const items = calculationTypes.getAuthorizationCalculationTypes.map(item => {
        return item
      })
      setCalculationTypeList(items)
    }
    if (payors) {
      const nodes = payors.getPayors.edges.map(({ node }) => {
        return node
      })
      setPayorList(nodes)
    }
    if (defaultUnits) {
      const items = defaultUnits.getAuthorizationCodeUnits.map(item => {
        return item
      })
      setDefaultUnitList(items)
    }
    if (roles) {
      const items = roles.userRole.map(item => {
        return item
      })
      setRoleList(items)
    }
  }, [codes, codeTypes, calculationTypes, defaultUnits, payors, roles])

  const info = e => {
    setCodeProfile(e)
    setShowForm('Edit')
    setShowRightDrawer(true)
  }

  const getFilteredList = () => {
    let filtered = filteredList
    filtered =
      filtered &&
      filtered.filter(
        item => item.code && item.code.toLowerCase().includes(filterCode.toLowerCase()),
      )
    if (filterBillable !== null) {
      filtered = filtered && filtered.filter(item => item.billable === filterBillable)
    }
    if (filterCodeType) {
      filtered =
        filtered &&
        filtered.filter(
          item =>
            item.codeType &&
            item.codeType.name.toLowerCase().includes(filterCodeType.toLowerCase()),
        )
    }
    if (filterCalculationType) {
      filtered =
        filtered &&
        filtered.filter(
          item =>
            item.calculationType &&
            item.calculationType.name.toLowerCase().includes(filterCalculationType.toLowerCase()),
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
    setSelectStatus('all')
    refetchActive()
    refetchInactive()
    refetchCodes()
  }

  const filterToggle = () => {
    setShowFilterDrawer(!showFilterDrawer)
  }

  const handleFilterChange = e => {
    setFilterCode(e.target.value)
  }
  const selectCodesByStatus = value => {
    setSelectStatus(value)
    if (value === 'all') {
      if (codes) {
        const nodes = codes.getAuthorizationCodes.edges.map(({ node }) => {
          return node
        })
        setFilteredList(nodes)
      }
    } else if (value === 'active') {
      if (activeCodes) {
        const nodes = activeCodes.getAuthorizationCodes.edges.map(({ node }) => {
          return node
        })
        setFilteredList(nodes)
      }
    } else if (value === 'inActive') {
      if (inActiveCodes) {
        const nodes = inActiveCodes.getAuthorizationCodes.edges.map(({ node }) => {
          return node
        })
        setFilteredList(nodes)
      }
    }
  }

  return (
    <>
      <Drawer
        title={showForm === 'Add' ? 'ADD CODE' : 'EDIT CODE'}
        width="50%"
        placement="right"
        onClose={handleRightDrawerClose}
        visible={showRightDrawer}
      >
        {showForm === 'Add' ? (
          <AddCode
            closeDrawer={handleRightDrawerClose}
            codes={codeList}
            codeTypes={codeTypeList}
            calculationTypes={calculationTypeList}
            codeUnits={defaultUnitList}
            userRole={roleList}
            payorList={payorList}
          />
        ) : showForm === 'Edit' ? (
          <EditCode
            closeDrawer={handleRightDrawerClose}
            key={codeProfile?.id}
            codes={codeList}
            codeProfile={codeProfile}
            codeTypes={codeTypeList}
            calculationTypes={calculationTypeList}
            codeUnits={defaultUnitList}
            userRole={roleList}
            payorList={payorList}
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
          {filterCode ||
          filterBillable != null ||
          filterCalculationType ||
          filterCodeType ||
          filterPayor ? (
            <Button
              type="link"
              style={{ marginLeft: '140px' }}
              onClick={() => {
                setFilterCode('')
                setFilterPayor('')
                setFilterBillable(null)
                setFilterCalculationType('')
                setFilterCodeType('')
              }}
              size="small"
            >
              Clear Filters
              <CloseCircleOutlined />
            </Button>
          ) : null}
          <div className="filter_sub_div">
            <span style={{ fontSize: '15px', color: '#000' }}>Code :</span>
            <Input
              size="small"
              placeholder="Search Code"
              value={filterCode}
              onChange={handleFilterChange}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
          </div>
          <div className="filter_sub_div">
            <span style={{ fontSize: '15px', color: '#000' }}>Payor:</span>
            <Select
              size="small"
              value={filterPayor === '' ? undefined : filterPayor}
              placeholder="Select Payor"
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
            <span style={{ fontSize: '15px', color: '#000' }}>Billable :</span>
            <Select
              size="small"
              placeholder="Select Billable Type"
              value={filterBillable === null ? undefined : filterBillable}
              onSelect={value => setFilterBillable(value)}
              style={{ width: 188 }}
            >
              <Select.Option value={true}>Billable</Select.Option>
              <Select.Option value={false}>Non-Billable</Select.Option>
            </Select>
          </div>
          <div className="filter_sub_div">
            <span style={{ fontSize: '15px', color: '#000' }}>Code Types:</span>
            <Select
              size="small"
              placeholder="Select Code Type"
              value={filterCodeType === '' ? undefined : filterCodeType}
              onSelect={value => setFilterCodeType(value)}
              style={{ width: 188 }}
            >
              {codeTypeList.map(item => (
                <Select.Option key={item.id} value={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="filter_sub_div">
            <span style={{ fontSize: '15px', color: '#000' }}>Calculation Types:</span>
            <Select
              size="small"
              placeholder="Select Calculation Type"
              value={filterCalculationType === '' ? undefined : filterCalculationType}
              onSelect={value => setFilterCalculationType(value)}
              style={{ width: 188 }}
            >
              {calculationTypeList.map(item => (
                <Select.Option key={item.id} value={item.name}>
                  {item.name}
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
        <Select
          style={{ width: 140, position: 'absolute', marginLeft: '60px' }}
          onChange={selectCodesByStatus}
          value={selectStatus}
        >
          <Select.Option value="all">All Codes</Select.Option>
          <Select.Option value="active">Active Codes</Select.Option>
          <Select.Option value="inActive">Inactive Codes</Select.Option>
        </Select>
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
            <PlusOutlined /> ADD CODE
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

export default CodesTable

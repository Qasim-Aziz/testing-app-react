import { PlusOutlined } from '@ant-design/icons'
import { Button, Drawer, Radio, Table } from 'antd'
import { defaultColumnProps } from 'components/PayorsAndBilling/Common/utils'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import Highlighter from 'react-highlight-words'
import AddCode from './AddCode'
import EditCode from './EditCode'
import ExportData from './ExportData'
import {
  GET_CALCULATION_TYPES,
  GET_CODES,
  GET_CODE_TYPES,
  GET_DEFAULT_UNITS,
  GET_PAYORS,
  GET_USER_ROLE,
} from './query'

const CodesTable = () => {
  const [showRightDrawer, setShowRightDrawer] = useState(false)
  const [showForm, setShowForm] = useState('')
  const [codeList, setCodeList] = useState([])
  const [codeTypeList, setCodeTypeList] = useState([])
  const [calculationTypeList, setCalculationTypeList] = useState([])
  const [payorList, setPayorList] = useState([])
  const [defaultUnitList, setDefaultUnitList] = useState([])
  const [roleList, setRoleList] = useState([])
  const [codeProfile, setCodeProfile] = useState(null)
  const [appliedFilters, setFilters] = useState({
    isActive: ['all'],
    codePermission: ['all'],
    billable: ['all'],
  })
  const [appliedSorting, setSorting] = useState({
    order: 'descend',
    columnKey: 'code',
  })

  const { data: codes, loading, error, refetch: refetchCodes } = useQuery(GET_CODES, {
    fetchPolicy: 'network-only',
  })
  const { data: codeTypes } = useQuery(GET_CODE_TYPES)
  const { data: calculationTypes } = useQuery(GET_CALCULATION_TYPES)
  const { data: payors } = useQuery(GET_PAYORS)
  const { data: roles } = useQuery(GET_USER_ROLE)
  const { data: defaultUnits } = useQuery(GET_DEFAULT_UNITS)

  const getPermissionText = data => {
    const list = []
    if (data && data.edges.length > 0) {
      data.edges.forEach(({ node }) => {
        list.push(node.name)
        return node
      })
    }

    return list.join(', ')
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    // Handle custom filters using here
    confirm()
    setFilters({
      ...appliedFilters,
      [dataIndex]: selectedKeys[0],
    })
  }

  const handleReset = (clearFilters, dataIndex) => {
    clearFilters()
    const existingFilters = appliedFilters
    if (existingFilters[dataIndex]) delete existingFilters[dataIndex]
    setFilters(existingFilters)
  }

  const handleFilterAndSorting = (pagination, filters, sorter) => {
    setSorting(sorter)
    if (filters) {
      // Handle default filters from here
      if (filters.isActive && filters.isActive.length === 1) {
        updateFilterValues('isActive', filters.isActive[0])
      }
      if (filters.codePermission && filters.codePermission.length === 1) {
        updateFilterValues('codePermission', filters.codePermission[0])
      }
      if (filters.billable && filters.billable.length === 1) {
        updateFilterValues('billable', filters.billable[0])
      }
    }
  }

  const updateFilterValues = (columnKey, newValue) => {
    const updatedFilters = appliedFilters
    updatedFilters[columnKey] = [newValue]
    console.log('updatedFilters', updatedFilters)
    setFilters(updatedFilters)
  }

  const columnCommonProps = [appliedFilters, appliedSorting, handleSearch, handleReset]
  const columns = [
    {
      ...defaultColumnProps('Code', 'code', 'code', ...columnCommonProps),
      render: (text, row) => (
        <Button
          onClick={() => openInEditMode(row)}
          type="link"
          style={{ padding: '0px', fontWeight: 'bold', fontSize: '13px' }}
        >
          {appliedFilters.code ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[appliedFilters.code]}
              autoEscape
              textToHighlight={text}
            />
          ) : (
            text
          )}
        </Button>
      ),
    },
    {
      ...defaultColumnProps('Description', 'description', 'description', ...columnCommonProps),
    },
    {
      ...defaultColumnProps('Code Type', 'codeType.name', 'codeTypeName', ...columnCommonProps),
    },
    {
      ...defaultColumnProps('School Name', 'school.schoolName', 'schoolName', ...columnCommonProps),
    },
    {
      ...defaultColumnProps('Payor Name', 'payor.firstname', 'payorName', ...columnCommonProps),
      render: (text, row) =>
        appliedFilters.payorName ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[appliedFilters.payorName]}
            autoEscape
            textToHighlight={`${row.payor.firstname} ${row.payor.lastname ?? ''}`}
          />
        ) : (
          `${row.payor.firstname} ${row.payor.lastname ?? ''}`
        ),
    },
    {
      ...defaultColumnProps(
        'Calculation Type',
        'calculationType.name',
        'calculationTypeName',
        ...columnCommonProps,
      ),
    },
    {
      ...defaultColumnProps('Type', 'billable', 'billable', ...columnCommonProps, true),
      filterMultiple: false,
      filters: [
        {
          text: 'All',
          value: 'all',
        },
        {
          text: 'Billable',
          value: 'billable',
        },
        {
          text: 'Non-billable',
          value: 'nonbillable',
        },
      ],
      filteredValue: appliedFilters.billable || null,
      onFilter: (value, record) => {
        if (value === 'all') return true
        if (value === 'billable') return record.billable
        if (value === 'nonbillable') return !record.billable
        return false
      },
      render: isBillable => {
        const text = isBillable ? 'Billable' : 'Non-billable'
        if (appliedFilters.billable && appliedFilters.billable[0] !== 'all') {
          return (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[isBillable ? 'Billable' : 'Non-billable']}
              autoEscape
              textToHighlight={isBillable ? 'Billable' : 'Non-billable'}
            />
          )
        }
        return text
      },
    },
    {
      ...defaultColumnProps(
        'Default Units',
        'defaultUnits.unit',
        'defaultUnit',
        ...columnCommonProps,
      ),
      align: 'right',
    },
    {
      ...defaultColumnProps(
        'Permissions',
        'codePermission',
        'codePermission',
        ...columnCommonProps,
        true,
      ),
      filterMultiple: false,
      filters: [
        { text: 'All', value: 'all' },
        ...roleList.map(role => ({
          text: role.name,
          value: role.name,
        })),
      ],
      filteredValue: appliedFilters.codePermission || null,
      onFilter: (value, record) => {
        if (value === 'all') return true
        return getPermissionText(record.codePermission)
          .toUpperCase()
          .includes(value.toUpperCase())
      },
      render: text =>
        appliedFilters.codePermission ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[appliedFilters.codePermission[0]]}
            autoEscape
            textToHighlight={getPermissionText(text)}
          />
        ) : (
          getPermissionText(text)
        ),
    },
    {
      ...defaultColumnProps('Active/Inactive', 'isActive', 'isActive', ...columnCommonProps, true),
      filterMultiple: false,
      filters: [
        {
          text: 'All',
          value: 'all',
        },
        {
          text: 'Active',
          value: 'active',
        },
        {
          text: 'Inactive',
          value: 'inactive',
        },
      ],
      filteredValue: appliedFilters.isActive || null,
      onFilter: (value, record) => {
        if (value === 'all') return true
        if (value === 'active') return record.isActive
        if (value === 'inactive') return !record.isActive
        return false
      },
      render: text => (text ? 'Active' : 'Inactive'),
    },
  ]

  useEffect(() => {
    if (codes) {
      const nodes = codes.getAuthorizationCodes.edges.map(({ node }) => {
        return node
      })
      setCodeList(nodes)
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

  const openInEditMode = e => {
    setCodeProfile(e)
    setShowForm('Edit')
    setShowRightDrawer(true)
  }

  const handleRightDrawerClose = () => {
    setShowRightDrawer(false)
    refetchCodes()
  }

  const header = currentPageData => (
    <div className="header">
      <span className="pageTitle">Service Codes</span>

      <span className="filterTitle">Status:</span>
      <Radio.Group
        defaultValue="all"
        buttonStyle="solid"
        size="small"
        onChange={e => updateFilterValues('isActive', e.target.value)}
        value={
          appliedFilters.isActive && appliedFilters.isActive.length
            ? appliedFilters.isActive[0]
            : 'inactive'
        }
      >
        {['all', 'active', 'inactive'].map(status => (
          <Radio.Button key={status} value={status} style={{ textTransform: 'capitalize' }}>
            {status}
          </Radio.Button>
        ))}
      </Radio.Group>

      <span className="filterTitle">Type:</span>
      <Radio.Group
        defaultValue="all"
        buttonStyle="solid"
        size="small"
        onChange={e => updateFilterValues('billable', e.target.value)}
        value={
          appliedFilters.billable && appliedFilters.billable.length
            ? appliedFilters.billable[0]
            : 'nonbillable'
        }
      >
        {['all', 'billable', 'nonbillable'].map(value => (
          <Radio.Button key={value} value={value} style={{ textTransform: 'capitalize' }}>
            {value}
          </Radio.Button>
        ))}
      </Radio.Group>

      <span className="filterTitle">Permission:</span>
      <Radio.Group
        defaultValue="all"
        buttonStyle="solid"
        size="small"
        onChange={e => updateFilterValues('codePermission', e.target.value)}
        value={
          appliedFilters.codePermission && appliedFilters.codePermission.length
            ? appliedFilters.codePermission[0]
            : 'Technician'
        }
      >
        {[{ name: 'all' }, ...roleList].map(role => (
          <Radio.Button key={role.name} value={role.name} style={{ textTransform: 'capitalize' }}>
            {role.name}
          </Radio.Button>
        ))}
      </Radio.Group>

      <div className="right-align">
        <ExportData data={currentPageData} />
        <Button
          onClick={() => {
            setShowForm('Add')
            setShowRightDrawer(true)
          }}
          type="primary"
          size="small"
        >
          <PlusOutlined /> ADD CODE
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <Drawer
        title={showForm === 'Add' ? 'ADD CODE' : 'EDIT CODE'}
        width="65%"
        placement="right"
        onClose={handleRightDrawerClose}
        visible={showRightDrawer}
      >
        {showForm === 'Add' && (
          <AddCode
            closeDrawer={handleRightDrawerClose}
            codes={codeList}
            codeTypes={codeTypeList}
            calculationTypes={calculationTypeList}
            codeUnits={defaultUnitList}
            userRole={roleList}
            payorList={payorList}
          />
        )}
        {showForm === 'Edit' && (
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
        )}
      </Drawer>
      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
      <div style={{ margin: '5px', marginBottom: '50px' }}>
        <Table
          loading={loading}
          className="authorizeCodeTable"
          rowKey="id"
          columns={columns}
          dataSource={codeList}
          pagination={{
            position: 'both',
            showSizeChanger: true,
            pageSizeOptions: ['3', '10', '25', '50', '100'],
          }}
          size="small"
          bordered
          onChange={handleFilterAndSorting}
          title={header}
        />
      </div>
    </>
  )
}

export default CodesTable

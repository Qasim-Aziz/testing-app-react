import React, { useState, useEffect } from 'react'
import { Button, Drawer, Table, Radio } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useQuery } from 'react-apollo'
import Highlighter from 'react-highlight-words'
import _ from 'lodash'
import { defaultColumnProps, getResponsibilities } from 'components/PayorsAndBilling/Common/utils'
import Authorize from 'components/LayoutComponents/Authorize'
import ExportData from './ExportData'
import EditPayor from './EditPayor'
import AddPayor from './AddPayor'
import { GET_PAYORS, GET_CONTACT_TYPES, GET_PAYOR_PLANS } from './query'
import './style.scss'

const PayorTable = () => {
  const [showRightDrawer, setShowRightDrawer] = useState(false)
  const [showForm, setShowForm] = useState('')
  const [payorList, setPayorList] = useState([])
  const [contactTypeList, setContactTypeList] = useState([])
  const [payorPlanList, setPayorPlanList] = useState([])
  const [payorProfile, setPayorProfile] = useState(null)

  const { data: payors, loading, error, refetch: refetchPayors } = useQuery(GET_PAYORS)
  const { data: contactTypes } = useQuery(GET_CONTACT_TYPES)
  const { data: payorPlans } = useQuery(GET_PAYOR_PLANS)

  const [appliedFilters, setFilters] = useState({ isActive: ['all'], responsibility: ['All'] })
  const [appliedSorting, setSorting] = useState({
    order: 'descend',
    columnKey: 'age',
  })

  useEffect(() => {
    if (payors) {
      const nodes = payors.getPayors.edges.map(({ node }) => node)
      setPayorList(nodes)
    }
  }, [payors])

  useEffect(() => {
    if (contactTypes) {
      const items = contactTypes.getPayorContactType.map(item => item)
      setContactTypeList(items)
    }
  }, [contactTypes])

  useEffect(() => {
    if (payorPlans) {
      const nodes = payorPlans.payorPlan.edges.map(({ node }) => node)
      const sortedNodes = _.orderBy(nodes, ['company.name', 'plan'])
      setPayorPlanList(sortedNodes)
    }
  }, [payorPlans])

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
        onStatusFilterChange(filters.isActive[0])
      }
      if (filters.responsibility && filters.responsibility.length === 1) {
        onResponsibilityFilterChange(filters.responsibility[0])
      }
    }
  }

  const onStatusFilterChange = newStatus => {
    setFilters({ ...appliedFilters, isActive: [newStatus] })
  }

  const onResponsibilityFilterChange = newSelection => {
    setFilters({ ...appliedFilters, responsibility: [newSelection] })
  }

  const columnCommonProps = [appliedFilters, appliedSorting, handleSearch, handleReset]
  const antColumns = [
    {
      ...defaultColumnProps('Payor Name', 'firstname', 'firstname', ...columnCommonProps),
      render: (text, row) => (
        <Button
          onClick={() => openInEditMode(row)}
          type="link"
          style={{ padding: '0px', fontWeight: 'bold', fontSize: '13px' }}
        >
          {appliedFilters.firstname ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[appliedFilters.firstName]}
              autoEscape
              textToHighlight={`${row.firstname} ${row.lastname}`}
            />
          ) : (
            `${row.firstname} ${row.lastname}`
          )}
        </Button>
      ),
    },
    {
      ...defaultColumnProps(
        'Contact Name',
        'contactType.name',
        'contactName',
        ...columnCommonProps,
      ),
    },
    {
      ...defaultColumnProps(
        'Responsibility',
        'responsibility',
        'responsibility',
        ...columnCommonProps,
        true,
      ),
      filterMultiple: false,
      filters: getResponsibilities(true).map(item => ({
        text: item,
        value: item,
      })),
      filteredValue: appliedFilters.responsibility || null,
      onFilter: (value, record) => {
        if (value === 'All') return true
        if (value === 'N/A') return !record.responsibility
        return record.responsibility === value.toUpperCase()
      },
      render: text => (text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : 'N/A'),
    },
    {
      ...defaultColumnProps('Email', 'email', 'email', ...columnCommonProps),
    },
    {
      ...defaultColumnProps('City', 'city', 'city', ...columnCommonProps),
    },
    {
      ...defaultColumnProps('State', 'state', 'state', ...columnCommonProps),
    },
    {
      ...defaultColumnProps(
        'Primary Locatioin',
        'primaryLocation',
        'primaryLocation',
        ...columnCommonProps,
      ),
    },
    {
      ...defaultColumnProps('Home Phone', 'homePhone', 'homePhone', ...columnCommonProps),
    },
    {
      ...defaultColumnProps('Work Phone', 'workPhone', 'workPhone', ...columnCommonProps),
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

  const openInEditMode = e => {
    setPayorProfile(e)
    setShowForm('Edit')
    setShowRightDrawer(true)
  }

  const handleRightDrawerClose = () => {
    setShowRightDrawer(false)
    refetchPayors()
  }

  const header = currentPageData => (
    <div className="header">
      <span className="pageTitle">Payor List</span>

      <span className="filterTitle">Status:</span>
      <Radio.Group
        defaultValue="all"
        buttonStyle="solid"
        size="small"
        onChange={e => onStatusFilterChange(e.target.value)}
        value={appliedFilters.isActive[0]}
      >
        {['all', 'active', 'inactive'].map(status => (
          <Radio.Button key={status} value={status} style={{ textTransform: 'capitalize' }}>
            {status}
          </Radio.Button>
        ))}
      </Radio.Group>

      <span className="filterTitle">Responsibility:</span>
      <Radio.Group
        defaultValue="all"
        buttonStyle="solid"
        size="small"
        onChange={e => onResponsibilityFilterChange(e.target.value)}
        value={appliedFilters.responsibility[0]}
      >
        {getResponsibilities(true).map(value => (
          <Radio.Button key={value} value={value} style={{ textTransform: 'capitalize' }}>
            {value}
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
          <PlusOutlined /> ADD PAYOR
        </Button>
      </div>
    </div>
  )

  return (
    <Authorize roles={['school_admin']} redirect to="/dashboard/beta">
      <Drawer
        title={showForm === 'Add' ? 'ADD PAYOR' : 'EDIT PAYOR'}
        width="60%"
        placement="right"
        onClose={handleRightDrawerClose}
        visible={showRightDrawer}
        closable
        destroyOnClose
      >
        {showForm === 'Add' && (
          <AddPayor
            closeDrawer={handleRightDrawerClose}
            payors={payorList}
            contactTypes={contactTypeList}
            payorPlans={payorPlanList}
          />
        )}
        {showForm === 'Edit' && (
          <EditPayor
            closeDrawer={handleRightDrawerClose}
            key={payorProfile?.id}
            payorProfile={payorProfile}
            payors={payorList}
            contactTypes={contactTypeList}
            payorPlans={payorPlanList}
          />
        )}
      </Drawer>
      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
      <div className="row" style={{ marginTop: '30px' }}>
        <div className="col-sm-12">
          <div style={{ margin: '5px', marginBottom: '50px' }}>
            <Table
              loading={loading}
              className="payorTable"
              rowKey="id"
              columns={antColumns}
              dataSource={payorList}
              pagination={{
                position: 'top',
                showSizeChanger: true,
                pageSizeOptions: ['3', '10', '25', '50', '100'],
              }}
              size="small"
              bordered
              onChange={handleFilterAndSorting}
              title={header}
            />
          </div>
        </div>
      </div>
    </Authorize>
  )
}

export default PayorTable

import React, { useState, useEffect } from 'react'
import { Button, Drawer, Table, Radio, Input } from 'antd'
import { PlusOutlined, CloseCircleOutlined } from '@ant-design/icons'
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

const inputCustom = { width: '180px', marginBottom: '8px', display: 'block' }
const tableFilterStyles = { margin: '0px 22px 0 8px' }
const customLabel = {
  fontSize: '17px',
  color: '#000',
  marginRight: '12px',
  marginBottom: '12px',
}

const PayorTable = () => {
  const [showRightDrawer, setShowRightDrawer] = useState(false)
  const [showForm, setShowForm] = useState('')
  const [payorList, setPayorList] = useState([])
  const [mainData, setMainData] = useState([])
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

  const [filter, setFilter] = useState({
    status: '',
    name: '',
    email: '',
    phone: '',
    responsibility: '',
  })

  const [isFilterActive, setIsFilterActive] = useState(false)

  useEffect(() => {
    if (payors) {
      const nodes = payors.getPayors.edges.map(({ node }) => node)
      setPayorList(nodes)
      setMainData(nodes)
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

  useEffect(() => {
    filterHandler()
  }, [filter])

  const filterHandler = () => {
    let filteredList = mainData
    const { name, email, status, phone, responsibility } = filter

    let tempFilterActive = false
    if (name) {
      tempFilterActive = true
      filteredList =
        filteredList &&
        filteredList.filter(
          item =>
            item.firstname?.toLowerCase().includes(name.toLowerCase()) ||
            item.lastname?.toLowerCase().includes(name.toLowerCase()),
        )
    }
    if (email) {
      tempFilterActive = true
      filteredList =
        filteredList &&
        filteredList.filter(item => item.email.toLowerCase().includes(email.toLowerCase()))
    }
    if (phone) {
      tempFilterActive = true
      filteredList =
        filteredList &&
        filteredList.filter(
          item =>
            (item.homePhone && item.homePhone.toLowerCase().includes(phone.toLowerCase())) ||
            (item.workPhone && item.workPhone.toLowerCase().includes(phone.toLowerCase())),
        )
    }
    if (status) {
      tempFilterActive = true
      if (status === 'Active') {
        filteredList = filteredList && filteredList.filter(item => item.isActive === true)
      } else {
        filteredList = filteredList && filteredList.filter(item => item.isActive === false)
      }
    }
    if (responsibility) {
      tempFilterActive = true
      filteredList =
        filteredList &&
        filteredList.filter(item =>
          item.responsibility.toLowerCase().includes(responsibility.toLowerCase()),
        )
    }
    setIsFilterActive(tempFilterActive)
    setPayorList(filteredList)
  }

  const resetFilter = () => {
    setFilter({
      status: '',
      name: '',
      email: '',
      phone: '',
      responsibility: '',
    })
  }

  const columnCommonProps = [appliedFilters, appliedSorting, handleSearch, handleReset]
  const antColumns = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      render: (tt, row) => `${tt} ${row.lastname}`,
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
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Home Phone',
      dataIndex: 'homePhone',
    },
    {
      title: 'Work Phone',
      dataIndex: 'workPhone',
    },
    {
      title: 'Responsibility',
      dataIndex: 'responsibility',
      render: text => (text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : 'N/A'),
    },
    {
      title: 'Address',
      dataIndex: 'state',
      render: (text, row) => `${row.city}, ${text}`,
    },
    {
      title: 'Primary Location',
      dataIndex: 'primaryLocation',
    },
    {
      title: 'Status',
      dataIndex: 'status',
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

  const header = () => (
    <div
      className="header"
      style={{
        height: '40px',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <span>Name :</span>
        <Input
          size="small"
          name="name"
          allowClear
          placeholder="Search Name"
          onChange={e => {
            setFilter({ ...filter, name: e.target.value })
          }}
          value={filter.name}
          style={{ ...tableFilterStyles, width: '150px' }}
        />
      </span>
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <span>Email :</span>
        <Input
          size="small"
          name="phone"
          allowClear
          placeholder="Search Phone"
          onChange={e => {
            setFilter({ ...filter, email: e.target.value })
          }}
          value={filter.email}
          style={{ ...tableFilterStyles, width: '150px' }}
        />
      </span>
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <span>Phone :</span>
        <Input
          size="small"
          name="email"
          allowClear
          placeholder="Search Email"
          onChange={e => {
            setFilter({ ...filter, phone: e.target.value })
          }}
          value={filter.phone}
          style={{ ...tableFilterStyles, width: '150px' }}
        />
      </span>
      <span className="filterTitle">Status:</span>
      <Radio.Group
        defaultValue="all"
        buttonStyle="solid"
        size="small"
        onChange={e => {
          setFilter({ ...filter, status: e.target.value })
        }}
        value={filter.status}
        style={{ marginRight: '20px' }}
      >
        <Radio.Button key={1} value="">
          All
        </Radio.Button>
        <Radio.Button key={2} value="Active">
          Active
        </Radio.Button>
        <Radio.Button key={3} value="Inactive">
          Inactive
        </Radio.Button>
      </Radio.Group>

      <span className="filterTitle">Responsibility:</span>
      <Radio.Group
        defaultValue=""
        buttonStyle="solid"
        size="small"
        onChange={e => {
          setFilter({ ...filter, responsibility: e.target.value })
        }}
        value={filter.responsibility}
      >
        <Radio.Button key={1} value="">
          All
        </Radio.Button>
        <Radio.Button key={2} value="n/a">
          N/A
        </Radio.Button>
        <Radio.Button key={3} value="primary">
          Primary
        </Radio.Button>
        <Radio.Button key={4} value="secondary">
          Secondary
        </Radio.Button>
        <Radio.Button key={5} value="tertiary">
          Tertiary
        </Radio.Button>
      </Radio.Group>
    </div>
  )

  console.log(payorList, '[ayoutlsdfnsjd')
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
      <div className="row">
        <div className="right-align">
          <div style={{ width: '120px', display: 'flex' }}>
            {isFilterActive ? (
              <Button
                type="link"
                style={{ marginLeft: '10px', color: '#FEBB27', margin: 'auto' }}
                size="small"
                onClick={resetFilter}
              >
                Clear Filters
                <CloseCircleOutlined />
              </Button>
            ) : null}
          </div>
          <div>
            <ExportData data={payorList} />
            <Button
              onClick={() => {
                setShowForm('Add')
                setShowRightDrawer(true)
              }}
              type="primary"
              size="large"
            >
              <PlusOutlined /> ADD PAYOR
            </Button>
          </div>
        </div>
        <div className="col-sm-12">
          <div style={{ margin: '10px 5px 50px' }}>
            <Table
              loading={loading}
              className="payorTable"
              rowKey="id"
              columns={antColumns}
              dataSource={payorList}
              pagination={{
                position: 'bottom',
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
              }}
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

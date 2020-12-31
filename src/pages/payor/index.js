/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-nested-ternary */

import React, { useState, useEffect } from 'react'
import { Button, Input, Drawer, Select } from 'antd'
import { FilterOutlined, PlusOutlined, CloseCircleOutlined } from '@ant-design/icons'
import './style.scss'
import DataTable from 'react-data-table-component'
import { useQuery } from 'react-apollo'
import Authorize from '../../components/LayoutComponents/Authorize'
import ExportData from './ExportData'
import EditPayor from './EditPayor'
import AddPayor from './AddPayor'
import { GET_PAYORS, GET_CONTACT_TYPES, GET_ACTIVE_INACTIVE_PAYORS } from './query'

const PayorTable = () => {
  const [showRightDrawer, setShowRightDrawer] = useState(false)
  const [showFilterDrawer, setShowFilterDrawer] = useState(false)
  const [showForm, setShowForm] = useState('')
  const [selectStatus, setSelectStatus] = useState('all')
  const [filterName, setFilterName] = useState('')
  const [filterState, setFilterState] = useState('')
  const [filterCity, setFilterCity] = useState('')
  const [filteredList, setFilteredList] = useState([])
  const [payorList, setPayorList] = useState([])
  const [contactTypeList, setContactTypeList] = useState([])
  const [payorProfile, setPayorProfile] = useState(null)
  const { data: payors, loading, error, refetch: refetchPayors } = useQuery(GET_PAYORS)
  const { data: contactTypes } = useQuery(GET_CONTACT_TYPES)
  const { data: activePayors, refetch: refetchActive } = useQuery(GET_ACTIVE_INACTIVE_PAYORS, {
    variables: {
      isActive: true,
    },
  })
  const { data: inActivePayors, refetch: refetchInactive } = useQuery(GET_ACTIVE_INACTIVE_PAYORS, {
    variables: {
      isActive: false,
    },
  })

  const columns = [
    {
      name: 'Name',
      selector: 'firstname',
      sortable: true,
      cell: row => (
        <Button
          onClick={() => info(row)}
          type="link"
          style={{ padding: '0px', fontWeight: 'bold', fontSize: '11px' }}
        >
          {row.firstname} {row.lastname}
        </Button>
      ),
    },
    {
      name: 'Last Name',
      selector: 'lastname',
      sortable: true,
    },
    {
      name: 'Contact Name',
      selector: 'contactType.name',
      sortable: true,
    },
    {
      name: 'Description',
      selector: 'description',
    },
    {
      name: 'Email',
      selector: 'email',
    },
    {
      name: 'City',
      selector: 'city',
      sortable: true,
    },
    {
      name: 'State',
      selector: 'state',
      sortable: true,
    },
    {
      name: 'Primary Locatioin',
      selector: 'primaryLocation',
      sortable: true,
    },
    {
      name: 'Home Phone',
      selector: 'homePhone',
    },
    {
      name: 'Work Phone',
      selector: 'workPhone',
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
    if (payors) {
      const nodes = payors.getPayors.edges.map(({ node }) => {
        return node
      })
      setPayorList(nodes)
      setFilteredList(nodes)
    }
    if (contactTypes) {
      const items = contactTypes.getPayorContactType.map(item => {
        return item
      })
      setContactTypeList(items)
    }
  }, [payors, contactTypes])

  const info = e => {
    setPayorProfile(e)
    setShowForm('Edit')
    setShowRightDrawer(true)
  }

  const getFilteredList = () => {
    let filtered = filteredList
    filtered =
      filtered &&
      filtered.filter(
        item => item.firstname && item.firstname.toLowerCase().includes(filterName.toLowerCase()),
      )
    if (filterState) {
      filtered =
        filtered &&
        filtered.filter(
          item => item.state && item.state.toLowerCase().includes(filterState.toLowerCase()),
        )
    }
    if (filterCity) {
      filtered =
        filtered &&
        filtered.filter(
          item => item.city && item.city.toLowerCase().includes(filterCity.toLowerCase()),
        )
    }
    return filtered
  }

  const handleRightDrawerClose = () => {
    setShowRightDrawer(false)
    setSelectStatus('all')
    refetchActive()
    refetchInactive()
    refetchPayors()
  }

  const filterToggle = () => {
    setShowFilterDrawer(!showFilterDrawer)
  }

  const handleFilterNameChange = e => {
    setFilterName(e.target.value)
  }

  const handleFilterStateChange = e => {
    setFilterState(e.target.value)
  }

  const handleFilterCityChange = e => {
    setFilterCity(e.target.value)
  }

  const selectPayorsByStatus = value => {
    setSelectStatus(value)
    if (value === 'all') {
      if (payors) {
        const nodes = payors.getPayors.edges.map(({ node }) => {
          return node
        })
        setFilteredList(nodes)
      }
    } else if (value === 'active') {
      if (activePayors) {
        const nodes = activePayors.getPayors.edges.map(({ node }) => {
          return node
        })
        setFilteredList(nodes)
      }
    } else if (value === 'inActive') {
      if (inActivePayors) {
        const nodes = inActivePayors.getPayors.edges.map(({ node }) => {
          return node
        })
        setFilteredList(nodes)
      }
    }
  }

  return (
    <>
      <Authorize roles={['school_admin']} redirect to="/dashboard/beta">
        <Drawer
          title={showForm === 'Add' ? 'ADD PAYOR' : 'EDIT PAYOR'}
          width="50%"
          placement="right"
          onClose={handleRightDrawerClose}
          visible={showRightDrawer}
        >
          {showForm === 'Add' ? (
            <AddPayor
              closeDrawer={handleRightDrawerClose}
              payors={payorList}
              contactTypes={contactTypeList}
            />
          ) : showForm === 'Edit' ? (
            <EditPayor
              closeDrawer={handleRightDrawerClose}
              key={payorProfile?.id}
              payorProfile={payorProfile}
              payors={payorList}
              contactTypes={contactTypeList}
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
            {filterName || filterCity || filterState ? (
              <Button
                type="link"
                style={{ marginLeft: '140px' }}
                onClick={() => {
                  setFilterName('')
                  setFilterCity('')
                  setFilterState('')
                }}
                size="small"
              >
                Clear Filters
                <CloseCircleOutlined />
              </Button>
            ) : null}
            <div className="filter_sub_div">
              <span style={{ fontSize: '15px', color: '#000' }}>Name:</span>
              <Input
                size="small"
                placeholder="Search Name"
                value={filterName}
                onChange={handleFilterNameChange}
                style={{ width: 188, marginBottom: 8, display: 'block' }}
              />
            </div>
            <div className="filter_sub_div">
              <span style={{ fontSize: '15px', color: '#000' }}>State:</span>
              <Input
                size="small"
                placeholder="Search State"
                value={filterState}
                onChange={handleFilterStateChange}
                style={{ width: 188, marginBottom: 8, display: 'block' }}
              />
            </div>
            <div className="filter_sub_div">
              <span style={{ fontSize: '15px', color: '#000' }}>City:</span>
              <Input
                size="small"
                placeholder="Search City"
                value={filterCity}
                onChange={handleFilterCityChange}
                style={{ width: 188, marginBottom: 8, display: 'block' }}
              />
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
            onChange={selectPayorsByStatus}
            value={selectStatus}
          >
            <Select.Option value="all">All Payors</Select.Option>
            <Select.Option value="active">Active Payors</Select.Option>
            <Select.Option value="inActive">Inactive Payors</Select.Option>
          </Select>
          <div>
            <span style={{ fontSize: '25px', color: '#000' }}>Payor List</span>
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
              <PlusOutlined /> ADD PAYOR
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
      </Authorize>
    </>
  )
}

export default PayorTable

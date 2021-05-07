/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable */
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Drawer, Input, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import actionLearners from '../../redux/learners/actions'
import AddPrescription from './addPrescriptionForm'
import PrescriptionList from './prescriptionList'

const Index = props => {
  const [learnerState, setLearnerState] = useState({
    filterName: '',
    filterEmail: '',
    tableData: [],
    mainData: [],
    loadingLearners: true,
    isFilterActive: false,
    specificLearner: {},
    addPrescriptionDrawer: false,
    viewPrescriptionDrawer: false,
  })

  const learners = useSelector(state => state.learners)
  const authenticatedUser = useSelector(state => state.user)
  const dispatch = useDispatch()

  function closeAddDrawer() {
    setLearnerState({ ...learnerState, addPrescriptionDrawer: false })
  }

  useEffect(() => {
    dispatch({
      type: actionLearners.GET_DATA,
    })
  }, [])

  useEffect(() => {
    setLearnerState({
      ...learnerState,
      mainData: learners.LearnersList,
      loadingLearners: learners.loadingLearners,
      tableData: learners.LearnersList,
    })
  }, [learners])

  const setLearner = val => {
    console.log('THE ROW', val)
  }

  useEffect(() => {
    let filteredList = learnerState.mainData
    let tempFilterActive = false
    if (learnerState.filterName.length > 0) {
      tempFilterActive = true
      let name = learnerState.filterName
      filteredList =
        filteredList &&
        filteredList.filter(
          item =>
            item.firstname?.toLowerCase().includes(name.toLowerCase()) ||
            item.lastname?.toLowerCase().includes(name.toLowerCase()),
        )
    }

    if (learnerState.filterEmail.length > 0) {
      tempFilterActive = true
      let email = learnerState.filterEmail
      filteredList =
        filteredList &&
        filteredList.filter(
          item => item.email && item.email.toLowerCase().includes(email.toLowerCase()),
        )
    }

    setLearnerState({
      ...learnerState,
      tableData: filteredList,
      isFilterActive: tempFilterActive,
    })
  }, [learnerState.filterName, learnerState.filterEmail])

  console.log(learnerState, 'learner state')
  const columns = [
    {
      title: '#',
      render: row => learnerState.tableData.indexOf(row) + 1,
    },
    {
      title: 'Name',
      dataIndex: 'firstname',
      sortable: true,
      render: (text, row) => (
        <span style={{ padding: '0px', fontWeight: 'bold', fontSize: '14px' }}>
          {row.firstname} {row.lastname}
        </span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sortable: true,
      render: (text, row) => <span>{row.email ? row.email : ''}</span>,
    },
    {
      title: 'Contact No',
      dataIndex: 'mobileno',
    },
    {
      title: 'View History',
      dataIndex: 'prescriptionHistory',
      render: (text, row) => (
        <Button
          type="primary"
          onClick={() => {
            // setLearner(row)
            setLearnerState({
              ...learnerState,
              specificLearner: row,
              viewPrescriptionDrawer: true,
            })
          }}
        >
          view
        </Button>
      ),
    },
    {
      title: 'Add',
      dataIndex: 'addPrescription',
      render: (text, row) => (
        <Button
          type="primary"
          onClick={() => {
            setLearnerState({
              ...learnerState,
              specificLearner: row,
              addPrescriptionDrawer: true,
            })
          }}
        >
          ADD
          <PlusOutlined />
        </Button>
      ),
    },
  ]

  if (authenticatedUser.authorized && authenticatedUser.role === 'parents') {
    columns.pop()
  }

  const tableHeader = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        whiteSpace: 'nowrap',
        zIndex: 2,
        height: '28px',
        width: '100%',
        padding: '4px 12px',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
        <span style={{ marginRight: '7px' }}>Name :</span>
        <Input
          size="small"
          name="name"
          placeholder="Search Name"
          value={learnerState.filterName}
          onChange={e =>
            setLearnerState({
              ...learnerState,
              filterName: e.target.value,
            })
          }
          style={{ width: '180px' }} //  ...tableFilterStyles,
        />
      </span>

      <span style={{ display: 'flex', marginLeft: 20, alignItems: 'center' }}>
        <span style={{ marginRight: '7px' }}>Email :</span>
        <Input
          size="small"
          name="email"
          placeholder="Search Email"
          value={learnerState.filterEmail}
          onChange={e => setLearnerState({ ...learnerState, filterEmail: e.target.value })}
          style={{ width: '180px' }} // ...tableFilterStyles,
        />
      </span>
    </div>
  )

  return (
    <>
      <Helmet title="Prescription" />
      {console.log('SPECIFIC LEARNER', learnerState.specificLearner)}
      <Drawer
        width="80%"
        title="Add Prescription"
        closable={true}
        visible={learnerState.addPrescriptionDrawer}
        onClose={() => setLearnerState({ ...learnerState, addPrescriptionDrawer: false })}
        destroyOnClose
      >
        <AddPrescription
          setLearner={setLearner}
          details={learnerState.specificLearner}
          closeAddDrawer={closeAddDrawer}
        />
      </Drawer>
      <Drawer
        width="80%"
        title={`${learnerState?.specificLearner.firstname}'s - History Of Prescriptions`}
        closable={true}
        visible={learnerState.viewPrescriptionDrawer}
        onClose={() => setLearnerState({ ...learnerState, viewPrescriptionDrawer: false })}
        destroyOnClose
      >
        <PrescriptionList setLearner={setLearner} details={learnerState.specificLearner} />
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
          {learnerState.isFilterActive ? (
            <Button
              type="link"
              onClick={() =>
                setLearnerState({
                  ...learnerState,
                  isFilterActive: false,
                  filterName: '',
                  filterEmail: '',
                })
              }
              style={{ marginLeft: '10px', color: '#FEBB27' }}
              size="small"
            >
              Clear Filters
              <CloseCircleOutlined />
            </Button>
          ) : null}
        </div>
        <div>
          <span style={{ fontSize: '25px', color: '#000' }}>Learner's Prescription</span>
        </div>
        <div style={{ padding: '5px 0px' }}></div>
      </div>
      <div style={{ marginBottom: '50px' }}>
        <div className="view_asset">
          <Table
            title={() => {
              return tableHeader
            }}
            loading={learnerState.loadingLearners}
            columns={columns}
            rowKey={record => record.id}
            dataSource={learnerState.tableData}
          />
        </div>
      </div>
    </>
  )
}

export default Index

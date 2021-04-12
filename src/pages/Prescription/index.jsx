/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable */
import React, { useState, useEffect, useCallback } from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Button, Table, Layout, Drawer, Tabs, Input } from 'antd'
import { PlusOutlined, CloseCircleOutlined } from '@ant-design/icons'
// import Authorize from '../LayoutComponents/Authorize'
import actionLearners from '../../redux/learners/actions'
import PrescriptionList from './prescriptionList'
import AddPrescription from './addPrescriptionForm'

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
  const prescription = useSelector(state => state.prescription)
  const dispatch = useDispatch()
  console.log('THE PROPS', props)
  console.log('LEARNER REDUCER', learners)

  // const [addPrescriptionDrawer, setAddPrescriptionDrawer] = useState(false)

  useEffect(() => {
    console.log('THE USE EFFECT RAN 1')
    dispatch({
      type: actionLearners.GET_DATA, // 'learners/GET_DATA',
    })
  }, [])

  useEffect(() => {
    console.log('THE USE EFFECT RAN 2')
    setLearnerState({
      ...learnerState,
      mainData: learners.LearnersList,
      loadingLearners: learners.loadingLearners,
      tableData: learners.LearnersList,
    })
  }, [learners])
  /* To filter all the data that would be displayed inside the table */

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

  const selectSpecificLearner = data => {
    console.log('THE USER SELECTED IS', data)
    setLearnerState({ ...learnerState, specificLearner: data })
  }

  const paymentDetailsButton = (
    <Button
      style={{
        backgroundColor: '#07a7fc',
        borderColor: '#07a7fc',
        color: 'white',
        fontWeight: '5px',
      }}
      onClick={() => setAddPrescriptionDrawer(true)}
    >
      Add Prescription
    </Button>
  )

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
        <Button
          type="link"
          onClick={() => {
            // this.setState({ showProfile: true })
            // this.info(row)
            console.log('CLICKED')
          }}
          style={{ padding: '0px', fontWeight: 'bold', fontSize: '14px' }}
        >
          {row.firstname} {row.lastname}
        </Button>
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
            /** To select a specific learner */
            setLearnerState({ ...learnerState, specificLearner: row, viewPrescriptionDrawer: true })
            console.log('CLICKED')
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
        // <Authorize roles={['admin']} redirect to="/dashboard/beta">
        <Button
          type="primary"
          onClick={() => {
            setLearnerState({
              ...learnerState,
              specificLearner: row,
              addPrescriptionDrawer: true,
            })
            console.log('CLICKED')
          }}
        >
          ADD
          <PlusOutlined />
        </Button>
        // </Authorize>
      ),
    },
  ]

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
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <span>Name :</span>
        <Input
          size="default"
          name="name"
          placeholder="Search Name"
          value={learnerState.filterName}
          onChange={e =>
            // filterHandler({ name: e.target.value })
            setLearnerState({
              ...learnerState,
              filterName: e.target.value,
            })
          }
          style={{ width: '112px' }} //  ...tableFilterStyles,
        />
      </span>

      <span style={{ display: 'flex', alignItems: 'center' }}>
        <span>Email :</span>
        <Input
          size="default"
          name="email"
          placeholder="Search Email"
          value={learnerState.filterEmail}
          onChange={e => setLearnerState({ ...learnerState, filterEmail: e.target.value })}
          style={{ width: '148px' }} // ...tableFilterStyles,
        />
      </span>
    </div>
  )

  console.log('THE LEARNER STATE LOCAL', learnerState)

  return (
    <>
      <Helmet title="Prescription" />

      <Drawer
        width="90%"
        title="Add Prescription"
        closable={true}
        visible={learnerState.addPrescriptionDrawer}
        onClose={() => setLearnerState({ ...learnerState, addPrescriptionDrawer: false })}
        destroyOnClose
      >
        <AddPrescription details={learnerState.specificLearner} />
      </Drawer>

      <Drawer
        width="80%"
        title="View History Of Prescriptions"
        closable={true}
        visible={learnerState.viewPrescriptionDrawer}
        onClose={() => setLearnerState({ ...learnerState, viewPrescriptionDrawer: false })}
        destroyOnClose
      >
        <PrescriptionList details={learnerState.specificLearner} />
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
          <span style={{ fontSize: '25px', color: '#000' }}>LEARNERS PRESCRIPTIONS</span>
        </div>
        <div style={{ padding: '5px 0px' }}>
          {/* <Button onClick={this.showDrawer} type="primary">
            <PlusOutlined /> 
          </Button> */}
        </div>
      </div>
      <div style={{ marginBottom: '50px' }}>
        <div className="view_asset">
          <Table
            title={() => {
              return tableHeader
            }}
            columns={columns}
            rowKey={record => record.id}
            dataSource={learnerState.tableData}
            loading={learnerState.loading}
            // ⭐ The below commented code is for pagination from server side
            /* pagination={{
                   defaultPageSize: 20,
                   onChange: (page, rows) => this.pageChanged(page, rows),
                   onShowSizeChange: (currentPage, currentRowsPerPage) =>
                   this.rowsChanged(currentRowsPerPage, currentPage),
                   showSizeChanger: true,
                   pageSizeOptions:
                     TotalLeaders > 100
                       ? ['20', '50', '80', '100', `${TotalLeaders}`]
                       : ['20', '50', '80', '100'],
                   position: 'bottom',
                  }}
            */
          />
        </div>
      </div>
    </>
  )
}

export default Index

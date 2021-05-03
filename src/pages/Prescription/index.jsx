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
  /**the local state of the application is similar to learners but written in hooks
   * @specificLearner will determine a single user and populate the components with its prescriptions
   */

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
  /* At the initial render we get all the learners in a list */

  useEffect(() => {
    dispatch({
      type: actionLearners.GET_DATA,
    })
  }, [])

  /* Once the learners are fetched this effect will set the values */
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
    // dispatch({
    //   type: 'prescriptions/SET_SPECIFIC_LEARNER',
    //   payload: val,
    // })
  }
  /**This useEffect will filter data based on every input in name and email field on the top of the page */

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
        // Only a therapist is allowed to added prescription
        // <Authorize roles={['therapist', 'school_admin']} redirect to="/dashboard/beta">
        <Button
          type="primary"
          onClick={() => {
            setLearnerState({
              ...learnerState,
              specificLearner: row,
              addPrescriptionDrawer: true,
            })
            // setLearner(row)
          }}
        >
          ADD
          <PlusOutlined />
        </Button>
        // </Authorize>
      ),
    },
  ]

  // Check to see if the authenticated user is a therapist based on which I will display the 'ADD' column
  if (authenticatedUser.authorized && authenticatedUser.role === 'parents') {
    console.log('THE COLUMN initially', columns)
    // since the last object in columns is for adding new prescriptions I am poping it since the user isn't a therapist
    columns.pop()
    console.log('THE COLUMN finally', columns)
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
            // filterHandler({ name: e.target.value })
            setLearnerState({
              ...learnerState,
              filterName: e.target.value,
            })
          }
          style={{ width: '180px' }} //  ...tableFilterStyles,
        />
      </span>

      <span style={{ display: 'flex', alignItems: 'center' }}>
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
      {/* If someone clicks on add then this drawer will open and hydrate the latest values in a prescription of that specific learner */}
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
      {/* If user clicks on "view" then a list of prescription will be shown of that specific learner */}
      <Drawer
        width="80%"
        title="View History Of Prescriptions"
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
          <span style={{ fontSize: '25px', color: '#000' }}>LEARNERS PRESCRIPTIONS</span>
        </div>
        {/* This empty div is for supporting the above div to have the title of the page centered  */}
        <div style={{ padding: '5px 0px' }}></div>
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

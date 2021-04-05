/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Helmet } from 'react-helmet'
import {
  DropDown,
  Input,
  Button,
  Layout,
  PageHeader,
  Table,
  Drawer,
  notification,
  Popover,
  Tabs,
} from 'antd'
import moment from 'moment'
import DataTable from 'react-data-table-component'
import { PlusOutlined, MoreOutlined } from '@ant-design/icons'
import actionLearners from '../../redux/learners/actions'
import PrescriptionList from './prescriptionList'
import AddPrescription from './addPrescriptionForm'

const { Content } = Layout
const { Column } = Table
const { TabPane } = Tabs

// @connect(({ user, learners }) => ({ user, learners }))
const Index = props => {
  const [learnerState, setLearnerState] = useState({
    filterName: '',
    filterEmail: '',
    filterStatus: 'all',
    filterCategory: '',
    filterTags: '',
    realLearnerList: [],
    tableData: [],
    mainData: [],
    loadingLearners: true,
    isFilterActive: false,
  })
  const learners = useSelector(state => state.learners)
  const dispatch = useDispatch()
  console.log('THE PROPS', props)
  console.log('ALL ACTIONS', learners)

  const [addPrescriptionDrawer, setAddPrescriptionDrawer] = useState(false)

  useEffect(() => {
    dispatch({
      type: actionLearners.GET_DATA, // 'learners/GET_DATA',
    })
    setLearnerState({
      mainData: learners.LearnersList,
      loadingLearners: learners.loadingLearners,
      tableData: learners.LearnersList,
      loadingLearners: false,
    })
  }, [])

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

  return (
    <>
      <Helmet title="Prescription" />
      <Layout style={{ padding: '0px' }}>
        <Tabs tabBarExtraContent={paymentDetailsButton}>
          <TabPane tab="Prescriptions" key="Prescriptions">
            {learnerState.loadingLearners ? (
              <>LOADING</>
            ) : (
              <PrescriptionList data={learners.LearnersList} />
            )}
          </TabPane>
        </Tabs>
      </Layout>
      <Drawer
        width="80%"
        title="Add Prescription"
        closable={true}
        visible={addPrescriptionDrawer}
        onClose={() => setAddPrescriptionDrawer(false)}
        destroyOnClose
      >
        <AddPrescription setAddPrescriptionDrawer={setAddPrescriptionDrawer} />
      </Drawer>
    </>
  )
}

export default Index

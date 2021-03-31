/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-const */
/* eslint-disable object-shorthand */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable camelcase */
/* eslint-disable */

import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
// THIS IS FOR STEP PROGRESS BAR COMPONENT
import styled from 'styled-components'
// END OF IMPORTS FOR STEP PROGRESS BAR COMPONENT
import DataTable from 'react-data-table-component'
import {
  Table,
  Button,
  Card,
  Avatar,
  Select,
  Input,
  Icon,
  Drawer,
  Switch,
  Dropdown,
  Menu,
  Radio,
  Tag,
} from 'antd'
import JsPDF from 'jspdf'
// import 'jspdf-autotable'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { Scrollbars } from 'react-custom-scrollbars'
import {
  FilterOutlined,
  PlusOutlined,
  CloseCircleOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  DownOutlined,
  CloudDownloadOutlined,
} from '@ant-design/icons'
import moment from 'moment'
// import { gql } from 'apollo-boost'
// import leadClient from '../../../apollo/leads_config'
import { FilterCard } from '../../../components/FilterCard/FilterTable'
import EditBasicInformation from './EditBasicInformation'
import CreateLeader from '../createLeader'
// importing styles
import './style.scss'
import { COLORS, FORM, DRAWER } from 'assets/styles/globalStyles'

/* *************************** THE STEP PROGRESS BAR COMPONENT *************************** */

const Container = styled.div`
  display: block;
  width: 1000px;
  position: absolute;
  z-index: 1;
`
const StepWrapper = styled.ul`
  display: flex;
`

const StepElementContainer = styled.li`
  width: 20%;
  list-style-type: none;
  display: flex;
  flex-direction: column;
`

const StepElementWrapper = styled.div``

const UpperText = styled.p`
  font-size: 12px;
  position: relative;
`
const IconStepProgress = styled.div`
  font-size: 18px;
  width: 30px;
  height: 30px;
  border: 2px solid #bebebe;
  background: ${props => (props.isActive ? '#3aac5d' : 'white')};
  color: ${props => (props.isActive ? 'white' : '#bebebe')};
  border-color: ${props => (props.isActive ? '#3aac5d' : '#bebebe')};

  text-align: center;
  font-weight: bold;
  border-radius: ${props => (!props.isActive ? '50%' : '')};
`
const StepStrip = styled.div`
  background: ${props => (props.isActive ? '#3aac5d' : '#979797')};
  width: 100%;
  height: 4px;
  z-index: -1;
  bottom: 20px;
  position: relative;
`
const StepElement = ({ CustomIcon, isLast, isActive, completed }) => (
  <StepElementWrapper>
    {CustomIcon ? <CustomIcon /> : <IconStepProgress isActive={isActive}>✔</IconStepProgress>}
    {!isLast && <StepStrip isActive={isActive && completed} />}
  </StepElementWrapper>
)
class StepProgressBar extends React.Component {
  render() {
    const { statusArr, status, user_Status } = this.props
    console.log('THE PROPS IN STEP_PROGRESS_BAR COMPONENT', user_Status)
    const statusIndex = statusArr.findIndex(text => user_Status === text)
    return (
      <Container>
        <StepWrapper>
          {statusArr.map((item, i) => {
            console.log('THE INDEX FOR STEP_PROGRESS', i)
            return (
              <StepElementContainer key={i}>
                {/* <Step
                  className={i <= statusIndex ? "active" : null}
                  completed={i <= statusIndex}
                >
                  {item}
                </Step> */}
                <UpperText>{item}</UpperText>
                <StepElement
                  isLast={i === statusArr.length - 1}
                  isActive={i <= statusIndex}
                  completed={i <= statusIndex - 1}
                />
              </StepElementContainer>
            )
          })}
        </StepWrapper>
      </Container>
    )
  }
}

const statusArr = ['NEW', 'CONTACTED', 'INTRESTED', 'UNDER_REVIEW', 'DEMO', 'CONVERTED']

/* *************************** END OF STEP PROGRESS BAR COMPONENT *************************** */

const { Meta } = Card

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
      height: '40px',
      padding: '12px 8px 12px',
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
      padding: '6px 8px',
      fontSize: '12px',
    },
  },
  pagination: {
    style: {
      position: 'absolute',
      top: '-4px',
      right: '5px',
      borderTopStyle: 'none',
      minHeight: '35px',
    },
  },
  table: {
    style: {
      paddingBottom: '16px',
      top: '16px',
    },
  },
}

const customSpanStyle = {
  backgroundColor: '#52c41a',
  color: 'white',
  borderRadius: '3px',
  padding: '1px 5px',
}
const inActiveSpanStyle = {
  backgroundColor: 'red',
  color: 'white',
  borderRadius: '3px',
  padding: '1px 5px',
}
const inputCustom = { width: '180px', marginBottom: '8px', display: 'block' }
const tableFilterStyles = { margin: '0px 32px 0 8px' }
const customLabel = {
  fontSize: '17px',
  color: '#000',
  marginRight: '12px',
  marginBottom: '12px',
}

@connect(({ user, leaders }) => ({ user, leaders }))
class LeaderTable extends React.Component {
  state = {
    divShow: false,
    filterShow: false,
    isLoaded: true,
    UserProfile: null,
    realLeaderList: [],
    tableData: [],
    mainData: [],
    isFilterActive: false,
    searchText: '',
    searchedColumn: '',
    filteredInfo: null,
    filterCategory: '',
    // for create learner drawer
    visible: false,
    visibleEdit: false,
    visibleFilter: false,
    filterStatus: 'all', // 'In_progress',
    noOfRows: 10,
    filterName: '',
    filterEmail: '',
    filterProject: '', // instead of tags, we have project-name
  }

  filterRef = React.createRef()

  filterSet = {
    name: true,
    email: true,
    mobile: true,
    projectName: true, // filterProject in the local-state
    leadStatus: true,
  }

  componentDidMount() {
    console.log(`LETS SEE ALL PROPS \n `, this.props)
    console.log(`LETS SEE ALL state \n `, this.state)
    const { dispatch } = this.props
    dispatch({
      type: 'leaders/GET_DATA',
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps?.leaders !== this.props?.leaders) {
      console.log('updated Leaders', this.props.leaders.LeadersList)
      this.setState({
        mainData: this.props.leaders.LeadersList,

        tableData: this.props.leaders.LeadersList,
      })

      if (this.props.leaders.LeaderCreated === 'Created') {
        this.setState({
          visible: false,
        })
      }
    }
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
    })
  }

  info = e => {
    const { dispatch } = this.props
    // setting leader id to local storage for further operations
    localStorage.setItem('LeadId', JSON.stringify(e.id))

    dispatch({
      type: 'leaders/SET_STATE',
      payload: {
        UserProfile: e,
        isUserProfile: true,
      },
    })
    this.setState({
      divShow: true,
    })
    this.showEditDrawer()
  }

  // DRAWER FOR EDITING
  showEditDrawer = () => {
    this.setState({
      visibleEdit: true,
    })
  }

  onCloseEdit = () => {
    this.setState({
      visibleEdit: false,
    })
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    })
  }

  onClose = () => {
    this.setState({
      visible: false,
    })
  }

  // Lead Status
  selectActiveStatus = value => {
    const {
      dispatch,
      leaders: { ItemPerPage },
    } = this.props
    let isActive = null

    if (value === 'all') isActive = true
    if (value === 'In_progress') isActive = null
    if (value === 'Converted') isActive = null
    if (value === 'Not_converted') isActive = null
    if (value === 'Contact_Later') isActive = null

    dispatch({
      type: 'leaders/SET_STATE',
      payload: {
        CurrentStatus: value,
      },
    })

    dispatch({
      type: 'leaders/GET_LEADERS',
      payload: {
        isActive,
        first: ItemPerPage,
        after: null,
        before: null,
      },
    })
  }

  // DRAWER FOR FILTER

  showDrawerFilter = () => {
    this.setState({
      visibleFilter: true,
    })
  }

  onCloseFilter = () => {
    this.setState({
      visibleFilter: false,
    })
  }

  filterHandler = ({ name, email, mobile, gender, caseMngr, address, tags }) => {
    let filteredList = this.state.mainData
    let tempFilterActive = false
    console.log('Leader filter', name, email)
    if (!name && !email && !mobile && !gender && !caseMngr && !address) {
      tempFilterActive = false
    }
    if (name) {
      tempFilterActive = true
      console.log('THE filteredList', filteredList)
      filteredList =
        filteredList &&
        filteredList.filter(item => {
          console.log('WHAT ITEMS', item)
          return (
            // item.name?.toLowerCase().includes(name.toLowerCase()) ||
            item.user.firstName?.toLowerCase().includes(name.toLowerCase()) ||
            item.user.lastname?.toLowerCase().includes(name.toLowerCase())
          )
        })
    }
    if (email) {
      tempFilterActive = true
      filteredList =
        filteredList &&
        filteredList.filter(
          item => item.user.email && item.user.email.toLowerCase().includes(email.toLowerCase()),
        )
    }
    this.setState({
      tableData: filteredList,
      isFilterActive: tempFilterActive,
    })
  }

  clearFilter = () => {
    this.filterHandler({
      name: '',
      email: '',
      projectName: '',
      leadStatus: 'all',
    })
    this.selectActiveStatus('all')
  }

  render() {
    console.log('THE PROPS IN LEADERS initially (render) \n', this.props)
    console.log('THE STATE IN LEADERS initially (render) \n', this.state)
    let { filteredInfo, visibleFilter, realLearnerList } = this.state

    filteredInfo = filteredInfo || {}
    const {
      leaders: { loading, LeadersList, isUserProfile, UserProfile, TotalLeaders, loadingLeaders },
    } = this.props

    let filteredList = this.state.tableData
    console.log('FILTEREDLIST', filteredList)

    // ************************ WORK ON THIS ************************ //
    if (this.state.filterStatus) {
      console.log('FILTER+STATUS', this.state.filterStatus)
      /** Instead of changing the state I will store the value of state in a local-variable */
      let local_status = this.state.filterStatus
      if (local_status === 'all') {
        // this.state.filterStatus = ''
        local_status = ''
      }

      filteredList =
        filteredList &&
        filteredList.filter(item => {
          // console.log('Filtering by lead-status', item)
          return (
            item.leadStatus && item.leadStatus.toLowerCase().includes(local_status.toLowerCase())
          )
        })
    }
    /* These are css classes that will get triggered according to the state-changes */

    const { divShow, filterShow } = this.state
    const divClass = divShow ? 'col-sm-12' : 'col-sm-12'
    const detailsDiv = divShow ? { display: 'block', paddingLeft: '0' } : { display: 'none' }

    const columns = [
      {
        title: 'Name',
        // selector: 'name',
        sortable: true,

        render: row => {
          console.log('ROW', row)
          row.user === null ? <span> </span> : <></>

          return (
            <Button
              onClick={() => this.info(row)} // this.info(row)
              type="link"
              style={{ padding: '0px', fontWeight: 'bold', fontSize: '11px' }}
            >
              {/* {console.log('THE NAMES', row.user.firstName)} */}
              {/* {console.log('THE NAMES', row.user.lastname)} */}
              {row.user.firstName} {row.user.lastName}
            </Button>
          )
        },
      },
      {
        title: 'Email',
        // selector: 'email',

        sortable: true,
        render: row => {
          // console.log('ROW', row)
          if (row.user === null) {
            return <span> </span>
          }
          // console.log('ROW', row.user.email)
          return <span>{row.user.email ? row.user.email : ''} </span>
        },
      },
      {
        title: 'Mobile',
        // selector: 'mobile',

        render: row => {
          // console.log('ROW', row)
          if (row.phone === null) {
            return <span> </span>
          }
          // console.log('ROW', row.phone)
          return <span>{row.phone ? row.phone : ''} </span>
        },
      },
      {
        title: 'project Name',
        // selector: 'projectName',

        render: row => <span>{row.projectName ? row.projectName : ''} </span>,
      },
      {
        title: 'Lead Status',
        // selector: 'leadStatus',

        render: row => <span>{row.leadStatus ? row.leadStatus : ''}</span>,
      },
      {
        title: 'Created At',
        // selector: 'createdAt',

        render: row => {
          return <span>{row.createdAt ? new Date(row.createdAt).toDateString() : ''} </span>
        },
      },
    ]

    const exportPDF = () => {
      console.log('PRINT TO PDF FUNCTIONALITY')
    }

    const exportToCSV = () => {
      console.log('PRINT TO EXCEL SHEET FUNCTIONALITY')
    }

    const menu = (
      <Menu>
        <Menu.Item key="0">
          <Button onClick={() => exportPDF()} type="link" size="small">
            PDF
          </Button>
        </Menu.Item>
        <Menu.Item key="1">
          <Button onClick={() => exportToCSV()} type="link" size="small">
            CSV/Excel
          </Button>
        </Menu.Item>
      </Menu>
    )

    // The headers for table headers
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
        {/* Search bar for name */}
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span>Name :</span>
          <Input
            size="small"
            name="name"
            placeholder="Search Name"
            value={this.state.filterName}
            onChange={e => {
              this.setState({
                filterName: e.target.value,
                isFilterActive: e.target.value && true,
              })
              this.filterHandler({ name: e.target.value })
            }}
            style={{ ...tableFilterStyles, width: '112px' }}
          />
        </span>
        {/* Search bar for email */}
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span>Email :</span>
          <Input
            size="small"
            name="name"
            placeholder="Search Email"
            value={this.state.filterEmail}
            onChange={e => {
              this.setState({
                filterEmail: e.target.value,
                isFilterActive: e.target.value && true,
              })
              this.filterHandler({ email: e.target.value })
            }}
            style={{ ...tableFilterStyles, width: '148px' }}
          />
        </span>
        {/* Search bar for project */}
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span>project :</span>
          <Input
            size="small"
            name="name"
            placeholder="Search Project"
            value={this.state.filterProject}
            onChange={e => {
              this.setState({
                filterProject: e.target.value,
                isFilterActive: e.target.value && true,
              })
              this.filterHandler({ email: e.target.value })
            }}
            style={{ ...tableFilterStyles, width: '148px' }}
          />
        </span>
        {/* Different kinds of status */}
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span>STATUS :</span>
          <Select
            placeholder="Status"
            // allowClear
            value={this.state.filterStatus}
            onChange={e => {
              console.log('-----------------------------------------------', e)
              this.selectActiveStatus(e)
              this.setState({ filterStatus: e, isFilterActive: true })
            }}
            style={inputCustom} // {{ width: '120px' }}
          >
            <Select.Option value="NEW">NEW</Select.Option>
            <Select.Option value="CONTACTED">CONTACTED</Select.Option>
            <Select.Option value="INTRESTED">INTRESTED</Select.Option>
            <Select.Option value="DEMO">DEMO</Select.Option>
            <Select.Option value="CONVERTED">CONVERTED</Select.Option>
          </Select>
        </span>
      </div>
    )

    // THE PROPS FOR STEP PROGRESS BAR
    let drawdownStatus = 'NEW'
    let disbursementStatus = 'UNDER_REVIEW'
    let stepProgressProps = {
      statusArr,
      status: disbursementStatus || drawdownStatus,
    }

    console.log(`LETS SEE ALL PROPS at the end render \n `, this.props)
    console.log(`LETS SEE ALL state at the end render \n `, this.state)

    return (
      <>
        {console.log(`LETS SEE ALL PROPS \n `, this.props)}
        {console.log(`LETS SEE ALL state \n `, this.state)}
        <Helmet title="Leaders" />

        {/* DRAWER FOR Create-lEADER  */}
        <Drawer
          title="CREATE LEADER"
          // "75%"
          width={this.state.windowWidth > 1250 ? DRAWER.widthL1 : DRAWER.widthL4}
          placement="right"
          closable={true}
          onClose={this.onClose}
          visible={this.state.visible}
          // headerStyle={{alignItems:"center"}}
        >
          <CreateLeader CloseDrawer={this.onClose} />
        </Drawer>
        {/* END OF DRAWER FOR CREATE-LEADER */}

        {/* DRAWER FOR EDIT-LEADER */}
        <Drawer
          title="EDIT LEADER"
          // "80%"
          width={DRAWER.widthL1}
          placement="right"
          closable={true}
          onClose={this.onCloseEdit}
          visible={this.state.visibleEdit}
        >
          {/* Once the drawer is visible the "UserProfile"(defined in the local-state)
              will set with the details of that particular leader.
              • And the form values will be set to that user's details
          */}
          {UserProfile ? (
            <div className="card" style={{ marginTop: '5px', border: 'none' }}>
              <div className="card-body">
                {/* <h2>hello {UserProfile.leadStatus}</h2> */}
                {/* THE Step progress bar */}
                <div
                  className="step-progress"
                  style={{ padding: '2rems', marginBottom: '5px', fontWeight: 'bold' }}
                >
                  {console.log('THE STATUS ARRAY', stepProgressProps)}
                  {/* {(stepProgressProps.status = UserProfile.leadStatus)} */}
                  <StepProgressBar {...stepProgressProps} user_Status={UserProfile.leadStatus} />
                </div>
                {/* End of step progress bar */}
                <div id="basic_form_div" style={{ marginTop: '100px' }}>
                  {isUserProfile ? <EditBasicInformation key={UserProfile.id} /> : null}
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
        </Drawer>
        {/* END OF DRAWER FOR EDIT-LEADER */}

        {/* ***************** DIV FOR TOP_BAR ***************** */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0px 10px',
            marginTop: '20px',
            backgroundColor: '#FFF',
            boxShadow: '0 1px 6px rgba(0,0,0,.12), 0 1px 4px rgba(0,0,0,.12)',
          }}
        >
          {/* Div is used to position the stuff inside it on the left-side  */}
          <div style={{ padding: '5px 0px' }}>
            {/* The below section is when someone adds filters a clear-filter button gets displayed */}
            {this.state.isFilterActive ? (
              <Button
                type="link"
                onClick={() => {
                  this.filterRef.current ? this.filterRef.current.clearFilter() : this.clearFilter()
                  this.setState({
                    isFilterActive: false,
                    filterStatus: 'all',
                    filterCategory: '',
                    filterName: '',
                    filterEmail: '',
                  })
                }}
                style={{ marginLeft: '10px', color: '#FEBB27' }}
                size="small"
              >
                Clear Filters
                <CloseCircleOutlined />
              </Button>
            ) : null}
          </div>
          {/* On the top you can see the Title of page */}
          <div>
            <span style={{ fontSize: '25px', color: '#000' }}>Leaders List</span>
          </div>
          {/* This div comprise of downloading stuff & button on the top right */}
          <div style={{ padding: '5px 0px' }}>
            {/* This is the blue button to the right-side of add Learners to download table in pdf or excel form */}
            <Dropdown overlay={menu} trigger={['click']}>
              <Button style={{ marginRight: '10px' }} type="link">
                <CloudDownloadOutlined />{' '}
              </Button>
            </Dropdown>
            {/* This is the blue button to add Learners */}
            <Button onClick={this.showDrawer} type="primary">
              <PlusOutlined /> ADD LEADER
            </Button>
          </div>
        </div>
        {/* ********************** END of DIV FOR TOP_BAR***************** */}
        <div className={divClass}>
          <div style={{ marginTop: '24px', marginBottom: '50px' }}>
            {/* ************* DIV FOR filtering ************ */}
            {/* <div
              style={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                whiteSpace: 'nowrap',
                zIndex: 2,
                width: 'fit-content',
                paddingTop: '4px',
              }}
            > */}
            {/* Search bar for name */}
            {/* <span style={{ display: 'flex', alignItems: 'center' }}>
                <span>Name :</span>
                <Input
                  size="small"
                  name="name"
                  placeholder="Search Name"
                  value={this.state.filterName}
                  onChange={e => {
                    this.setState({
                      filterName: e.target.value,
                      isFilterActive: e.target.value && true,
                    })
                    this.filterHandler({ name: e.target.value })
                  }}
                  style={{ ...tableFilterStyles, width: '112px' }}
                />
              </span> */}
            {/* Search bar for email */}
            {/* <span style={{ display: 'flex', alignItems: 'center' }}>
                <span>Email :</span>
                <Input
                  size="small"
                  name="name"
                  placeholder="Search Email"
                  value={this.state.filterEmail}
                  onChange={e => {
                    this.setState({
                      filterEmail: e.target.value,
                      isFilterActive: e.target.value && true,
                    })
                    this.filterHandler({ email: e.target.value })
                  }}
                  style={{ ...tableFilterStyles, width: '148px' }}
                />
              </span> */}
            {/* Search bar for project */}
            {/* <span style={{ display: 'flex', alignItems: 'center' }}>
                <span>project :</span>
                <Input
                  size="small"
                  name="name"
                  placeholder="Search Project"
                  value={this.state.filterProject}
                  onChange={e => {
                    this.setState({
                      filterProject: e.target.value,
                      isFilterActive: e.target.value && true,
                    })
                    this.filterHandler({ email: e.target.value })
                  }}
                  style={{ ...tableFilterStyles, width: '148px' }}
                />
              </span> */}
            {/* Different kinds of status */}
            {/* <span style={{ display: 'flex', alignItems: 'center' }}>
                <span>STATUS :</span>
                <Select
                  placeholder="Status"
                  // allowClear
                  value={this.state.filterStatus}
                  onChange={e => {
                    console.log('-----------------------------------------------', e)
                    this.selectActiveStatus(e)
                    this.setState({ filterStatus: e, isFilterActive: true })
                  }}
                  style={inputCustom} // {{ width: '120px' }}
                >
                  <Select.Option value="NEW">NEW</Select.Option>
                  <Select.Option value="CONTACTED">CONTACTED</Select.Option>
                  <Select.Option value="INTRESTED">INTRESTED</Select.Option>
                  <Select.Option value="DEMO">DEMO</Select.Option>
                  <Select.Option value="CONVERTED">CONVERTED</Select.Option>
                </Select>
              </span> */}
            {/* </div> */}
            {/* ************* END OF DIV FOR filtering ************ */}
            {/* ************* DIV FOR DATA-TABLE ************ */}
            <div>
              <div style={{ marginBottom: '50px' }}>
                {/* Filters */}
                <div className="view_learner">
                  <Table
                    title={() => {
                      return tableHeader
                    }}
                    columns={columns}
                    rowKey={record => record.id}
                    dataSource={filteredList}
                    loading={loadingLeaders} // this.state.loadingLeaders
                    pagination={{
                      defaultPageSize: 20,
                      // onChange: (page, rows) => this.pageChanged(page, rows),
                      // onShowSizeChange: (currentPage, currentRowsPerPage) =>
                      // this.rowsChanged(currentRowsPerPage, currentPage),
                      showSizeChanger: true,
                      pageSizeOptions:
                        TotalLeaders > 100
                          ? ['20', '50', '80', '100', `${TotalLeaders}`]
                          : ['20', '50', '80', '100'],
                      position: 'bottom',
                    }}
                  />
                </div>
              </div>
            </div>
            {/* <div className="modify-data-table">
              <DataTable
                title="Leaders List"
                columns={columns}
                theme="default"
                dense={true}
                key="id"
                keyField="id"
                pagination={true}
                data={filteredList}
                customStyles={customStyles}
                noHeader={true}
                progressPending={loadingLeaders}
                // paginationServer={true}
                // paginationTotalRows={TotalLeaders}
                // onChangePage={(page, rows) => this.pageChanged(page, rows)}
                paginationServerOptions={{
                  persistSelectedOnPageChange: false,
                  persistSelectedOnSort: false,
                }}
                // onChangeRowsPerPage={(currentRowsPerPage, currentPage) =>
                //   this.rowsChanged(currentRowsPerPage, currentPage)
                // }
                // paginationRowsPerPageOptions={
                //   TotalLeaders > 100 ? [10, 20, 50, 80, 100, TotalLeaders] : [10, 20, 50, 80, 100]
                // }
                currentPage={2}
              />
            </div> */}
            {/* ************* END OF DIV FOR DATA-TABLE ************ */}
          </div>
        </div>
      </>
    )
  }
}

export default LeaderTable

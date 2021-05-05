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
import styled from 'styled-components'
import DataTable from 'react-data-table-component'
import { Button, Card, Select, Input, Drawer, Dropdown, Menu } from 'antd'
import JsPDF from 'jspdf'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import {
  PlusOutlined,
  CloseCircleOutlined,
  CommentOutlined,
  CloudDownloadOutlined,
} from '@ant-design/icons'
import moment from 'moment'
import EditBasicInformation from './EditBasicInformation'
import CreateLeader from '../createLeader'
import LeadCommentTimeline from '../LeadCommentTimeline'
import './style.scss'
import { COLORS, DRAWER } from '../../../assets/styles/globalStyles'

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
      backgroundColor: COLORS.palleteLightBlue,
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

const tableFilterStyles = { margin: '0px 32px 0 8px' }
@connect(({ user, leaders, staffs }) => ({ user, leaders, staffs }))
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
    visible: false,
    visibleEdit: false,
    visibleFilter: false,
    filterStatus: 'all', // 'In_progress',
    noOfRows: 10,
    filterName: '',
    filterEmail: '',
    filterProject: '', // instead of tags, we have project-name
    commentDrawer: false,
    updateLead: null,
    leadStatus: '',
    name: '',
    projectName: '',
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
    const { dispatch } = this.props
    dispatch({
      type: 'leaders/GET_DATA',
    })

    if (this.props.staffs.StaffList.length === 0) {
      dispatch({
        type: 'staffs/GET_STAFFS',
        payload: {
          isActive: true,
        },
      })
    }
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

  filterHandler = ({ name, email, mobile, gender, caseMngr, address, projectName, status }) => {
    let filteredList = this.state.mainData
    let tempFilterActive = false
    console.log('Leader filter', status)
    if (!name && !email && !mobile && !gender && !caseMngr && !address && !projectName) {
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
            item.name?.toLowerCase().includes(name.toLowerCase()) ||
            item.surname?.toLowerCase().includes(name.toLowerCase())
          )
        })
    }
    if (email) {
      tempFilterActive = true
      filteredList =
        filteredList &&
        filteredList.filter(
          item => item.email && item.email.toLowerCase().includes(email.toLowerCase()),
        )
    }
    if (projectName) {
      tempFilterActive = true
      filteredList =
        filteredList &&
        filteredList.filter(item => {
          console.log('project items', item)
          return item.projectName?.toLowerCase().includes(projectName.toLowerCase())
        })
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
    let { filteredInfo, visibleFilter, realLearnerList } = this.state

    filteredInfo = filteredInfo || {}
    const {
      leaders: { loading, LeadersList, isUserProfile, UserProfile, TotalLeaders, loadingLeaders },
    } = this.props

    let filteredList = this.state.tableData

    if (this.state.filterStatus) {
      let local_status = this.state.filterStatus
      if (local_status === 'all') {
        local_status = ''
      }

      filteredList =
        filteredList &&
        filteredList.filter(item => {
          return (
            item.leadStatus && item.leadStatus.toLowerCase().includes(local_status.toLowerCase())
          )
        })
    }

    const { divShow, filterShow } = this.state
    const divClass = divShow ? 'col-sm-12' : 'col-sm-12'
    const detailsDiv = divShow ? { display: 'block', paddingLeft: '0' } : { display: 'none' }

    const columns = [
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        cell: row => {
          row.user === null ? <span> </span> : <></>
          return (
            <Button
              onClick={() => this.info(row)} // this.info(row)
              type="link"
              style={{ padding: '0px', fontWeight: 'bold', fontSize: '11px' }}
            >
              {row.name} {row.surname}
            </Button>
          )
        },
      },
      {
        name: 'Email',
        selector: 'email',
        // maxWidth: '120px',
        cell: row => {
          if (row.user === null) {
            return <span> </span>
          }
          return <span>{row.email ? row.email : ''} </span>
        },
      },
      {
        name: 'Mobile',
        selector: 'mobile',
        cell: row => {
          if (row.phone === null) {
            return <span> </span>
          }
          // console.log('ROW', row.phone)
          return <span>{row.phone ? row.phone : ''} </span>
        },
      },
      {
        name: 'Project Name',
        selector: 'projectName',
        // maxWidth: '120px',
        cell: row => <span>{row.projectName ? row.projectName : ''} </span>,
      },
      {
        name: 'Lead Status',
        selector: 'leadStatus',
        // maxWidth: '120px',
        cell: row => <span>{row.leadStatus ? row.leadStatus : ''}</span>,
      },
      {
        name: 'Created At',
        selector: 'createdAt',
        // maxWidth: '120px',
        cell: row => {
          return <span>{row.createdAt ? new Date(row.createdAt).toDateString() : ''} </span>
        },
      },
      {
        name: 'Action',
        maxWidth: '90px',
        cell: data => {
          return (
            <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-start' }}>
              <CommentOutlined
                style={{ color: COLORS.palleteDarkBlue, fontSize: 24, paddingRight: '.9em' }}
                onClick={() => {
                  this.setState({
                    commentDrawer: true,
                    updateLead: data.id,
                    leadStatus: data.leadStatus,
                    projectName: data.projectName,
                    name: data.name,
                  })
                  console.log(data)
                }}
                type="link"
              />
            </div>
          )
        },
      },
    ]

    const exportPDF = () => {
      const unit = 'pt'
      const size = 'A4' // Use A1, A2, A3 or A4
      const orientation = 'landscape' // portrait or landscape
      const lineHeight = 6
      const doc = new JsPDF(orientation, unit, size, lineHeight)

      doc.setFontSize(20)

      const title = 'Leads List'
      const headers = [['Name', 'Email', 'Mobile', 'Project Name', 'Lead Status', 'Created At']]

      const data = this.state.tableData.map(e => [
        e.name,
        e.email ? e.email : '',
        e.phone,
        e.projectName,
        e.leadStatus,
        e.createdAt ? new Date(e.createdAt).toDateString() : '',
      ])

      let content = {
        startY: 20,
        head: headers,
        body: data,
      }

      doc
        .text(title, 420, 15, 'center')
        .setFontSize(40)
        .setLineHeightFactor(6)
      doc.autoTable(content)
      doc.save('leads.pdf')
    }

    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'

    const exportToCSV = () => {
      const filename = 'leads_excel'
      let formattedData = this.state.tableData.map(function(e) {
        return {
          Name: e.name,
          Email: e.email ? e.email : '',
          Mobile: e.phone,
          ProjectName: e.projectName,
          LeadStatus: e.leadStatus,
          CreatedAt: e.createdAt ? new Date(e.createdAt).toDateString() : '',
        }
      })

      const ws = XLSX.utils.json_to_sheet(formattedData)
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const data = new Blob([excelBuffer], { type: fileType })
      FileSaver.saveAs(data, filename + fileExtension)
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

    let drawdownStatus = 'NEW'
    let disbursementStatus = 'UNDER_REVIEW'
    let stepProgressProps = {
      statusArr,
      status: disbursementStatus || drawdownStatus,
    }

    console.log(this.props, 'props')
    return (
      <>
        <Helmet title="Leaders" />
        <Drawer
          title="CREATE LEAD"
          width={DRAWER.widthL2}
          placement="right"
          closable={true}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <CreateLeader CloseDrawer={this.onClose} />
        </Drawer>
        <Drawer
          title="EDIT LEAD"
          width={DRAWER.widthL2}
          placement="right"
          closable={true}
          onClose={this.onCloseEdit}
          visible={this.state.visibleEdit}
        >
          {UserProfile ? (
            <div className="card" style={{ marginTop: '5px', border: 'none' }}>
              <div className="card-body">
                <div
                  className="step-progress"
                  style={{ padding: '2rems', marginBottom: '5px', fontWeight: 'bold' }}
                >
                  {console.log('THE STATUS ARRAY', stepProgressProps)}
                  <StepProgressBar {...stepProgressProps} user_Status={UserProfile.leadStatus} />
                </div>
                <div id="basic_form_div" style={{ marginTop: '100px' }}>
                  {isUserProfile ? (
                    <EditBasicInformation key={UserProfile.id} onCloseEdit={this.onCloseEdit} />
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
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
          <div>
            <span style={{ fontSize: '25px', color: '#000' }}>Leads List</span>
          </div>
          <div style={{ padding: '5px 0px' }}>
            <Dropdown overlay={menu} trigger={['click']}>
              <Button style={{ marginRight: '10px' }} type="link">
                <CloudDownloadOutlined />{' '}
              </Button>
            </Dropdown>
            <Button onClick={this.showDrawer} type="primary">
              <PlusOutlined /> ADD LEAD
            </Button>
          </div>
        </div>
        <div className={divClass}>
          <div style={{ marginTop: '24px', marginBottom: '50px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                whiteSpace: 'nowrap',
                zIndex: 2,
                width: 'fit-content',
                paddingTop: '4px',
              }}
            >
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
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span>Project :</span>
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
                    this.filterHandler({ projectName: e.target.value })
                  }}
                  style={{ ...tableFilterStyles, width: '148px' }}
                />
              </span>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span>Status :</span>

                <Select
                  placeholder="Status"
                  size="small"
                  allowClear
                  value={this.state.filterStatus}
                  onChange={e => {
                    this.selectActiveStatus(e)
                    this.setState({ filterStatus: e, isFilterActive: true })
                    this.filterHandler({ status: e })
                  }}
                  style={{ ...tableFilterStyles, width: '120px' }}
                >
                  <Select.Option value="NEW">NEW</Select.Option>
                  <Select.Option value="CONTACTED">CONTACTED</Select.Option>
                  <Select.Option value="INTRESTED">INTRESTED</Select.Option>
                  <Select.Option value="DEMO">DEMO</Select.Option>
                  <Select.Option value="CONVERTED">CONVERTED</Select.Option>
                </Select>
              </span>
            </div>
            <div className="modify-data-table">
              <DataTable
                title="Leaders List"
                className="dataTablee"
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
                paginationServerOptions={{
                  persistSelectedOnPageChange: false,
                  persistSelectedOnSort: false,
                }}
                currentPage={2}
              />
            </div>
          </div>
        </div>
        <Drawer
          visible={this.state.commentDrawer}
          onClose={() => this.setState({ commentDrawer: false })}
          title="Timeline"
          width="50%"
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              background: '#fff',
              padding: 30,
              paddingTop: 0,
            }}
          >
            <LeadCommentTimeline
              updateLeadId={this.state.updateLead}
              leadStatus={this.state.leadStatus}
              name={this.state.name}
              projectName={this.state.projectName}
            />
          </div>
        </Drawer>
      </>
    )
  }
}

export default LeaderTable

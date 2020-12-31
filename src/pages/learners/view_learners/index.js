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
/* eslint-disable react/jsx-boolean-value */
import React from 'react'
import { Helmet } from 'react-helmet'
import Highlighter from 'react-highlight-words'
import {
  Table,
  Button,
  Collapse,
  Card,
  Avatar,
  Form,
  Select,
  DatePicker,
  Input,
  Icon,
  Drawer,
  Switch,
  Dropdown,
  Menu,
} from 'antd'
import DataTable from 'react-data-table-component'
import JsPDF from 'jspdf'
import 'jspdf-autotable'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import Authorize from 'components/LayoutComponents/Authorize'
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
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import EditBasicInformation from './EditBasicInformation'
import CreateLearner from '../createLearner'
import client from '../../../apollo/config'

import './style.scss'

const { Panel } = Collapse
const { Meta } = Card
const { Search } = Input
const { RangePicker } = DatePicker

const GET_LEARNERS = gql`
  query getLearners(
    $isActive: Boolean
    $first: Int
  ){
    students(isActive: $isActive, first: $first) {
      pageInfo{
        startCursor
        endCursor
      }
      clinicTotal
      edges {
        node {
          id
          firstname
          email
          dob
          mobileno
          lastname
          gender
          currentAddress
          clientId
          ssnAadhar
          parentMobile
          parentName
          dateOfDiagnosis
          category {
            id
            category
          }
          clinicLocation {
            id
            location
          }
          caseManager {
            id
            name
          }
          language {
            id
            name
          }
          authStaff {
            edges {
              node {
                id
                name
                surname
              }
            }
          }
          isActive
        }
      }
    }
  }
`

@connect(({ user, learners }) => ({ user, learners }))
class LearnerTable extends React.Component {
  state = {
    divShow: false,
    filterShow: false,
    isLoaded: true,
    UserProfile: null,
    realLearnerList: [],
    searchText: '',
    searchedColumn: '',
    filteredInfo: null,
    // for create learner drawer
    visible: false,
    visibleEdit: false,
    visibleFilter: false,
    filterName: '',
    filterCaseManager: '',
    filterGender: '',
    filterCategory: '',
    filterLocation: '',
    filterStatus: 'all',
    noOfRows: 10,
  }

  componentDidMount() {
    const { dispatch } = this.props
    // this.selectActiveStatus('active')
    dispatch({
      type: 'learners/GET_DATA',
    })
    dispatch({
      type: 'learners/GET_LEARNERS_DROPDOWNS',
    })
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
    })
  }

  info = e => {
    const { dispatch } = this.props
    // setting student id to local storage for further operations
    localStorage.setItem('studentId', JSON.stringify(e.id))
    console.log('asd')
    console.log(e)
    dispatch({
      type: 'learners/SET_STATE',
      payload: {
        UserProfile: e,
        isUserProfile: true,
      },
    })
    // this.setState({
    //   divShow: true,
    // })
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

  selectActiveStatus = value => {
    const {dispatch, learners: {ItemPerPage}} = this.props
    let isActive = null

    if (value === 'all') isActive = null
    if (value === 'active') isActive = true
    if (value === 'in-active') isActive = false

    dispatch({
      type: 'learners/SET_STATE',
      payload: {
        CurrentStatus: value
      }
    })

    dispatch({
      type: 'learners/GET_LEARNERS',
      payload: {
        isActive,
        first: ItemPerPage,
        after: null,
        before: null
      }
    })


  }

  selectDateRange = value => {
    const start = new Date(value[0]).toISOString().slice(0, 10)
    const end = new Date(value[1]).toISOString().slice(0, 10)

    client
      .query({
        query: gql`{students(createdAt_Lte: "${end}",createdAt_Gte: "${start}",) {edges {node {id,firstname,email,dob,mobileno,category{id, category,},}}}}`,
      })
      .then(result => {
        this.setState({
          LearnersList: result.data.students.edges,
          realLearnerList: [],
        })
      })
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),

    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select())
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
          text
        ),
  })

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    })
  }

  handleReset = clearFilters => {
    clearFilters()
    this.setState({ searchText: '' })
  }

  learnerActiveInactive = checked => {
    const {
      dispatch,
      learners: { UserProfile },
    } = this.props
    console.log(UserProfile.id, checked)

    dispatch({
      type: 'learners/LEARNER_ACTIVE_INACTIVE',
      payload: {
        id: UserProfile.id,
        checked: checked,
      },
    })
  }

  showProgram = obj => {
    console.log('===> studnet selected')
    localStorage.setItem('studentId', JSON.stringify(obj?.id))
    window.location.href = '/#/therapistStudent'

    const { dispatch } = this.props

    dispatch({
      type: 'learnersprogram/SET_STATE',
      payload: {
        TabCheck: 'Goals',
      },
    })
  }

  showAssessments = obj => {
    console.log('===> studnet selected')
    localStorage.setItem('studentId', JSON.stringify(obj?.id))
    window.location.href = '/#/therapistStudent'

    const { dispatch } = this.props

    dispatch({
      type: 'learnersprogram/SET_STATE',
      payload: {
        TabCheck: 'Assessments',
      },
    })
  }

  showSession = obj => {
    console.log('===> studnet selected')
    localStorage.setItem('studentId', JSON.stringify(obj?.id))
    window.location.href = '/#/therapistStudent'

    const { dispatch } = this.props

    dispatch({
      type: 'learnersprogram/SET_STATE',
      payload: {
        TabCheck: 'Sessions',
      },
    })
  }

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

  pageChanged = (page, rows) => {
    console.log(page, rows)

    const {dispatch, learners: {ItemPerPage, CurrentStatus}} = this.props
    dispatch({
      type: 'learners/PAGE_CHANGED',
      payload: {
        page,
        rows
      }
    })
  }

  rowsChanged = (currentRowsPerPage, currentPage) => {
    console.log(currentRowsPerPage, currentPage)
    const {dispatch, learners: {ItemPerPage, CurrentStatus}} = this.props
    dispatch({
      type: 'learners/ROWS_CHANGED',
      payload: {
        currentRowsPerPage,
        currentPage
      }
    })
  }

  filterToggle(toggle) {
    if (toggle) {
      this.setState({
        filterShow: false,
      })
    } else {
      this.setState({
        filterShow: true,
      })
    }
  }

  render() {
    let { filteredInfo, visibleFilter, realLearnerList } = this.state

    filteredInfo = filteredInfo || {}
    const {
      learners: { loading, LearnersList, isUserProfile, UserProfile, TotalLearners, loadingLearners },
    } = this.props

    let filteredList = LearnersList

    filteredList =
      filteredList &&
      filteredList.filter(
        item =>
          item.firstname &&
          item.firstname.toLowerCase().includes(this.state.filterName.toLowerCase()),
      )

    if (this.state.filterCaseManager) {
      filteredList =
        filteredList &&
        filteredList.filter(
          item =>
            item.caseManager &&
            item.caseManager.name
              .toLowerCase()
              .includes(this.state.filterCaseManager.toLowerCase()),
        )
    }
    if (this.state.filterGender) {
      filteredList =
        filteredList &&
        filteredList.filter(
          item =>
            item.gender && item.gender.toLowerCase() === this.state.filterGender.toLowerCase(),
        )
    }
    if (this.state.filterCategory) {
      filteredList =
        filteredList &&
        filteredList.filter(
          item =>
            item.category &&
            item.category.category.toLowerCase().includes(this.state.filterCategory.toLowerCase()),
        )
    }
    if (this.state.filterLocation) {
      filteredList =
        filteredList &&
        filteredList.filter(
          item =>
            item.clinicLocation &&
            item.clinicLocation.location
              .toLowerCase()
              .includes(this.state.filterLocation.toLowerCase()),
        )
    }

    let categories = LearnersList.reduce(function (sum, current) {
      return sum.concat(current.category ? current.category : [])
    }, [])

    let categoriesGrouped = categories.reduce(function (groups, item) {
      const val = item.category
      groups.includes(val) ? null : groups.push(val)
      return groups
    }, [])

    let locations = LearnersList.reduce(function (sum, current) {
      return sum.concat(current.clinicLocation ? current.clinicLocation : [])
    }, [])

    let locationsGrouped = locations.reduce(function (groups, item) {
      const val = item.location
      groups.includes(val) ? null : groups.push(val)
      return groups
    }, [])

    if (loading) {
      return <div>Loading...</div>
    }

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

    const columns = [
      {
        name: 'Name',
        selector: 'firstname',
        sortable: true,
        minWidth: '120px',
        maxWidth: '120px',
        cell: row => (
          <Button
            onClick={() => this.info(row)}
            type="link"
            style={{ padding: '0px', fontWeight: 'bold', fontSize: '11px' }}
          >
            {row.firstname} {row.lastname}
          </Button>
        ),
      },
      {
        name: 'Assessments',
        ignoreRowClick: true,
        button: true,
        maxWidth: '80px',
        minWidth: '80px',
        cell: obj => (
          <span>
            <Button
              onClick={() => this.showAssessments(obj)}
              style={{ padding: '0px', color: '#0190fe', border: 'none', fontSize: '11px' }}
            >
              Assessments
            </Button>
          </span>
        ),
      },
      {
        name: 'Program',
        ignoreRowClick: true,
        button: true,
        maxWidth: '80px',
        minWidth: '80px',
        cell: obj => (
          <span>
            <Button
              onClick={() => this.showProgram(obj)}
              style={{ padding: '0px', color: '#0190fe', border: 'none', fontSize: '11px' }}
            >
              Program
            </Button>
          </span>
        ),
      },
      {
        name: 'Session',
        ignoreRowClick: true,
        button: true,
        maxWidth: '80px',
        minWidth: '80px',
        cell: obj => (
          <span>
            <Button
              onClick={() => this.showSession(obj)}
              style={{ padding: '0px', color: '#0190fe', border: 'none', fontSize: '11px' }}
            >
              Session
            </Button>
          </span>
        ),
      },

      {
        name: 'Date of Birth',
        selector: 'dob',
        sortable: true,
        maxWidth: '100px',
      },
      {
        name: 'Email',
        selector: 'email',
        sortable: true,
        maxWidth: '140px',
        minWidth: '140px',
      },

      {
        name: 'Contact No',
        selector: 'mobileno',
        maxWidth: '100px',
        cell: row => (
          <Button style={{ padding: '0px', color: '#0190fe', border: 'none', fontSize: '11px' }}>
            {row.mobileno}
          </Button>
        ),
      },
      {
        name: 'Language',
        selector: 'language',
        cell: row => <span>{row.language ? row.language.name : ''}</span>,
        maxWidth: '80px',
        minWidth: '80px',
      },
      {
        name: 'Case Manager',
        selector: 'caseManager',
        cell: row => <span>{row.caseManager ? row.caseManager.name : ''}</span>,
        maxWidth: '100px',
      },
      {
        name: 'Client Id',
        selector: 'clientId',
        maxWidth: '80px',
        minWidth: '80px',
      },
      {
        name: 'Gender',
        selector: 'gender',
        maxWidth: '80px',
        minWidth: '80px',
      },
      {
        name: 'Category',
        selector: 'category',
        maxWidth: '100px',
        cell: row => <span>{row.category?.category}</span>,
      },
      {
        name: 'Address',
        selector: 'currentAddress',
        maxWidth: '100px',
      },
      {
        name: 'Clinic Location',
        selector: 'clinicLocation',
        cell: row => <span>{row.clinicLocation ? row.clinicLocation.location : ''}</span>,
        maxWidth: '100px',
      },
    ]

    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'

    const exportToCSV = () => {
      const filename = 'learners_excel'
      let formattedData = filteredList.map(function (e) {
        return {
          Name: e.firstname,
          Surname: e.lastname,
          DateOfBirth: e.dob,
          Email: e.email,
          ContactNo: e.mobileno,
          Language: e.language?.name,
          CaseManager: e.caseManager ? e.caseManager.name : '',
          ClientID: e.clientId,
          Gender: e.gender,
          Category: e.category ? e.category.category : '',
          Address: e.currentAddress,
          ClinicLocation: e.clinicLocation?.location,
        }
      })

      const ws = XLSX.utils.json_to_sheet(formattedData)
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const data = new Blob([excelBuffer], { type: fileType })
      FileSaver.saveAs(data, filename + fileExtension)
    }

    const { divShow, filterShow } = this.state
    const divClass = divShow ? 'col-sm-12' : 'col-sm-12'
    const detailsDiv = divShow ? { display: 'block', paddingLeft: '0' } : { display: 'none' }
    const filterDiv = filterShow
      ? {
        display: 'block',
        padding: '0',
        marginBottom: '0',
        backgroundColor: 'inherit',
      }
      : { display: 'none' }

    const filterOptionStyle = { display: 'inline-block', marginRight: '10px' }
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

    const exportPDF = () => {
      const unit = 'pt'
      const size = 'A4' // Use A1, A2, A3 or A4
      const orientation = 'landscape' // portrait or landscape

      const doc = new JsPDF(orientation, unit, size)

      doc.setFontSize(10)

      const title = 'Learners List'
      const headers = [
        [
          'Name',
          'Surname',
          'Date of Birth',
          'Email',
          'Contact No',
          'Language',
          'Case Manager',
          'Client Id',
          'Gender',
          'Category',
          'Address',
          'Clinic Location',
        ],
      ]

      const data = filteredList.map(e => [
        e.firstname,
        e.lastname,
        e.dob,
        e.email,
        e.mobileno,
        e.language?.name,
        e.caseManager ? e.caseManager.name : '',
        e.clientId,
        e.gender,
        e.category.category,
        e.currentAddress,
        e.clinicLocation ? e.clinicLocation.location : '',
      ])

      let content = {
        startY: 50,
        head: headers,
        body: data,
      }

      doc.text(title, 10, 10)
      doc.autoTable(content)
      doc.save('learners.pdf')
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

    return (
      <Authorize roles={['school_admin', 'therapist']} redirect to="/dashboard/beta">
        <Helmet title="Partner" />
        <Drawer
          title="Filters"
          placement="left"
          closable={true}
          onClose={this.onCloseFilter}
          visible={visibleFilter}
          width={300}
        >
          <div>
            <div className="filter_sub_div">
              <span style={{ fontSize: '15px', color: '#000' }}>Name :</span>
              <Input
                size="small"
                placeholder="Search Name"
                value={this.state.filterName}
                onChange={e => this.setState({ filterName: e.target.value })}
                style={{ width: 188, marginBottom: 8, display: 'block' }}
              />
            </div>
            <div className="filter_sub_div">
              <span style={{ fontSize: '15px', color: '#000' }}>Case Manager :</span>
              <Input
                size="small"
                placeholder="Search Case Manager"
                value={this.state.filterCaseManager}
                onChange={e => this.setState({ filterCaseManager: e.target.value })}
                style={{ width: 188, marginBottom: 8, display: 'block' }}
              />
            </div>
            <div className="filter_sub_div">
              <span style={{ fontSize: '15px', color: '#000' }}>Gender :</span>
              <Select
                size="small"
                value={this.state.filterGender}
                onSelect={value => this.setState({ filterGender: value })}
                style={{ width: 188 }}
              >
                <Select.Option value="">Select Gender</Select.Option>
                <Select.Option value="male">Male</Select.Option>
                <Select.Option value="female">Female</Select.Option>
              </Select>
            </div>

            <div className="filter_sub_div">
              <span style={{ fontSize: '15px', color: '#000' }}>Category :</span>

              <Select
                size="small"
                value={this.state.filterCategory}
                onSelect={value => this.setState({ filterCategory: value })}
                style={{ width: 188 }}
              >
                <Select.Option value="">Select Category</Select.Option>
                {categoriesGrouped.map((i, index) => {
                  return <Select.Option value={i}>{i}</Select.Option>
                })}
              </Select>
            </div>

            <div className="filter_sub_div">
              <span style={{ fontSize: '15px', color: '#000' }}>Location :</span>

              <Select
                size="small"
                value={this.state.filterLocation}
                onSelect={value => this.setState({ filterLocation: value })}
                style={{ width: 188 }}
              >
                <Select.Option value="">Select Location</Select.Option>
                {locationsGrouped.map((i, index) => {
                  return <Select.Option value={i}>{i}</Select.Option>
                })}
              </Select>
            </div>

            <div className="filter_sub_div">
              <span style={{ fontSize: '15px', color: '#000' }}>Status :</span>
              <Select
                size="small"
                value={this.state.filterStatus}
                onSelect={value => {
                  this.selectActiveStatus(value)
                  this.setState({ filterStatus: value })
                }}
                style={{ width: 188 }}
              >
                <Select.Option value="all">All</Select.Option>
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="in-active">In-Active</Select.Option>
              </Select>
            </div>
          </div>
        </Drawer>

        <Drawer
          title="CREATE LEARNER"
          width="75%"
          placement="right"
          closable={true}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <CreateLearner CloseDrawer={this.onClose} />
        </Drawer>

        <Drawer
          title="EDIT LEARNER"
          width="75%"
          placement="right"
          closable={true}
          onClose={this.onCloseEdit}
          visible={this.state.visibleEdit}
        >
          {UserProfile ? (
            <div className="card" style={{ marginTop: '5px', border: 'none' }}>
              <div className="card-body">
                <div className="table-operations" style={{ marginBottom: '16px' }}>
                  <Button
                    style={{
                      marginRight: '-12px',
                      float: 'right',
                      border: 'none',
                      padding: 'none',
                    }}
                    onClick={() => this.onCloseEdit()}
                  >
                    X
                  </Button>
                </div>
                <div>
                  <Card
                    style={{
                      textAlign: 'center',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Meta
                      avatar={
                        <Avatar
                          src="https://www.thewodge.com/wp-content/uploads/2019/11/avatar-icon.png"
                          style={{
                            width: '100px',
                            height: '100px',
                            border: '1px solid #f6f7fb',
                          }}
                        />
                      }
                      title={
                        <h5 style={{ marginTop: '20px' }}>
                          {UserProfile ? UserProfile.firstname : ''}
                          <span
                            style={{
                              float: 'right',
                              fontSize: '12px',
                              padding: '5px',
                              color: '#0190fe',
                            }}
                          >
                            {UserProfile.isActive === true ? (
                              <Switch
                                checkedChildren={<Icon type="check" />}
                                unCheckedChildren={<Icon type="close" />}
                                defaultChecked
                                onChange={this.learnerActiveInactive}
                              />
                            ) : (
                                <Switch
                                  checkedChildren={<Icon type="check" />}
                                  unCheckedChildren={<Icon type="close" />}
                                  onChange={this.learnerActiveInactive}
                                />
                              )}
                          </span>
                          {/* <span style={{float: 'right', fontSize: '12px', padding: '5px',}}>
                            <a style={{ color: '#0190fe' }}>Edit</a>
                          </span> */}
                        </h5>
                      }
                      description={
                        <div>
                          <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                            Enrollment Status &nbsp;{' '}
                            {UserProfile.isActive ? (
                              <span style={customSpanStyle}>Active</span>
                            ) : (
                                <span style={inActiveSpanStyle}>In-Active</span>
                              )}
                          </p>
                          {/* <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                              Intake Form Status <span style={customSpanStyle}>Active</span>
                            </p>
                            <p style={{ fontSize: '13px', marginBottom: '0' }}>
                              Date of Start 01/01/2020
                            </p> */}
                        </div>
                      }
                    />
                  </Card>
                  {isUserProfile ? (
                    <EditBasicInformation key={UserProfile.id} />
                  ) : (
                      // <Collapse defaultActiveKey="1" accordion bordered={false}>
                      //   <Panel header="Basic Details" key="1">
                      //     <EditBasicInformation key={UserProfile.id} />
                      //   </Panel>
                      //   <Panel header="Insurance Details" key="2">
                      //     <EditInsuranceForm />
                      //   </Panel>
                      //   <Panel header="Health Details" key="3">
                      //     <EditHealthForm />
                      //   </Panel>
                      //   <Panel header="Intake Form" key="4">
                      //     <EditIntakeForm />
                      //   </Panel>
                      // </Collapse>
                      ''
                    )}
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
            <Button onClick={() => this.showDrawerFilter()} size="large">
              <FilterOutlined />
            </Button>

            {this.state.filterName ||
              this.state.filterCaseManager ||
              this.state.filterGender ||
              this.state.filterCategory ||
              this.state.filterLocation ? (
                <Button
                  type="link"
                  style={{ marginLeft: '10px', color: '#FEBB27' }}
                  onClick={() =>
                    this.setState({
                      filterName: '',
                      filterCaseManager: '',
                      filterGender: '',
                      filterCategory: '',
                      filterLocation: '',
                    })
                  }
                  size="small"
                >
                  Clear Filters
                <CloseCircleOutlined />
                </Button>
              ) : null}
          </div>
          <div>
            <span style={{ fontSize: '25px', color: '#000' }}>Learners List</span>
          </div>
          <div style={{ padding: '5px 0px' }}>
            <Dropdown overlay={menu} trigger={['click']}>
              <Button style={{ marginRight: '10px' }} type="link" size="large">
                <CloudDownloadOutlined />{' '}
              </Button>
            </Dropdown>

            <Button onClick={this.showDrawer} type="primary">
              <PlusOutlined /> ADD LEARNER
            </Button>
          </div>
        </div>

        <div className="row">
          <div className={divClass}>
            <div style={{ margin: '5px', marginBottom: '50px' }}>
              <DataTable
                title="Learners List"
                columns={columns}
                theme="default"
                dense={true}
                pagination={true}
                data={filteredList}
                customStyles={customStyles}
                noHeader={true}
                
                progressPending={loadingLearners}
                paginationServer={true}
                paginationTotalRows={TotalLearners}
                onChangePage={(page, rows) => this.pageChanged(page, rows)}
                paginationServerOptions={{
                  persistSelectedOnPageChange:false, 
                  persistSelectedOnSort: false 
                }}
                onChangeRowsPerPage={(currentRowsPerPage, currentPage) => this.rowsChanged(currentRowsPerPage, currentPage)}
                paginationRowsPerPageOptions={[10, 20, 50, 80, 100, 200, 500]}
                // currentPage={2}

              />
            </div>
          </div>

          <div className="col-sm-4" style={detailsDiv}>
            {UserProfile ? (
              <Scrollbars key={UserProfile.id} style={{ height: 650 }}>
                <div
                  className="card"
                  style={{ marginTop: '5px', minHeight: '600px', border: '1px solid #f4f6f8' }}
                >
                  <div className="card-body">
                    <div className="table-operations" style={{ marginBottom: '16px' }}>
                      <Button
                        style={{
                          marginRight: '-12px',
                          float: 'right',
                          border: 'none',
                          padding: 'none',
                        }}
                        onClick={() => this.setState({ divShow: false })}
                      >
                        X
                      </Button>
                    </div>
                    <div>
                      <Card style={{ marginTop: '26px', border: 'none' }}>
                        <Meta
                          avatar={
                            <Avatar
                              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                              style={{
                                width: '100px',
                                height: '100px',
                                border: '1px solid #f6f7fb',
                              }}
                            />
                          }
                          title={
                            <h5 style={{ marginTop: '20px' }}>
                              {UserProfile ? UserProfile.firstname : ''}
                              <span
                                style={{
                                  float: 'right',
                                  fontSize: '12px',
                                  padding: '5px',
                                  color: '#0190fe',
                                }}
                              >
                                {UserProfile.isActive === true ? (
                                  <Switch
                                    checkedChildren={<Icon type="check" />}
                                    unCheckedChildren={<Icon type="close" />}
                                    defaultChecked
                                    onChange={this.learnerActiveInactive}
                                  />
                                ) : (
                                    <Switch
                                      checkedChildren={<Icon type="check" />}
                                      unCheckedChildren={<Icon type="close" />}
                                      onChange={this.learnerActiveInactive}
                                    />
                                  )}
                              </span>
                              {/* <span style={{float: 'right', fontSize: '12px', padding: '5px',}}>
                              <a style={{ color: '#0190fe' }}>Edit</a>
                            </span> */}
                            </h5>
                          }
                          description={
                            <div>
                              <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                                Enrollment Status &nbsp;{' '}
                                {UserProfile.isActive ? (
                                  <span style={customSpanStyle}>Active</span>
                                ) : (
                                    <span style={inActiveSpanStyle}>In-Active</span>
                                  )}
                              </p>
                              {/* <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                                Intake Form Status <span style={customSpanStyle}>Active</span>
                              </p>
                              <p style={{ fontSize: '13px', marginBottom: '0' }}>
                                Date of Start 01/01/2020
                              </p> */}
                            </div>
                          }
                        />
                      </Card>
                      {isUserProfile && (
                        <EditBasicInformation key={UserProfile.id} />
                      )}
                    </div>
                  </div>
                </div>
              </Scrollbars>
            ) : (
                ''
              )}
          </div>
        </div>
      </Authorize>
    )
  }
}

export default LearnerTable

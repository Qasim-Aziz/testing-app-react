/* eslint-disable no-unneeded-ternary */
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
/* eslint-disable */
import React, { useRef } from 'react'
import { Helmet } from 'react-helmet'
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
  Popconfirm,
  Menu,
  Radio,
  Tag,
} from 'antd'
import {
  FilterOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  CloudDownloadOutlined,
  PlusOutlined,
  MoreOutlined,
} from '@ant-design/icons'
import JsPDF from 'jspdf'
import 'jspdf-autotable'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import Authorize from 'components/LayoutComponents/Authorize'
import moment from 'moment'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import { FilterCard } from '../../../components/FilterCard/FilterTable'
import EditBasicInformation from './EditBasicInformation'
import CreateLearner from '../createLearner'
import client from '../../../apollo/config'
import '../style.scss'
import Profile from '../Profile'
import { COLORS, FORM, DRAWER } from 'assets/styles/globalStyles'

const { Meta } = Card
const inputCustom = { width: '180px', marginBottom: '8px', display: 'block' }
const tableFilterStyles = { margin: '0px 28px 0 6px' }
const customLabel = {
  fontSize: '17px',
  color: '#000',
  marginRight: '12px',
  marginBottom: '12px',
}

@connect(({ user, learners }) => ({ user, learners }))
class LearnerTable extends React.Component {
  state = {
    divShow: false,
    filterShow: false,
    showProfile: false,
    isLoaded: true,
    UserProfile: null,
    realLearnerList: [],
    tableData: [],
    mainData: [],
    loadingLearners: true,
    isFilterActive: false,
    searchText: '',
    searchedColumn: '',
    filteredInfo: null,
    // for create learner drawer
    visible: false,
    visibleEdit: false,
    visibleFilter: false,
    noOfRows: 20,
    filterName: '',
    filterEmail: '',
    filterStatus: 'all',
    filterCategory: '',
    filterTags: '',
    windowWidth: window.innerWidth,
  }

  filterRef = React.createRef()

  filterSet = {
    name: true,
    email: true,
    mobile: true,
    gender: true,
    caseMngr: true,
    address: true,
  }

  componentDidMount() {
    const { dispatch } = this.props
    console.log('gotchahaha')
    // this.selectActiveStatus('active')
    dispatch({
      type: 'learners/GET_DATA',
    })
    dispatch({
      type: 'learners/GET_LEARNERS_DROPDOWNS',
    })
    dispatch({
      type: 'appointments/GET_APPOINTMENT_LIST',
    })
    window.addEventListener('resize', this.handleWindowResize)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps?.learners !== this.props?.learners) {
      this.setState({
        mainData: this.props.learners.LearnersList,
        loadingLearners: this.props.learners.loadingLearners,
        tableData: this.props.learners.LearnersList,
      })

      if (this.props.learners.LearnerCreated === 'Created') {
        this.setState({
          visible: false,
        })
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize)
  }

  handleWindowResize = () => {
    this.setState({
      windowWidth: window.innerWidth,
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

    dispatch({
      type: 'learners/GET_SINGLE_LEARNER',
      payload: {
        UserProfile: e,
        isUserProfile: true,
      },
    })
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
    const {
      dispatch,
      learners: { ItemPerPage },
    } = this.props
    let isActive = null

    if (value === 'all') isActive = null
    if (value === 'active') isActive = true
    if (value === 'in-active') isActive = false

    dispatch({
      type: 'learners/SET_STATE',
      payload: {
        CurrentStatus: value,
      },
    })

    dispatch({
      type: 'learners/GET_LEARNERS',
      payload: {
        isActive,
        first: ItemPerPage,
        after: null,
        before: null,
      },
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

  learnerActiveInactive = (checked, id) => {
    const {
      dispatch,
      learners: { UserProfile },
    } = this.props

    dispatch({
      type: 'learners/LEARNER_ACTIVE_INACTIVE',
      payload: {
        id,
        checked: checked,
      },
    })
  }

  showProgram = obj => {
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

    const {
      dispatch,
      learners: { ItemPerPage, CurrentStatus },
    } = this.props
    dispatch({
      type: 'learners/PAGE_CHANGED',
      payload: {
        page,
        rows,
      },
    })
  }
  rowsChanged = (currentRowsPerPage, currentPage) => {
    const {
      dispatch,
      learners: { ItemPerPage, CurrentStatus },
    } = this.props
    dispatch({
      type: 'learners/ROWS_CHANGED',
      payload: {
        currentRowsPerPage,
        currentPage,
      },
    })
  }

  filterHandler = ({ name, email, mobile, gender, caseMngr, address, status, category, tags }) => {
    let filteredList = this.state.mainData
    let tempFilterActive = false

    status = status ? status : this.state.filterStatus
    category = category ? category : this.state.filterCategory

    console.log(name, email, status, category, tags, 'clinic filter')
    console.log(filteredList)
    if (!name && !email && !mobile && !gender && !caseMngr && !address) {
      tempFilterActive = false
    }
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
        filteredList.filter(
          item => item.email && item.email.toLowerCase().includes(email.toLowerCase()),
        )
    }
    if (status !== 'all') {
      console.log(status, 'gotcha')
      tempFilterActive = true
      let tempStatus = status === 'active' ? true : false
      filteredList = filteredList && filteredList.filter(item => item.isActive === tempStatus)
    }
    if (caseMngr) {
      tempFilterActive = true
      filteredList =
        filteredList &&
        filteredList.filter(
          item =>
            item.caseManager &&
            item.caseManager?.name.toLowerCase().includes(caseMngr.toLowerCase()),
        )
    }
    if (mobile) {
      tempFilterActive = true
      filteredList =
        filteredList &&
        filteredList.filter(item => item.mobileno?.toLowerCase().includes(mobile.toLowerCase()))
    }
    if (address) {
      tempFilterActive = true
      filteredList =
        filteredList &&
        filteredList.filter(item => item.currentAddress?.toLowerCase().includes(name.toLowerCase()))
    }
    if (tags) {
      tempFilterActive = true
      filteredList =
        filteredList &&
        filteredList.filter(item => {
          if (item.tags && item.tags.length > 0) {
            let exist = false
            for (let i = 0; i < item.tags.length; i += 1) {
              if (item.tags[i].toLowerCase().includes(tags.toLowerCase())) {
                exist = true
                break
              }
            }
            return exist
          }
          return false
        })
    }
    if (gender) {
      tempFilterActive = true
      filteredList =
        filteredList &&
        filteredList.filter(
          item => item.gender && item.gender.toLowerCase() === gender.toLowerCase(),
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
      mobile: '',
      gender: '',
      caseMngr: '',
      address: '',
      tags: '',
      status: 'all',
      category: '',
    })
    // this.selectActiveStatus('')
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
      learners: {
        loading,
        LearnersList,
        isUserProfile,
        UserProfile,
        TotalLearners,
        loadingLearners,
      },
    } = this.props

    let filteredList = this.state.tableData

    if (this.state.filterCategory) {
      filteredList =
        filteredList &&
        filteredList.filter(
          item =>
            item.category &&
            item.category.category.toLowerCase().includes(this.state.filterCategory.toLowerCase()),
        )
    }

    let categories = LearnersList.reduce(function(sum, current) {
      return sum.concat(current.category ? current.category : [])
    }, [])

    let categoriesGrouped = categories.reduce(function(groups, item) {
      const val = item.category
      groups.includes(val) ? null : groups.push(val)
      return groups
    }, [])

    let locations = LearnersList.reduce(function(sum, current) {
      return sum.concat(current.clinicLocation ? current.clinicLocation : [])
    }, [])

    let locationsGrouped = locations.reduce(function(groups, item) {
      const val = item.location
      groups.includes(val) ? null : groups.push(val)
      return groups
    }, [])

    if (loading) {
      return <div>Loading...</div>
    }

    const moreAction = obj => (
      <Menu>
        <Menu.Item key="0">
          <Button onClick={() => this.showAssessments(obj)} type="link" size="small">
            Assessments
          </Button>
        </Menu.Item>
        <Menu.Item key="1">
          <Button onClick={() => this.showProgram(obj)} type="link" size="small">
            Program
          </Button>
        </Menu.Item>
        <Menu.Item key="2">
          <Button onClick={() => this.showSession(obj)} type="link" size="small">
            Session
          </Button>
        </Menu.Item>
      </Menu>
    )

    const columns = [
      {
        title: '#',
        render: row => filteredList.indexOf(row) + 1,
      },
      {
        title: 'Name',
        dataIndex: 'firstname',
        sortable: true,
        render: (text, row) => (
          <Button
            type="link"
            onClick={() => {
              this.setState({ showProfile: true })
              this.info(row)
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
        title: 'Case Manager',
        dataIndex: 'caseManager',
        render: (text, row) => <span>{row.caseManager ? row.caseManager.name : ''}</span>,
      },
      {
        title: 'Last Login',
        dataIndex: 'parent',
        render: (text, row) => (
          <span>
            {row.parent && row.parent.lastLogin
              ? moment(row.parent.lastLogin).format('YYYY-MM-DD')
              : ''}
          </span>
        ),
      },
      {
        title: 'Tags',
        dataIndex: 'tags',
        render: (text, row) => {
          if (row.tags?.length > 0) {
            return (
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {row.tags?.map(r => {
                  return (
                    <Tag key={r} color="#3f72af" style={{ margin: '1px', fontWeight: '600' }}>
                      {r}
                    </Tag>
                  )
                })}
              </div>
            )
          }

          return null
        },
      },
      {
        title: 'Status',
        dataIndex: 'isActive',
        alignItems: 'center',
        render: (text, row) => (
          <div style={{ display: 'flex' }}>
            {text ? (
              <Popconfirm
                onConfirm={() => this.learnerActiveInactive(false, row.id)}
                trigger="click"
                title="Do you want to deactivate the learner ?"
              >
                <Button type="link">
                  <CheckCircleOutlined
                    style={{
                      fontSize: 20,
                      color: COLORS.success,
                      fontWeight: '700',
                      margin: 'auto',
                    }}
                  />
                </Button>
              </Popconfirm>
            ) : (
              <Popconfirm
                onConfirm={() => this.learnerActiveInactive(true, row.id)}
                title="Do you want to activate the learner ?"
                trigger="click"
              >
                <Button type="link">
                  <CloseCircleOutlined
                    type="link"
                    style={{
                      fontSize: 20,
                      fontWeight: '700',
                      margin: 'auto',
                      color: COLORS.danger,
                    }}
                  />
                </Button>
              </Popconfirm>
            )}
          </div>
        ),
      },
      {
        title: 'Intervention',
        ignoreRowClick: true,
        button: true,
        render: obj => (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Dropdown overlay={() => moreAction(obj)} trigger={['click']}>
              <Button style={{ marginRight: '10px' }} type="link">
                <MoreOutlined style={{ fontSize: 22 }} />
              </Button>
            </Dropdown>
          </div>
        ),
      },
    ]

    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'

    const exportToCSV = () => {
      const filename = 'learners_excel'
      let formattedData = filteredList.map(function(e) {
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
            size="small"
            name="name"
            placeholder="Search Name"
            value={this.state.filterName}
            onChange={e => {
              console.log(e.target.value, 'value')
              this.setState({
                filterName: e.target.value,
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
              })
              this.filterHandler({ email: e.target.value })
            }}
            style={{ ...tableFilterStyles, width: '148px' }}
          />
        </span>

        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span>Category :</span>
          <Radio.Group
            size="small"
            buttonStyle="solid"
            value={this.state.filterCategory}
            onChange={e => {
              this.filterHandler({ category: e.target.value })
              this.setState({ filterCategory: e.target.value, isFilterActive: true })
            }}
            style={tableFilterStyles}
          >
            <Radio.Button value="">All</Radio.Button>
            {categoriesGrouped.map((i, index) => {
              return (
                <Radio.Button key={i} value={i}>
                  {i}
                </Radio.Button>
              )
            })}
          </Radio.Group>
        </span>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span>Tags :</span>
          <Input
            size="small"
            name="tags"
            placeholder="Search tag"
            value={this.state.filterTags}
            onChange={e => {
              this.setState({
                filterTags: e.target.value,
                isFilterActive: e.target.value && true,
              })
              this.filterHandler({ tags: e.target.value })
            }}
            style={{ ...tableFilterStyles, width: '148px' }}
          />
        </span>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span>Status :</span>
          <Radio.Group
            size="small"
            buttonStyle="solid"
            value={this.state.filterStatus}
            onChange={e => {
              console.log(e)
              this.filterHandler({ status: e.target.value })
              this.setState({ filterStatus: e.target.value, isFilterActive: true })
              this.selectActiveStatus(e.target.value)
            }}
            style={tableFilterStyles}
          >
            <Radio.Button value="all">All</Radio.Button>
            <Radio.Button value="active">Active</Radio.Button>
            <Radio.Button value="in-active">In-Active</Radio.Button>
          </Radio.Group>
        </span>
      </div>
    )

    return (
      <Authorize roles={['school_admin', 'therapist']} redirect to="/dashboard/beta">
        <Helmet title="Partner" />
        <Drawer
          title="Filters"
          placement="right"
          closable={true}
          onClose={this.onCloseFilter}
          visible={visibleFilter}
          width={DRAWER.widthL4}
        >
          <FilterCard
            filterHandler={this.filterHandler}
            filterSet={this.filterSet}
            ref={this.filterRef}
          />
          <div>
            <div className="filter_sub_div">
              <span style={customLabel}>Category :</span>

              <Select
                size="default"
                value={this.state.filterCategory}
                onSelect={value => {
                  this.filterHandler({ category: value })
                  this.setState({ filterCategory: value, isFilterActive: true })
                }}
                style={inputCustom}
                placeholder="Select Category"
              >
                <Select.Option value="">All</Select.Option>
                {categoriesGrouped.map((i, index) => {
                  return (
                    <Select.Option key={i} value={i}>
                      {i}
                    </Select.Option>
                  )
                })}
              </Select>
            </div>

            <div className="filter_sub_div">
              <span style={customLabel}>Status :</span>
              <Select
                size="default"
                value={this.state.filterStatus}
                onSelect={value => {
                  this.setState({ filterStatus: value, isFilterActive: true })
                  this.filterHandler({ status: value })
                  this.selectActiveStatus(value)
                }}
                style={inputCustom}
              >
                <Select.Option value="all">All</Select.Option>
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="in-active">In-Active</Select.Option>
              </Select>
            </div>
          </div>
        </Drawer>
        <Drawer
          className="profile-css"
          title="Profile"
          placement="right"
          closable={true}
          onClose={() => this.setState({ showProfile: false })}
          visible={this.state.showProfile}
          width={this.state.windowWidth > 1250 ? DRAWER.widthL1 : DRAWER.widthL4}
        >
          <Profile />
        </Drawer>

        <Drawer
          title="CREATE LEARNER"
          width={DRAWER.widthL2}
          placement="right"
          closable={true}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <CreateLearner CloseDrawer={this.onClose} />
        </Drawer>

        <Drawer
          title="EDIT LEARNER"
          width={DRAWER.widthL2}
          placement="right"
          closable={true}
          onClose={this.onCloseEdit}
          visible={this.state.visibleEdit}
        >
          {UserProfile ? <EditBasicInformation key={UserProfile.id} /> : null}
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

            {this.state.isFilterActive ? (
              <Button
                type="link"
                onClick={() => {
                  this.filterRef.current ? this.filterRef.current.clearFilter() : this.clearFilter()
                  this.setState({
                    isFilterActive: false,
                    filterStatus: 'all',
                    filterTags: '',
                    filterCategory: '',
                    filterName: '',
                    filterEmail: '',
                  })
                  this.selectActiveStatus('all')
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
            <span style={{ fontSize: '25px', color: '#000' }}>Learners List</span>
          </div>
          <div style={{ padding: '5px 0px' }}>
            <Dropdown overlay={menu} trigger={['click']}>
              <Button style={{ marginRight: '10px' }} type="link">
                <CloudDownloadOutlined />{' '}
              </Button>
            </Dropdown>

            <Button onClick={this.showDrawer} type="primary">
              <PlusOutlined /> ADD LEARNER
            </Button>
          </div>
        </div>

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
                loading={this.state.loadingLearners}
                pagination={{
                  defaultPageSize: 20,
                  onChange: (page, rows) => this.pageChanged(page, rows),
                  onShowSizeChange: (currentPage, currentRowsPerPage) =>
                    this.rowsChanged(currentRowsPerPage, currentPage),
                  showSizeChanger: true,
                  pageSizeOptions:
                    TotalLearners > 100
                      ? ['20', '50', '80', '100', `${TotalLearners}`]
                      : ['20', '50', '80', '100'],
                  position: 'bottom',
                }}
              />
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default LearnerTable

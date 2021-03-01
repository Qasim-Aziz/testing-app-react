/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-const */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable object-shorthand */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/no-did-update-set-state */

import React from 'react'
import { Helmet } from 'react-helmet'
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
  Radio,
  Tag,
} from 'antd'
// import EditHrDetails from 'components/staff/EditHrDetails'
// import EditCertificationDetails from 'components/staff/EditCertificationDetails'
// import EditHealthForm from 'components/learner/EditHealthForm'
import {
  ContactsOutlined,
  FileDoneOutlined,
  AuditOutlined,
  UserOutlined,
  FilterOutlined,
  PlusOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  CloseCircleOutlined,
  CloudDownloadOutlined,
} from '@ant-design/icons'
import moment from 'moment'
import { gql } from 'apollo-boost'
import { connect } from 'react-redux'
import DataTable from 'react-data-table-component'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import JsPDF from 'jspdf'
import 'jspdf-autotable'
import Highlighter from 'react-highlight-words'
import { Scrollbars } from 'react-custom-scrollbars'
import { FilterCard } from '../../../components/FilterCard/FilterTable'
import EditStaffBasicInfo from './EditStaffBasicInfo'
import CreateStaff from '../createStaff'
import Authorize from '../../../components/LayoutComponents/Authorize'
import client from '../../../apollo/config'
import './style.scss'

const { Panel } = Collapse
const { Meta } = Card
const { RangePicker } = DatePicker

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
      padding: '12px 8px 7px',
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
      padding: '4px 8px',
      fontSize: '12px',
    },
  },
  pagination: {
    style: {
      position: 'absolute',
      top: '12px',
      right: '5px',
      borderTopStyle: 'none',
      minHeight: '35px',
    },
  },
  table: {
    style: {
      paddingBottom: '64px',
      top: '64px',
    },
  },
}

const inputCustom = { width: '180px', marginBottom: '8px', display: 'block' }
const tableFilterStyles = { margin: '0px 22px 0 8px' }
const customLabel = {
  fontSize: '17px',
  color: '#000',
  marginRight: '12px',
  marginBottom: '12px',
}
@connect(({ staffs, learners }) => ({ staffs, learners }))
class StaffTable extends React.Component {
  state = {
    divShow: false,
    filterShow: false,
    staffdata: [],
    tableData: [],
    mainData: [],
    realStaffList: [],
    isFilterActive: false,
    UserProfile: null,
    isLoaded: false,
    searchText: '',
    searchedColumn: '',
    filteredInfo: null,
    filterRole: '',
    // for create learner drawer
    visible: false,
    visibleEdit: false,
    filterName: '',
    filterEmail: '',
    filterDesignation: '',
    filterTags: '',
  }

  filterRef = React.createRef()

  filterSet = {
    name: true,
    email: true,
    mobile: true,
    gender: true,
    designation: true,
    address: true,
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'staffs/GET_STAFFS',
    })

    dispatch({
      type: 'staffs/GET_STAFF_DROPDOWNS',
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.staffs.StaffList !== this.props.staffs.StaffList) {
      this.setState({
        tableData: this.props.staffs.StaffList,
        mainData: this.props.staffs.StaffList,
      })

      if (this.props.staffs.staffCreated === 'Created') {
        this.setState({
          visible: false,
        })
      }
    }
  }

  info = e => {
    console.log(e, 'ewewe')
    const { dispatch } = this.props
    dispatch({
      type: 'staffs/SET_STATE',
      payload: {
        StaffProfile: e,
        isStaffProfile: true,
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

  handleChange = (pagination, filters, sorter) => {
    //   console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
    })
  }

  divShowHide = () => {
    this.setState({ divShow: true })
  }

  staffActiveInactive = checked => {
    const {
      dispatch,
      staffs: { StaffProfile },
    } = this.props
    console.log(StaffProfile.id, checked)

    dispatch({
      type: 'staffs/STAFF_ACTIVE_INACTIVE',
      payload: {
        id: StaffProfile.id,
        checked: checked,
      },
    })
  }

  selectActiveStatus = value => {
    if (value === 'all') {
      client
        .query({
          query: gql`
            {
              staffs {
                edges {
                  node {
                    id
                    name
                    email
                    gender
                    localAddress
                  }
                }
              }
            }
          `,
        })
        .then(result => {
          this.setState({
            staffdata: result.data.staffs.edges,
            realStaffList: [],
          })
        })
    }
    if (value === 'active') {
      client
        .query({
          query: gql`
            {
              staffs(isActive: true) {
                edges {
                  node {
                    id
                    name
                    email
                    gender
                    localAddress
                  }
                }
              }
            }
          `,
        })
        .then(result => {
          this.setState({
            staffdata: result.data.staffs.edges,
            realStaffList: [],
          })
        })
    }
    if (value === 'in-active') {
      client
        .query({
          query: gql`
            {
              staffs(isActive: false) {
                edges {
                  node {
                    id
                    name
                    email
                    gender
                    localAddress
                  }
                }
              }
            }
          `,
        })
        .then(result => {
          this.setState({
            staffdata: result.data.staffs.edges,
            realStaffList: [],
          })
        })
    }
  }

  showSession = () => {
    window.location.href = '/#/partners/staffManagement'
  }

  selectDateRange = value => {
    this.setState({
      isLoaded: true,
    })
    const start = new Date(value[0]).toISOString().slice(0, 10)
    const end = new Date(value[1]).toISOString().slice(0, 10)

    client
      .query({
        query: gql`{staffs(dateOfJoining_Gte: "${start}",dateOfJoining_Lte: "${end}",) {edges {node {id,name,email,gender,localAddress,userRole{id,name}}}}}`,
      })
      .then(result => {
        this.setState({
          isLoaded: false,
          staffdata: result.data.staffs.edges,
          realStaffList: [],
        })
      })
  }

  filterHandler = ({ name, email, mobile, gender, designation, tags, address }) => {
    let filteredList = this.state.mainData
    let tempFilterActive = false
    if (name) {
      console.log(name, 'name')
      tempFilterActive = true
      filteredList =
        filteredList &&
        filteredList.filter(item => item.name?.toLowerCase().includes(name.toLowerCase()))
    }
    if (email) {
      tempFilterActive = true
      filteredList =
        filteredList &&
        filteredList.filter(
          item => item.email && item.email.toLowerCase().includes(email.toLowerCase()),
        )
    }
    if (designation) {
      tempFilterActive = true
      filteredList =
        filteredList &&
        filteredList.filter(
          item =>
            item.designation && item.designation?.toLowerCase().includes(designation.toLowerCase()),
        )
    }
    if (mobile) {
      tempFilterActive = true
      filteredList =
        filteredList &&
        filteredList.filter(item => item.contactNo?.toLowerCase().includes(mobile.toLowerCase()))
    }
    if (address) {
      tempFilterActive = true
      filteredList =
        filteredList &&
        filteredList.filter(item => item.localAddress?.toLowerCase().includes(name.toLowerCase()))
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
          item => item.gender && item.gender?.toLowerCase() === gender.toLowerCase(),
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
      designation: '',
      address: '',
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
    let { filteredInfo } = this.state
    filteredInfo = filteredInfo || {}

    const columns = [
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        minWidth: '160px',
        maxWidth: '160px',
        cell: row => (
          <Button
            onClick={() => this.info(row)}
            type="link"
            style={{ padding: '0px', fontWeight: 'bold', fontSize: '11px' }}
          >
            {row.name}
          </Button>
        ),
      },
      {
        name: 'Email',
        selector: 'email',
        key: 'email',
        maxWidth: '160px',
        minWidth: '160px',
      },
      {
        name: 'Contact No',
        selector: 'contactNo',
        key: 'email',
        width: '120px',
      },

      {
        name: 'Role',
        selector: 'userRole',
        cell: row => <span>{row.userRole ? row.userRole.name : ''}</span>,
        maxWidth: '80px',
      },
      {
        name: 'Gender',
        selector: 'gender',
        maxWidth: '60px',
      },
      {
        name: 'Join Date',
        selector: 'dateOfJoining',
        key: 'joining',
        maxWidth: '120px',
      },
      {
        name: 'Date of Birth',
        selector: 'dob',
        key: 'dob',
        maxWidth: '120px',
      },
      {
        name: 'Designation',
        selector: 'designation',
        maxWidth: '120px',
      },
      {
        name: 'Qualification',
        selector: 'qualification',
        maxWidth: '120px',
      },
      {
        name: 'Last Login',
        selector: 'user',
        width: '100px',
        cell: row => (
          <span>
            {row.user && row.user.lastLogin ? moment(row.user.lastLogin).format('YYYY-MM-DD') : ''}
          </span>
        ),
      },
      {
        name: 'Session',
        ignoreRowClick: true,
        button: true,
        maxWidth: '80px',
        minWidth: '80px',
        cell: () => (
          <span>
            <Button
              onClick={this.showSession}
              style={{ padding: '0px', color: '#0190fe', border: 'none', fontSize: '11px' }}
            >
              Time
            </Button>
          </span>
        ),
      },
      {
        name: 'Tags',
        selector: 'tags',
        width: 60,
        cell: row => {
          if (row.tags?.length > 0) {
            return (
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {row.tags?.map(r => {
                  return (
                    <Tag key={r} color="blue" style={{ margin: '1px' }}>
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
        name: 'Location',
        maxWidth: '120px',
        cell: row => <span>{row.clinicLocation ? row.clinicLocation.location : ''}</span>,
      },
    ]
    const { divShow, filterShow } = this.state
    const {
      staffs,
      staffs: { StaffList, StaffProfile },
    } = this.props

    // let tagArrList = [
    //   ...this.state.tableData.map(ele => {
    //     if (typeof ele.tags === 'object') {
    //       if ('__typename' in ele.tags) {
    //         ele.tags = ''
    //       } else if (ele.tags !== '') {
    //         console.log('ELSE', ele.tags)
    //         ele.tags.edges.node.tags
    //       }
    //     }
    //     return ele
    //   }),
    // ]

    let filteredList = this.state.tableData

    console.log('TABLE DATA', filteredList)
    if (this.state.filterRole) {
      filteredList = filteredList.filter(
        item =>
          item.userRole &&
          item.userRole.name.toLowerCase().includes(this.state.filterRole.toLowerCase()),
      )
    }

    let roles = StaffList.reduce(function(sum, current) {
      return sum.concat(current.userRole ? current.userRole : [])
    }, [])

    let rolesGrouped = roles.reduce(function(group, item) {
      const val = item.name
      if (!group.includes(val)) {
        group.push(val)
        return group
      }
      return group
    }, [])

    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'

    const exportToCSV = () => {
      const fileName = 'staff_excel'
      let formattedData = filteredList.map(function(e) {
        return {
          Name: e.name,
          Email: e.email,
          Role: e.userRole ? e.userRole.name : '',
          Gender: e.gender,
          JoinDate: e.dateOfJoining,
          DateOfBirth: e.dob,
          Designation: e.designation,
          Qualification: e.qualification,
          Location: e.clinicLocation ? e.clinicLocation.location : '',
        }
      })

      const ws = XLSX.utils.json_to_sheet(formattedData)
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const data = new Blob([excelBuffer], { type: fileType })
      FileSaver.saveAs(data, fileName + fileExtension)
    }

    if (staffs.loading) {
      return <div>Loading...</div>
    }
    const divClass = 'col-sm-12'
    const detailsDiv = divShow ? { display: 'block', paddingLeft: '0' } : { display: 'none' }

    const exportPDF = () => {
      const unit = 'pt'
      const size = 'A4' // Use A1, A2, A3 or A4
      const orientation = 'landscape' // portrait or landscape

      const doc = new JsPDF(orientation, unit, size)

      doc.setFontSize(10)

      const title = 'Staff List'
      const headers = [
        [
          'Name',
          'Email',
          'Role',
          'Gender',
          'Date of Joining',
          'Date of Birth',
          'Designation',
          'Qualification',
          'Location',
        ],
      ]

      const data = filteredList.map(e => [
        e.name,
        e.email,
        e.userRole ? e.userRole.name : '',
        e.gender,
        e.dateOfJoining,
        e.dob,
        e.designation,
        e.qualification,
        e.clinicLocation ? e.clinicLocation.location : '',
      ])

      const content = {
        startY: 50,
        head: headers,
        body: data,
      }

      doc.text(title, 10, 10)
      doc.autoTable(content)
      doc.save('staff.pdf')
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
      <Authorize roles={['school_admin']} redirect to="/dashboard/beta">
        <Helmet title="Partner" />
        <Drawer
          title="CREATE STAFF"
          width="65%"
          placement="right"
          closable={true}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <CreateStaff CloseDrawer={this.onClose} />
        </Drawer>

        <Drawer
          title="Filters"
          placement="right"
          closable={true}
          onClose={() => this.setState({ filterShow: false })}
          visible={filterShow}
          width={380}
        >
          <FilterCard
            filterHandler={this.filterHandler}
            filterSet={this.filterSet}
            ref={this.filterRef}
          />
          <div>
            <div className="filter_sub_div">
              <span style={customLabel}>Role :</span>
              <Select
                size="default"
                value={this.state.filterRole}
                onSelect={value => this.setState({ filterRole: value, isFilterActive: true })}
                style={inputCustom}
              >
                <Select.Option value="">Select Role</Select.Option>
                {rolesGrouped.map((i, index) => {
                  return (
                    <Select.Option key={i} value={i}>
                      {i}
                    </Select.Option>
                  )
                })}
              </Select>
            </div>
          </div>
        </Drawer>

        <Drawer
          title="EDIT LEARNER"
          width="65%"
          placement="right"
          closable={true}
          onClose={this.onCloseEdit}
          visible={this.state.visibleEdit}
        >
          {StaffProfile ? (
            <div className="card" style={{ marginTop: '5px', border: 'none' }}>
              <div className="card-body" style={{ paddingLeft: '5px', paddingRight: '5px' }}>
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
                          {StaffProfile ? StaffProfile.name : ''}
                          <span
                            style={{
                              float: 'right',
                              fontSize: '12px',
                              padding: '5px',
                              color: '#0190fe',
                            }}
                          >
                            {StaffProfile.isActive === true ? (
                              <Switch
                                checkedChildren={<Icon type="check" />}
                                unCheckedChildren={<Icon type="close" />}
                                defaultChecked
                                onChange={this.staffActiveInactive}
                              />
                            ) : (
                              <Switch
                                checkedChildren={<Icon type="check" />}
                                unCheckedChildren={<Icon type="close" />}
                                onChange={this.staffActiveInactive}
                              />
                            )}
                          </span>
                          {/* <span style={{float:'right', fontSize:'12px', padding:'5px'}}>delete</span>
                        <span style={{float:'right', fontSize:'12px', padding:'5px'}}>edit</span> */}
                        </h5>
                      }
                      description={
                        <div>
                          <p style={{ fontSize: '13px', marginBottom: '4px' }}>
                            {' '}
                            Therapist{' '}
                            <span
                              style={{
                                backgroundColor: '#52c41a',
                                color: 'white',
                                borderRadius: '3px',
                                padding: '1px 5px',
                              }}
                            >
                              Active
                            </span>
                          </p>
                        </div>
                      }
                    />
                  </Card>
                  {StaffProfile ? (
                    <EditStaffBasicInfo key={StaffProfile.id} userinfo={StaffProfile} />
                  ) : (
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
            marginTop: '20px',
            padding: '0px 10px',
            backgroundColor: '#FFF',
            boxShadow: '0 1px 6px rgba(0,0,0,.12), 0 1px 4px rgba(0,0,0,.12)',
          }}
        >
          <div style={{ padding: '5px 0px' }}>
            <Button onClick={() => this.filterToggle(filterShow)} size="large">
              <FilterOutlined />
            </Button>
            {this.state.isFilterActive ? (
              <Button
                type="link"
                style={{ marginLeft: '10px', color: '#FEBB27' }}
                size="small"
                onClick={() => {
                  this.filterRef.current ? this.filterRef.current.clearFilter() : this.clearFilter()
                  this.setState({
                    isFilterActive: false,
                    filterRole: '',
                    filterDesignation: '',
                    filterName: '',
                    filterEmail: '',
                    filterTags: '',
                  })
                }}
              >
                Clear Filters
                <CloseCircleOutlined />
              </Button>
            ) : null}
          </div>
          <div>
            <span style={{ fontSize: '25px', color: '#000' }}>Staff List</span>
          </div>
          <div style={{ padding: '5px 0px' }}>
            <Dropdown overlay={menu} trigger={['click']}>
              <Button style={{ marginRight: '10px' }} type="link" size="large">
                <CloudDownloadOutlined />{' '}
              </Button>
            </Dropdown>

            <Button onClick={this.showDrawer} type="primary">
              <PlusOutlined /> ADD STAFF
            </Button>
          </div>
        </div>

        <div className={divClass}>
          <div style={{ margin: '5px', marginBottom: '50px' }}>
            {/* filters */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                position: 'absolute',
                top: '20px',
                whiteSpace: 'nowrap',
                zIndex: 2,
                width: 'fit-content',
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
                  name="email"
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
                <span>Designation :</span>
                <Input
                  size="small"
                  name="designation"
                  placeholder="Search Designation"
                  value={this.state.filterDesignation}
                  onChange={e => {
                    this.setState({
                      filterDesignation: e.target.value,
                      isFilterActive: e.target.value && true,
                    })
                    this.filterHandler({ designation: e.target.value })
                  }}
                  style={{ ...tableFilterStyles, width: '148px' }}
                />
              </span>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <Radio.Group
                  size="small"
                  buttonStyle="solid"
                  value={this.state.filterRole}
                  onChange={e => {
                    this.setState({ filterRole: e.target.value, isFilterActive: true })
                  }}
                  style={tableFilterStyles}
                >
                  <Radio.Button value="">All</Radio.Button>
                  {rolesGrouped.map((i, index) => {
                    return (
                      <Radio.Button key={i} value={i}>
                        {i}
                      </Radio.Button>
                    )
                  })}
                </Radio.Group>
              </span>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span>Tag :</span>
                <Input
                  size="small"
                  name="tags"
                  placeholder="Search Tag"
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
            </div>
            <div className="modify-data-table">
              <DataTable
                columns={columns}
                theme="default"
                keyField="id"
                dense={true}
                pagination={true}
                data={filteredList}
                customStyles={customStyles}
                noHeader={true}
                paginationRowsPerPageOptions={[10, 50, 100, 200, 500, 1000]}
              />
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default StaffTable

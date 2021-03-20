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
  UserOutlined,
  FilterOutlined,
  PlusOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  HistoryOutlined,
  CloseCircleOutlined,
  CloudDownloadOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import moment from 'moment'
import { gql } from 'apollo-boost'
import { connect } from 'react-redux'
import DataTable from 'react-data-table-component'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import JsPDF from 'jspdf'
import 'jspdf-autotable'
import { Scrollbars } from 'react-custom-scrollbars'
import { FilterCard } from '../../../components/FilterCard/FilterTable'
import EditStaffBasicInfo from './EditStaffBasicInfo'
import CreateStaff from '../createStaff'
import Authorize from '../../../components/LayoutComponents/Authorize'
import client from '../../../apollo/config'
import '../style.scss'
import Profile from '../Profile'

const { Panel } = Collapse
const { Meta } = Card
const { RangePicker } = DatePicker

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
    filteredInfo: null,
    // for create learner drawer
    visible: false,
    visibleEdit: false,
    profileDrawer: false,
    filterName: '',
    searchText: '',
    searchedColumn: '',
    filterRole: '',
    filterEmail: '',
    filterDesignation: '',
    filterTags: '',
    filterActive: 'all',
    windowWidth: window.innerWidth,
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

    window.addEventListener('resize', this.handleWindowResize)
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

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize)
  }

  info = e => {
    const { dispatch } = this.props
    dispatch({
      type: 'staffs/GET_STAFF_PROFILE',
      payload: e,
    })
    this.setState({
      divShow: true,
    })
    this.showEditDrawer()
  }

  info2 = e => {
    const { dispatch } = this.props
    dispatch({
      type: 'staffs/GET_STAFF_PROFILE',
      payload: e,
    })
    this.setState({
      profileDrawer: true,
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

  handleChange = (pagination, filters, sorter) => {
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

  handleWindowResize = () => {
    this.setState({
      windowWidth: window.innerWidth,
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
        title: '#',
        render: row => filteredList.indexOf(row) + 1,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'k2',
        render: (text, row) => (
          <Button
            onClick={() => this.info2(row)}
            type="link"
            style={{ padding: '0px', fontWeight: 'bold', fontSize: '14px' }}
          >
            {row.name} {row.surname}
          </Button>
        ),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Contact No',
        dataIndex: 'contactNo',
      },
      {
        title: 'Role',
        dataIndex: 'userRole',
        render: (text, row) => <span>{row.userRole ? row.userRole.name : ''}</span>,
      },
      {
        title: 'Last Login',
        dataIndex: 'user',
        render: (text, row) => (
          <span>
            {row.user && row.user.lastLogin ? moment(row.user.lastLogin).format('YYYY-MM-DD') : ''}
          </span>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'isActive',
        width: '140px',
        render: (text, row) => {
          if (row.isActive) {
            return <CheckCircleOutlined style={{ fontSize: 22, color: 'green' }} />
          }
          return <CloseCircleOutlined style={{ fontSize: 22, color: 'red' }} />
        },
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
                    <Tag key={r} color="#F89A42" style={{ margin: '1px', fontWeight: '600' }}>
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
        title: 'Session',
        render: () => (
          <span>
            <Button type="link" onClick={this.showSession}>
              <HistoryOutlined style={{ fontSize: 22 }} />
            </Button>
          </span>
        ),
      },
    ]
    const { divShow, filterShow } = this.state
    const {
      staffs,
      staffs: { StaffList, StaffProfile },
    } = this.props

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

    const tableHeader = (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
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
          title="Employee Profile"
          width={this.state.windowWidth > 1250 ? 1200 : 650}
          closable
          className="profile-css"
          visible={this.state.profileDrawer}
          onClose={() => this.setState({ profileDrawer: false })}
        >
          <Profile />
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

        <div>
          <div style={{ marginTop: '15px', marginBottom: '50px' }}>
            <div className="view-staff">
              <Table
                title={() => {
                  return tableHeader
                }}
                rowKey="id"
                loading={staffs.loading}
                columns={columns}
                dataSource={filteredList}
                pagination={{
                  defaultPageSize: 20,
                  showSizeChanger: true,
                  pageSizeOptions: ['20', '50', '80', '100'],
                }}
              />
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default StaffTable

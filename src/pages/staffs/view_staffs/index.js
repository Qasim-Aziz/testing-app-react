/* eslint-disable eqeqeq */
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
  Card,
  Select,
  DatePicker,
  Input,
  Drawer,
  Popconfirm,
  Dropdown,
  Menu,
  Radio,
  Tag,
} from 'antd'
import {
  FilterOutlined,
  PlusOutlined,
  HistoryOutlined,
  CloseCircleOutlined,
  CloudDownloadOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import moment from 'moment'
import { gql } from 'apollo-boost'
import { connect } from 'react-redux'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import JsPDF from 'jspdf'
import 'jspdf-autotable'
import LoadingComponent from 'components/LoadingComponent'
import { COLORS, DRAWER, FORM } from 'assets/styles/globalStyles'
import { FilterCard } from '../../../components/FilterCard/FilterTable'
import EditStaffBasicInfo from './EditStaffBasicInfo'
import CreateStaff from '../createStaff'
import Authorize from '../../../components/LayoutComponents/Authorize'
import client from '../../../apollo/config'
import '../style.scss'
import Profile from '../Profile'

const { Meta } = Card
const { Option } = Select
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
    filterRole: '',
    filterEmail: '',
    filterDesignation: [],
    filterTags: '',
    filterActive: 'active',
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
      payload: {
        isActive: true,
      },
    })

    dispatch({
      type: 'staffs/GET_STAFF_DROPDOWNS',
    })
    dispatch({
      type: 'appointments/GET_APPOINTMENT_LIST',
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

  info2 = e => {
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

  info = e => {
    const { dispatch } = this.props
    dispatch({
      type: 'staffs/GET_STAFF_PROFILE',
      payload: e,
    })
    this.setState({
      profileDrawer: true,
    })
  }

  selectActiveStatus = value => {
    const { dispatch } = this.props
    let isActive = null

    if (value === '') isActive = null
    if (value === 'active') isActive = true
    if (value === 'in-active') isActive = false

    console.log(isActive, value)
    dispatch({
      type: 'staffs/SET_STATE',
      payload: {
        CurrentStatus: value,
      },
    })

    dispatch({
      type: 'staffs/GET_STAFFS',
      payload: {
        isActive,
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

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
    })
  }

  divShowHide = () => {
    this.setState({ divShow: true })
  }

  staffActiveInactive = (row, checked) => {
    const { dispatch } = this.props
    console.log(row, checked)

    dispatch({
      type: 'staffs/STAFF_ACTIVE_INACTIVE',
      payload: {
        id: row.id,
        checked: !checked,
      },
    })
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

  filterHandler = ({ name, email, mobile, gender, designation, tags, address, status }) => {
    let filteredList = this.state.mainData
    let tempFilterActive = false
    status = status !== undefined ? status : this.state.filterActive
    email = email !== undefined ? email : this.state.filterEmail
    name = name !== undefined ? name : this.state.filterName

    console.log(status, 'status')
    if (name) {
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
    if (status) {
      tempFilterActive = true
      const tempStatus = status == 'active'
      filteredList = filteredList && filteredList.filter(item => item.isActive == tempStatus)
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
      status: 'active',
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
            onClick={() => this.info(row)}
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
        title: 'Tags',
        dataIndex: 'tags',
        render: (text, row) => {
          if (row.tags?.length > 0) {
            return (
              <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '250px' }}>
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
        width: '140px',
        render: (status, row) => {
          return (
            <span>
              <Popconfirm
                title={`Sure to ${status ? 'deactivate' : 'activate'} the employee?`}
                onConfirm={() => this.staffActiveInactive(row, status)}
              >
                <Button type="link">
                  {status ? (
                    <CheckCircleOutlined style={{ fontSize: 22, color: COLORS.success }} />
                  ) : (
                    <CloseCircleOutlined style={{ fontSize: 22, color: COLORS.danger }} />
                  )}
                </Button>
              </Popconfirm>
            </span>
          )
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

    const { filterShow, mainData } = this.state
    const {
      staffs,
      staffs: { StaffList, StaffProfile },
    } = this.props

    let filteredList = this.state.tableData

    if (this.state.filterRole) {
      filteredList = filteredList.filter(
        item =>
          item.userRole &&
          item.userRole.name.toLowerCase().includes(this.state.filterRole.toLowerCase()),
      )
    }

    let designationList = mainData.map(item => item.designation)
    designationList = designationList.reduce((gr, item) => {
      if (!gr.includes(item)) {
        gr.push(item)
        return gr
      }
      return gr
    }, [])

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

    const exportToCSV = () => {
      const fileType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      const fileExtension = '.xlsx'
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
            allowClear
            value={this.state.filterName}
            onChange={e => {
              this.setState({
                filterName: e.target.value,
                isFilterActive: e.target.value && true,
              })
              this.filterHandler({ name: e.target.value })
            }}
            style={{ ...tableFilterStyles, borderRadius: 0, width: '140px' }}
          />
        </span>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span>Email :</span>
          <Input
            size="small"
            name="email"
            placeholder="Search Email"
            allowClear
            value={this.state.filterEmail}
            onChange={e => {
              this.setState({
                filterEmail: e.target.value,
                isFilterActive: e.target.value && true,
              })
              this.filterHandler({ email: e.target.value })
            }}
            style={{ ...tableFilterStyles, borderRadius: 0, width: '160px' }}
          />
        </span>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span>Designation :</span>
          <Select
            style={{ ...tableFilterStyles, borderRadius: 0, width: '160px' }}
            placeholder="Select designation"
            size="small"
            showSearch
            optionFilterProp="name"
            value={this.state.filterDesignation}
            onChange={e => {
              console.log(e)
              this.setState({
                filterDesignation: e,
              })
              this.filterHandler({ designation: e })
            }}
          >
            {designationList &&
              designationList.map(item => {
                return (
                  <Option value={item} name={item} key={item}>
                    {item}
                  </Option>
                )
              })}
          </Select>
        </span>

        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span>Role :</span>
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
          <span>Status :</span>
          <Radio.Group
            size="small"
            buttonStyle="solid"
            value={this.state.filterActive}
            onChange={e => {
              this.setState({ filterActive: e.target.value, isFilterActive: true })
              this.filterHandler({ status: e.target.value })
              this.selectActiveStatus(e.target.value)
            }}
            style={tableFilterStyles}
          >
            <Radio.Button value="">All</Radio.Button>
            <Radio.Button value="active">Active</Radio.Button>
            <Radio.Button value="in-active">In-active</Radio.Button>
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
            style={{ ...tableFilterStyles, width: '160px' }}
          />
        </span>
      </div>
    )

    console.log(filteredList, 'filteredlist ')

    return (
      <Authorize roles={['school_admin']} redirect to="/dashboard/beta">
        <Helmet title="Partner" />
        <Drawer
          title="Create Staff"
          width={DRAWER.widthL2}
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
          width={DRAWER.widthL4}
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
          width={DRAWER.widthL1}
          closable
          className="profile-css"
          visible={this.state.profileDrawer}
          onClose={() => this.setState({ profileDrawer: false })}
        >
          <Profile />
        </Drawer>

        <Drawer
          title="Edit Learner"
          width={DRAWER.widthL2}
          placement="right"
          closable={true}
          onClose={this.onCloseEdit}
          visible={this.state.visibleEdit}
        >
          {StaffProfile ? (
            <EditStaffBasicInfo key={StaffProfile.id} userinfo={StaffProfile} />
          ) : (
            <LoadingComponent />
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
                    filterActive: 'active',
                  })
                  this.selectActiveStatus('active')
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
                <CloudDownloadOutlined />
              </Button>
            </Dropdown>

            <Button onClick={this.showDrawer} type="primary">
              <PlusOutlined /> ADD STAFF
            </Button>
          </div>
        </div>

        <div>
          <div style={{ marginBottom: '50px' }}>
            <div className="view-staff with-border">
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
                  pageSizeOptions:
                    StaffList.length > 100
                      ? ['20', '50', '80', '100', `${StaffList.length}`]
                      : ['20', '50', '80', '100'],
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

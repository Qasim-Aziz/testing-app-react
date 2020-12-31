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
import { gql } from 'apollo-boost'
import { connect } from 'react-redux'
import DataTable from 'react-data-table-component'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import JsPDF from 'jspdf'
import 'jspdf-autotable'
import Highlighter from 'react-highlight-words'
import { Scrollbars } from 'react-custom-scrollbars'
import EditStaffBasicInfo from './EditStaffBasicInfo'
import CreateStaff from '../createStaff'
import Authorize from '../../../components/LayoutComponents/Authorize'
import client from '../../../apollo/config'

import './style.scss'

const { Panel } = Collapse
const { Meta } = Card
const { RangePicker } = DatePicker

@connect(({ staffs, learners }) => ({ staffs, learners }))
class StaffTable extends React.Component {
  state = {
    divShow: false,
    filterShow: false,
    staffdata: [],
    realStaffList: [],
    UserProfile: null,
    isLoaded: false,
    searchText: '',
    searchedColumn: '',
    filteredInfo: null,
    filterName: '',
    filterRole: '',
    filterDesignation: '',
    filterLocation: '',
    // for create learner drawer
    visible: false,
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

  info = e => {
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
        selector: 'name',
        sortable: true,
        minWidth: '120px',
        maxWidth: '120px',
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
        name: 'Email',
        selector: 'email',
        key: 'email',
        maxWidth: '160px',
        minWidth: '160px',
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
        maxWidth: '100px',
      },
      {
        name: 'Date of Birth',
        selector: 'dob',
        key: 'dob',
        maxWidth: '80px',
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

    console.log('staff----', StaffList)

    let filteredList = StaffList
    filteredList = filteredList.filter(
      item => item.name && item.name.toLowerCase().includes(this.state.filterName.toLowerCase()),
    )

    if (this.state.filterRole) {
      filteredList = filteredList.filter(
        item =>
          item.userRole &&
          item.userRole.name.toLowerCase().includes(this.state.filterRole.toLowerCase()),
      )
    }
    if (this.state.filterDesignation) {
      filteredList = filteredList.filter(
        item =>
          item.designation &&
          item.designation.toLowerCase().includes(this.state.filterDesignation.toLowerCase()),
      )
    }
    if (this.state.filterLocation) {
      filteredList = filteredList.filter(
        item =>
          item.clinicLocation &&
          item.clinicLocation.location
            .toLowerCase()
            .includes(this.state.filterLocation.toLowerCase()),
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

    let designations = StaffList.reduce(function(sum, current) {
      return sum.concat(current.designation ? current.designation : [])
    }, [])

    let designationsGrouped = designations.reduce(function(groups, item) {
      if (!groups.includes(item)) {
        groups.push(item)
      }
      return groups
    }, [])

    let locations = StaffList.reduce(function(sum, current) {
      return sum.concat(current.clinicLocation ? current.clinicLocation : [])
    }, [])

    let locationsGrouped = locations.reduce(function(groups, item) {
      if (!groups.includes(item.location)) {
        groups.push(item.location)
      }
      return groups
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
    const divClass = divShow ? 'col-sm-8' : 'col-sm-12'
    const detailsDiv = divShow ? { display: 'block', paddingLeft: '0' } : { display: 'none' }
    const filterDiv = filterShow
      ? { display: 'block', padding: '0', marginBottom: '0', backgroundColor: 'inherit' }
      : { display: 'none' }
    const filterOptionStyle = { display: 'inline-block', marginRight: '10px' }

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
          width="50%"
          placement="right"
          closable={true}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <CreateStaff CloseDrawer={this.onClose} />
        </Drawer>

        <Drawer
          title="Filters"
          placement="left"
          closable={true}
          onClose={() => this.setState({ filterShow: false })}
          visible={filterShow}
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
              <span style={{ fontSize: '15px', color: '#000' }}>Role :</span>
              <Select
                size="small"
                value={this.state.filterRole}
                onSelect={value => this.setState({ filterRole: value })}
                style={{ width: 188, marginBottom: 8 }}
              >
                <Select.Option value="">Select Role</Select.Option>
                {rolesGrouped.map((i, index) => {
                  return <Select.Option value={i}>{i}</Select.Option>
                })}
              </Select>
            </div>

            <div className="filter_sub_div">
              <span style={{ fontSize: '15px', color: '#000' }}>Designation :</span>

              <Select
                size="small"
                value={this.state.filterDesignation}
                onSelect={value => this.setState({ filterDesignation: value })}
                style={{ width: 188, marginBottom: 8 }}
              >
                <Select.Option value="">Select Designation</Select.Option>
                {designationsGrouped.map((i, index) => {
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
                style={{ width: 188, marginBottom: 8 }}
              >
                <Select.Option value="">Select Location</Select.Option>
                {locationsGrouped.map((i, index) => {
                  return <Select.Option value={i}>{i}</Select.Option>
                })}
              </Select>
            </div>
          </div>
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
            {this.state.filterName ||
            this.state.filterRole ||
            this.state.filterDesignation ||
            this.state.filterLocation ? (
              <Button
                type="link"
                style={{ marginLeft: '10px', color: '#FEBB27' }}
                onClick={() =>
                  this.setState({
                    filterName: '',
                    filterRole: '',
                    filterDesignation: '',
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
            <span style={{ fontSize: '25px', color: '#000' }}>Staff List</span>
          </div>
          <div style={{ padding: '5px 0px' }}>
            {/* <Button onClick={() => exportPDF()} type='primary'>
              pdf <PlusOutlined />
            </Button>

            <Button onClick={(e) => exportToCSV(filteredList, 'Staff')} type='primary'>
              <PlusOutlined />
            </Button> */}

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

        <div className="row">
          <div className={divClass}>
            <div style={{ margin: '5px', marginBottom: '50px' }}>
              <DataTable
                columns={columns}
                theme="default"
                dense={true}
                pagination={true}
                data={filteredList}
                customStyles={customStyles}
                noHeader={true}
                paginationRowsPerPageOptions={[10, 50, 100, 200, 500, 1000]}
              />
            </div>
          </div>
          <div className="col-sm-4" style={detailsDiv}>
            {StaffProfile ? (
              <Scrollbars key={StaffProfile.id} style={{ height: 650 }}>
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
                      {/* <p style={{ textAlign: 'center' }}>
                        <span style={{ padding: '5px' }}>
                          <ContactsOutlined /> Appointment
                        </span>
                        <span style={{ padding: '5px' }}>
                          <FileDoneOutlined /> Task
                        </span>
                        <span style={{ padding: '5px' }}>
                          <AuditOutlined /> Attendence
                        </span>
                        <span style={{ padding: '5px' }}>
                          <UserOutlined /> Timesheet
                        </span>
                      </p> */}
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
                        <Collapse defaultActiveKey="1" accordion bordered={false}>
                          <Panel header="Basic Details" key="1">
                            <EditStaffBasicInfo key={StaffProfile.id} userinfo={StaffProfile} />
                          </Panel>
                          {/* <Panel header="HR Details" key="2">
                            <EditHrDetails />
                        </Panel>
                        <Panel header="Health Details" key="3">
                            <EditCertificationDetails />
                        </Panel>
                        <Panel header="Intake Form" key="4">
                            <EditHealthForm />
                        </Panel> */}
                        </Collapse>
                      ) : (
                        ''
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

export default StaffTable

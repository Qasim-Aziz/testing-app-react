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
/* eslint-disable eqeqeq */
/* eslint-disable object-shorthand */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-shadow */
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
  Popconfirm,
  Menu,
  Dropdown,
} from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import { Scrollbars } from 'react-custom-scrollbars'
import {
  ContactsOutlined,
  FileDoneOutlined,
  AuditOutlined,
  FilterOutlined,
  PlusOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  FormOutlined,
  CloseCircleOutlined,
  CloudDownloadOutlined,
} from '@ant-design/icons'
import { connect } from 'react-redux'
import DataTable from 'react-data-table-component'
import JsPDF from 'jspdf'
import 'jspdf-autotable'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { gql } from 'apollo-boost'
import EditTaskInformation from './EditTicketInformation'
import CreateTask from '../createTicket'
import client from '../../../apollo/config'
import './style.scss'

const { Meta } = Card
const { RangePicker } = DatePicker

@connect(({ user, tasks }) => ({ user, tasks }))
class TaskTable extends React.Component {
  state = {
    divShow: false,
    filterShow: false,
    isLoaded: true,
    UserProfile: null,
    realTaskList: [],
    searchText: '',
    searchedColumn: '',
    filteredInfo: null,

    filterName: '',
    filterStatus: '',
    filterType: '',
    filterPriority: '',

    // for create task drawer
    visible: false,

    selectedTaskType: 'Open',
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'tasks/GET_TASKS',
    })
    dispatch({
      type: 'tasks/GET_TASKS_DROPDOWNS',
    })
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
    })
  }

  info = e => {
    console.clear()
    console.log(e)
    const { dispatch } = this.props

    dispatch({
      type: 'tasks/SET_STATE',
      payload: {
        SelectedTask: e,
        isSelectedTask: true,
        updateReminderState: true
      },
    })
    this.setState({
      divShow: true,
    })
  }

  selectActiveStatus = val => {
    const { dispatch } = this.props
    if (val == 'All') {
      dispatch({
        type: 'tasks/GET_TASKS',
      })
    }
    if (val == 'Open') {
      dispatch({
        type: 'tasks/GET_TASKS',
      })
    }
    if (val == 'Close') {
      dispatch({
        type: 'tasks/GET_CLOSED_TASKS',
      })
    }
    this.setState({
      selectedTaskType: val,
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

  closeTask = (e, status) => {
    console.log('close task ===> ', e, status)
    const { dispatch } = this.props
    dispatch({
      type: 'tasks/UPDATE_TASK_STATUS',
      payload: {
        id: e.id,
        status: 'VGFza1N0YXR1c1R5cGU6Mg==',
      },
    })
    // this.setState({
    //   divShow: false,
    // })
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
    let { filteredInfo, selectedTaskType } = this.state
    filteredInfo = filteredInfo || {}
    const {
      tasks: { loading, TaskList, isSelectedTask, SelectedTask, createTaskLoading },
      user,
    } = this.props

    if (loading) {
      return <div>Loading...</div>
    }

    let filteredList = TaskList
    filteredList = filteredList.filter(
      item =>
        item.taskName && item.taskName.toLowerCase().includes(this.state.filterName.toLowerCase()),
    )

    if (this.state.filterStatus) {
      filteredList = filteredList.filter(
        item =>
          item.status &&
          item.status.taskStatus.toLowerCase().includes(this.state.filterStatus.toLowerCase()),
      )
    }
    if (this.state.filterType) {
      filteredList = filteredList.filter(
        item =>
          item.taskType &&
          item.taskType.taskType.toLowerCase() === this.state.filterType.toLowerCase(),
      )
    }
    if (this.state.filterPriority) {
      filteredList = filteredList.filter(
        item =>
          item.priority &&
          item.priority.name.toLowerCase().includes(this.state.filterPriority.toLowerCase()),
      )
    }

    let status = TaskList.reduce(function (sum, current) {
      return sum.concat(current.status ? current.status : [])
    }, [])

    let statusGrouped = status.reduce(function (groups, item) {
      const val = item.taskStatus
      groups.includes(val) ? null : groups.push(val)
      return groups
    }, [])

    let types = TaskList.reduce(function (sum, current) {
      return sum.concat(current.taskType ? current.taskType : [])
    }, [])

    let typesGrouped = types.reduce(function (groups, item) {
      const val = item.taskType

      groups.includes(val) ? null : groups.push(val)
      return groups
    }, [])

    let priorities = TaskList.reduce(function (sum, current) {
      return sum.concat(current.priority ? current.priority : [])
    }, [])

    let prioritiesGrouped = priorities.reduce(function (groups, item) {
      const val = item.name

      groups.includes(val) ? null : groups.push(val)
      return groups
    }, [])

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
        name: 'Task Name',
        selector: 'taskName',
        sortable: true,
        minWidth: '250px',
        maxWidth: '250px',
        cell: row =>
          user.role !== 'parents' ? (
            <Button
              onClick={() => this.info(row)}
              type="link"
              style={{ padding: '0px', fontWeight: 'bold', fontSize: '11px' }}
            >
              {row.taskName}
            </Button>
          ) : (
              <span style={{ padding: '0px', fontWeight: 'bold', fontSize: '11px' }}>
                {row.taskName}
              </span>
            ),
      },
      {
        name: 'Description',
        selector: 'description',
        minWidth: '250px',
        maxWidth: '250px',
      },
      {
        name: 'Status',
        selector: 'status.taskStatus',
      },
      {
        name: 'Type',
        selector: 'taskType.taskType',
      },
      {
        name: 'Priority',
        cell: e => (
          <>
            {e.priority?.name}
          </>
        ),

      },
      {
        name: 'Start Date',
        selector: 'startDate',
      },
      {
        name: 'End Date',
        selector: 'dueDate',
      },
      {
        name: 'Complete',
        minWidth: '80px',
        maxWidth: '80px',
        cell: e => (
          <span
            onClick={e => {
              e.stopPropagation()
            }}
          >
            <Popconfirm
              title="Sure to close this task?"
              onConfirm={() => this.closeTask(e, e.status)}
            >
              <Button type="link">
                <CheckCircleOutlined style={{ color: 'green' }} />
              </Button>
            </Popconfirm>
          </span>
        ),
      },
    ]

    const { divShow, filterShow } = this.state
    const divClass = divShow ? 'col-sm-8' : 'col-sm-12'

    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'

    const exportToCSV = () => {
      const filename = 'tasks_excel'
      let formattedData = filteredList.map(function (e) {
        return {
          Name: e.taskName,
          Description: e.description,
          Status: e.status ? e.status.taskStatus : '',
          Type: e.taskType ? e.taskType.taskType : '',
          Priority: e.priority ? e.priority.name : '',
          StartDate: e.startDate,
          EndDate: e.dueDate,
        }
      })

      const ws = XLSX.utils.json_to_sheet(formattedData)
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const data = new Blob([excelBuffer], { type: fileType })
      FileSaver.saveAs(data, filename + fileExtension)
    }

    const exportPDF = () => {
      const unit = 'pt'
      const size = 'A4' // Use A1, A2, A3 or A4
      const orientation = 'portrait' // portrait or landscape

      const doc = new JsPDF(orientation, unit, size)

      doc.setFontSize(10)

      const title = 'Tasks List'
      const headers = [
        ['Name', 'Description', 'Status', 'Type', 'Priority', 'StartDate', 'EndDate'],
      ]

      const data = filteredList.map(e => [
        e.taskName,
        e.description,
        e.status ? e.status.taskStatus : '',
        e.taskType ? e.taskType.taskType : '',
        e.priority ? e.priority.name : '',
        e.startDate,
        e.dueDate,
      ])

      let content = {
        startY: 50,
        head: headers,
        body: data,
      }

      doc.text(title, 10, 10)
      doc.autoTable(content)
      doc.save('tasks.pdf')
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
      <Authorize roles={['school_admin', 'therapist', 'parents']} redirect to="/dashboard/beta">
        <Helmet title="Partner" />
        <Drawer
          title="Filters"
          placement="left"
          closable={true}
          onClose={() => this.filterToggle(filterShow)}
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
              <span style={{ fontSize: '15px', color: '#000' }}>Status :</span>
              <Select
                size="small"
                value={this.state.filterStatus}
                onSelect={value => this.setState({ filterStatus: value })}
                style={{ width: 188 }}
              >
                <Select.Option value="">Select Status</Select.Option>
                <Select.Option value="Open">Open</Select.Option>
                <Select.Option value="Close">Close</Select.Option>
                {/* {statusGrouped.map((i, index) => {
                  return <Select.Option value={i}>{i}</Select.Option>
                })} */}
              </Select>
            </div>
            <div className="filter_sub_div">
              <span style={{ fontSize: '15px', color: '#000' }}>Type :</span>

              <Select
                size="small"
                value={this.state.filterType}
                onSelect={value => this.setState({ filterType: value })}
                style={{ width: 188 }}
              >
                <Select.Option value="">Select Type</Select.Option>
                {typesGrouped.map((i, index) => {
                  return <Select.Option value={i}>{i}</Select.Option>
                })}
              </Select>
            </div>

            <div className="filter_sub_div">
              <span style={{ fontSize: '15px', color: '#000' }}>Priority :</span>

              <Select
                size="small"
                value={this.state.filterPriority}
                onSelect={value => this.setState({ filterPriority: value })}
                style={{ width: 188 }}
              >
                <Select.Option value="">Select Priority</Select.Option>
                {prioritiesGrouped.map((i, index) => {
                  return <Select.Option value={i}>{i}</Select.Option>
                })}
              </Select>
            </div>
          </div>
        </Drawer>

        <Drawer
          title="UPDATE TASK"
          width="50%"
          placement="right"
          closable={true}
          onClose={() => this.setState({ divShow: false })}
          visible={divShow}
        >
          <CreateTask {...this.props} task={SelectedTask} />
          {/* <EditTaskInformation key={divShow ? SelectedTask.id : null} /> */}
        </Drawer>

        <Drawer
          title="CREATE TASK"
          width="50%"
          placement="right"
          closable={true}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <CreateTask {...this.props} />
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
              this.state.filterPriority ||
              this.state.filterStatus ||
              this.state.filterType ? (
                <Button
                  type="link"
                  style={{ marginLeft: '10px', color: '#FEBB27' }}
                  onClick={() =>
                    this.setState({
                      filterName: '',
                      filterPriority: '',
                      filterStatus: '',
                      filterType: '',
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
            <span style={{ fontSize: '25px', color: '#000' }}>Tasks List</span>
          </div>
          <div style={{ padding: '5px 0px' }}>
            <Dropdown overlay={menu} trigger={['click']}>
              <Button style={{ marginRight: '10px' }} type="link" size="large">
                <CloudDownloadOutlined />{' '}
              </Button>
            </Dropdown>

            <Button onClick={this.showDrawer} type="primary">
              <PlusOutlined /> ADD TASK
            </Button>
          </div>
        </div>

        <div className="row">
          <div className={divClass}>
            <div className="row">
              <div className={divClass}>
                <div style={{ margin: '5px', marginBottom: '50px' }}>
                  <DataTable
                    title="Tasks List"
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
            </div>


          </div>


        </div>
      </Authorize>
    )
  }
}

export default TaskTable

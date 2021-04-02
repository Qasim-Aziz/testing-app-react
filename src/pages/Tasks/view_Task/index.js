/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
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
  Typography,
  Radio,
} from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import { Scrollbars } from 'react-custom-scrollbars'
import {
  PlusOutlined,
  CloseCircleOutlined,
  CloudDownloadOutlined,
  MinusOutlined,
  CommentOutlined,
} from '@ant-design/icons'
import { RiCheckboxCircleLine, RiCheckboxBlankCircleLine } from 'react-icons/ri'
import { connect } from 'react-redux'
import DataTable from 'react-data-table-component'
import JsPDF from 'jspdf'
import moment from 'moment'
import 'jspdf-autotable'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import CreateOrUpdateTask from '../CreateOrUpdateTask'
import TaskTimeline from '../TaskTimeline'
import { COLORS, DRAWER } from '../../../assets/styles/globalStyles'
import './style.scss'

const { Meta } = Card
const { Text } = Typography

const tableFilterStyles = { margin: '0px 32px 0 8px' }

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
    filterStatus: 'Open',
    filterType: '',
    filterPriority: '',

    // for create task drawer
    visible: false,

    selectedTaskType: 'Open',
    taskCommentDrawer: false,
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
        updateReminderState: true,
      },
    })
    this.setState({
      divShow: true,
    })
  }

  commentInfo = e => {
    const { dispatch } = this.props

    dispatch({
      type: 'tasks/SET_STATE',
      payload: {
        SelectedTask: e,
      },
    })
    this.setState({
      taskCommentDrawer: true,
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

  incrementCounter = (count, id, row) => {
    const { dispatch } = this.props
    count += 1
    dispatch({
      type: 'tasks/UPDATE_TASK_COUNTER',
      payload: {
        id,
        count,
      },
    })
  }

  decrementCounter = (count, id) => {
    const { dispatch } = this.props
    count -= 1
    dispatch({
      type: 'tasks/UPDATE_TASK_COUNTER',
      payload: {
        id,
        count,
      },
    })
  }

  closeTask = (e, status) => {
    console.log('close task ===> ', e, status)
    const { dispatch } = this.props
    if (status.taskStatus === 'Closed') {
      dispatch({
        type: 'tasks/UPDATE_TASK_STATUS',
        payload: {
          id: e.id,
          status: 'VGFza1N0YXR1c1R5cGU6MQ==',
        },
      })
    } else {
      dispatch({
        type: 'tasks/UPDATE_TASK_STATUS',
        payload: {
          id: e.id,
          status: 'VGFza1N0YXR1c1R5cGU6Mg==',
        },
      })
    }
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

    let status = TaskList.reduce(function(sum, current) {
      return sum.concat(current.status ? current.status : [])
    }, [])

    let statusGrouped = status.reduce(function(groups, item) {
      const val = item.taskStatus
      groups.includes(val) ? null : groups.push(val)
      return groups
    }, [])

    let types = TaskList.reduce(function(sum, current) {
      return sum.concat(current.taskType ? current.taskType : [])
    }, [])

    let typesGrouped = types.reduce(function(groups, item) {
      const val = item.taskType

      groups.includes(val) ? null : groups.push(val)
      return groups
    }, [])

    let priorities = TaskList.reduce(function(sum, current) {
      return sum.concat(current.priority ? current.priority : [])
    }, [])

    let prioritiesGrouped = priorities.reduce(function(groups, item) {
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
          fontSize: '13px',
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
          fontSize: '12px',
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
        name: 'Summary',
        selector: 'description',
        minWidth: '250px',
        maxWidth: '250px',
      },
      {
        name: 'Status',
        // selector: 'status?.taskStatus',
        cell: row => row?.status?.taskStatus,
      },
      {
        name: 'Type',
        // selector: 'taskType?.taskType',
        cell: row => row?.taskType?.taskType,
      },
      {
        name: 'Priority',
        cell: e => <>{e?.priority?.name}</>,
      },
      {
        name: 'Start Date',
        // selector: 'startDate',
        cell: row => row?.startDate,
      },
      {
        name: 'End Date',
        // selector: 'dueDate',
        cell: row => row?.dueDate,
      },
      {
        name: (
          <span
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: '100px',
              maxWidth: '130px',
            }}
          >
            Count
          </span>
        ),
        minWidth: '100px',
        maxWidth: '120px',
        cell: row => {
          const {
            taskcounterSet: { edges },
          } = row
          const currentCount = edges.length
            ? edges[edges.length - 1].node.date === moment().format('YYYY-MM-DD')
              ? edges[edges.length - 1].node.count
              : 0
            : 0
          return (
            <>
              <Button
                disabled={currentCount === 0}
                onClick={() => {
                  this.decrementCounter(currentCount, row.id)
                }}
                size="small"
              >
                <MinusOutlined style={{ fontSize: '12px' }} />
              </Button>
              <Text className="taskCompletionCount" style={{ margin: '0 6px', fontSize: '14px' }}>
                {currentCount}
              </Text>
              <Button
                onClick={() => {
                  this.incrementCounter(currentCount, row.id, row)
                }}
                size="small"
              >
                <PlusOutlined style={{ fontSize: '12px' }} />
              </Button>
            </>
          )
        },
      },
      {
        name: 'Action',
        width: '120px',
        cell: e => (
          <span
            onClick={e => {
              e?.stopPropagation()
            }}
            style={{ display: 'flex', alignItems: 'baseline' }}
          >
            <Popconfirm
              title={`Sure to ${
                e?.status?.taskStatus === 'Closed' ? 're-open' : 'close'
              } this task?`}
              onConfirm={() => this.closeTask(e, e?.status)}
            >
              <Button type="link">
                {e?.status?.taskStatus === 'Closed' ? (
                  <RiCheckboxCircleLine style={{ color: 'green', fontSize: '1.4em' }} />
                ) : (
                  <RiCheckboxBlankCircleLine style={{ color: 'green', fontSize: '1.4em' }} />
                )}
              </Button>
            </Popconfirm>
            <CommentOutlined
              style={{ color: COLORS.palleteBlue, fontSize: '1.5em' }}
              onClick={() => this.commentInfo(e)}
              type="link"
            />
          </span>
        ),
      },
    ]

    const { divShow, filterShow } = this.state
    const divClass = 'col-sm-12'

    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'

    const exportToCSV = () => {
      const filename = 'tasks_excel'
      let formattedData = filteredList.map(function(e) {
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
      <div className="task-list-index">
        <Authorize roles={['school_admin', 'therapist', 'parents']} redirect to="/dashboard/beta">
          <Helmet title="Partner" />
          <Drawer
            title="Filters"
            placement="left"
            closable={true}
            onClose={() => this.filterToggle(filterShow)}
            visible={filterShow}
            width={DRAWER.widthL2}
          >
            <div>
              <div className="filter_sub_div">
                <span style={{ fontSize: '15px', color: COLORS.blackLighten }}>Name :</span>
                <Input
                  size="small"
                  placeholder="Search Name"
                  value={this.state.filterName}
                  onChange={e => this.setState({ filterName: e.target.value })}
                  style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
              </div>

              <div className="filter_sub_div">
                <span style={{ fontSize: '15px', color: COLORS.blackLighten }}>Status :</span>
                <Select
                  size="small"
                  value={this.state.filterStatus}
                  onSelect={value => this.setState({ filterStatus: value })}
                  style={{ width: 188 }}
                >
                  <Select.Option value="">Select Status</Select.Option>
                  <Select.Option value="Open">Open</Select.Option>
                  <Select.Option value="In-progress">In Progress</Select.Option>
                  <Select.Option value="Close">Close</Select.Option>
                </Select>
              </div>
              <div className="filter_sub_div">
                <span style={{ fontSize: '15px', color: COLORS.blackLighten }}>Type :</span>

                <Select
                  size="small"
                  value={this.state.filterType}
                  onSelect={value => this.setState({ filterType: value })}
                  style={{ width: 188 }}
                >
                  <Select.Option value="">Select Type</Select.Option>
                  {typesGrouped.map((i, index) => {
                    return (
                      <Select.Option key={i} value={i}>
                        {i}
                      </Select.Option>
                    )
                  })}
                </Select>
              </div>

              <div className="filter_sub_div">
                <span style={{ fontSize: '15px', color: COLORS.blackLighten }}>Priority :</span>

                <Select
                  size="small"
                  value={this.state.filterPriority}
                  onSelect={value => this.setState({ filterPriority: value })}
                  style={{ width: 188 }}
                >
                  <Select.Option value="">Select Priority</Select.Option>
                  {prioritiesGrouped.map((i, index) => {
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
            title="TIMELINE"
            width={DRAWER.widthL3}
            placement="right"
            closable={true}
            onClose={() => this.setState({ taskCommentDrawer: false })}
            visible={this.state.taskCommentDrawer}
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
              <TaskTimeline
                {...this.props}
                task={SelectedTask}
                onClose={() => this.setState({ taskCommentDrawer: false })}
              />
            </div>
          </Drawer>

          <Drawer
            title="CREATE TASK"
            width={DRAWER.widthL1}
            placement="right"
            closable={true}
            onClose={this.onClose}
            visible={this.state.visible}
          >
            <CreateOrUpdateTask {...this.props} onClose={() => this.setState({ divShow: false })} />
          </Drawer>

          <Drawer
            title="UPDATE TASK"
            width={DRAWER.widthL1}
            placement="right"
            closable={true}
            onClose={() => this.setState({ divShow: false })}
            visible={divShow}
          >
            <CreateOrUpdateTask
              {...this.props}
              task={SelectedTask}
              onClose={() => this.setState({ divShow: false })}
            />
          </Drawer>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0px 10px',
              backgroundColor: COLORS.grayLightenMore,
              boxShadow: '0 1px 6px rgba(0,0,0,.12), 0 1px 4px rgba(0,0,0,.12)',
            }}
          >
            <div style={{ padding: '5px 0px' }}>
              {/* <Button onClick={() => this.filterToggle(filterShow)} size="large">
              <FilterOutlined />
            </Button> */}

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
              <span style={{ fontSize: '25px', color: COLORS.blackLighten }}>Tasks List</span>
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

          <div className="row" style={{ width: '100%' }}>
            <div className={divClass} style={{ paddingRight: 0 }}>
              <div style={{ margin: '20px', marginBottom: '50px', marginRight: 0 }}>
                <div className="filter_div">
                  <span style={{ display: 'flex', alignItems: 'center', zIndex: 45 }}>
                    <span>Name :</span>
                    <Input
                      size="small"
                      placeholder="Task Name"
                      value={this.state.filterName}
                      onChange={e => this.setState({ filterName: e.target.value })}
                      style={{ ...tableFilterStyles, width: '112px' }}
                    />
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      zIndex: 45,
                      ...tableFilterStyles,
                    }}
                  >
                    <Radio.Group
                      size="small"
                      buttonStyle="solid"
                      value={this.state.filterStatus}
                      onChange={e => this.setState({ filterStatus: e.target.value })}
                      style={{ zIndex: 45 }}
                    >
                      <Radio.Button value="">All</Radio.Button>
                      <Radio.Button value="Open">Open</Radio.Button>
                      <Radio.Button value="In-progress">In Progress</Radio.Button>
                      <Radio.Button value="Close">Close</Radio.Button>
                    </Radio.Group>
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      zIndex: 45,
                      ...tableFilterStyles,
                    }}
                  >
                    <Radio.Group
                      size="small"
                      buttonStyle="solid"
                      value={this.state.filterPriority}
                      onChange={e => this.setState({ filterPriority: e.target.value })}
                    >
                      <Radio.Button value="">All</Radio.Button>
                      {prioritiesGrouped.map((i, index) => {
                        return (
                          <Radio.Button key={i} value={i}>
                            {i}
                          </Radio.Button>
                        )
                      })}
                    </Radio.Group>
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      zIndex: 45,
                      ...tableFilterStyles,
                    }}
                  >
                    <Select
                      size="small"
                      value={this.state.filterType}
                      onSelect={value => this.setState({ filterType: value })}
                      style={{ width: 140 }}
                    >
                      <Select.Option value="">Select Type</Select.Option>
                      {typesGrouped.map((i, index) => {
                        return (
                          <Select.Option key={i} value={i}>
                            {i}
                          </Select.Option>
                        )
                      })}
                    </Select>
                  </span>
                </div>
                <DataTable
                  title="Tasks List"
                  columns={columns}
                  theme="default"
                  // dense={true}
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
      </div>
    )
  }
}

export default TaskTable
